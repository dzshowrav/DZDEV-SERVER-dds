import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, rmSync } from 'fs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { withSpinner } from './spinner.js';
import { renderLogo, renderHeader } from './logo.js';
import { getHosts, addHost, removeHost, editHost, setDefaultRoot, loadHosts, saveHosts } from './hosts.js';
import { generateVhostConfig, getDefaultPort } from './vhost.js';

const DDS_DIR = process.env.HOME + '/dds';
const MYSQL_PID_FILE = '/data/data/com.termux/files/usr/var/run/mariadb.pid';
const APACHE_PORT = 8080;
const APACHE_SSL_PORT = 8443;
const HTDOCS_DIR = '/sdcard/htdocs';

function apachePids() {
  try {
    const out = execSync('pgrep httpd', { encoding: 'utf8' }).trim();
    return out ? out.split('\n') : [];
  } catch { return []; }
}

function mysqlPid() {
  try {
    return execSync(`cat ${MYSQL_PID_FILE} 2>/dev/null`, { encoding: 'utf8' }).trim();
  } catch { return ''; }
}

function mysqlRunning() {
  const pid = mysqlPid();
  if (!pid) return false;
  try { return process.kill(parseInt(pid), 0); }
  catch { return false; }
}

function apacheRunning() {
  try { return execSync('pgrep httpd', { encoding: 'utf8' }).trim().length > 0; }
  catch { return false; }
}

export async function doStart(ssl = false) {
  execSync(`mkdir -p ${HTDOCS_DIR}`, { stdio: 'ignore' });

  await withSpinner('Starting Apache...', () => {
    if (apacheRunning()) return true;
    try {
      const runDir = PREFIX + '/var/run/apache2';
      if (existsSync(runDir)) {
        for (const f of readdirSync(runDir)) rmSync(runDir + '/' + f, { force: true });
      }
    } catch {}
    try {
      execSync('apachectl start 2>/dev/null', { stdio: 'ignore', timeout: 10000 });
    } catch {
      if (!apacheRunning()) throw new Error('Apache failed to start');
    }
    return true;
  });

  await withSpinner('Starting MariaDB...', () => {
    if (mysqlRunning()) return true;
    execSync(`mariadbd-safe --pid-file="${MYSQL_PID_FILE}" &`, { stdio: 'ignore' });
    return new Promise(resolve => {
      let tries = 0;
      const iv = setInterval(() => {
        tries++;
        if (mysqlRunning() || tries >= 5) {
          clearInterval(iv);
          resolve(true);
        }
      }, 1500);
    });
  });

  const port = ssl ? APACHE_SSL_PORT : APACHE_PORT;
  const proto = ssl ? 'https' : 'http';
  console.log(chalk.green('\n  ✓ DDS is running!'));
  console.log(chalk.dim(`  Open: ${chalk.underline(`${proto}://localhost:${port}/`)}\n`));
  execSync(`termux-open-url "${proto}://localhost:${port}/"`, { stdio: 'ignore' });
}

function waitForStop(check, label) {
  return new Promise(resolve => {
    let tries = 0;
    const iv = setInterval(() => {
      tries++;
      if (!check() || tries >= 8) {
        clearInterval(iv);
        resolve();
      }
    }, 500);
  });
}

export async function doStop() {
  await withSpinner('Stopping Apache...', () => {
    try { execSync('apachectl stop 2>/dev/null', { stdio: 'ignore' }); } catch {}
    return waitForStop(() => {
      try { return execSync('pgrep httpd', { stdio: 'pipe' }).trim().length === 0; }
      catch { return true; }
    }, 'Apache');
  });

  await withSpinner('Stopping MariaDB...', () => {
    const pid = mysqlPid();
    if (pid) {
      try { process.kill(parseInt(pid), 'SIGTERM'); } catch {}
      try { execSync(`rm -f ${MYSQL_PID_FILE}`, { stdio: 'ignore' }); } catch {}
    } else {
      try { execSync('pkill mariadb 2>/dev/null', { stdio: 'ignore' }); } catch {}
    }
    return waitForStop(() => {
      try { process.kill(parseInt(mysqlPid()), 0); return false; }
      catch { return true; }
    }, 'MariaDB');
  });

  console.log(chalk.green('\n  ✓ DDS stopped\n'));
}

export async function doStatus() {
  let back = false;
  while (!back) {
    console.clear();

    const { logo } = renderLogo();
    console.log(logo);
    renderHeader('DDS Status');

    const apachePidList = apachePids();
    const mysqlPidVal = mysqlPid();
    const mysqlIsRunning = mysqlRunning();
    const pmaInstalled = existsSync(`${HTDOCS_DIR}/phpmyadmin/index.php`);
    const apacheOnline = apachePidList.length > 0;

    const apacheStatus = apacheOnline
      ? chalk.bold.green('● RUNNING') + chalk.dim(`  (${apachePidList.length} processes, port ${APACHE_PORT})`)
      : chalk.bold.red('● STOPPED');

    const mysqlStatus = mysqlIsRunning
      ? chalk.bold.green('● RUNNING') + chalk.dim(`  (PID ${mysqlPidVal})`)
      : chalk.bold.red('● STOPPED');

    const pmaStatus = pmaInstalled
      ? chalk.bold.green('● INSTALLED') + chalk.dim('  /phpmyadmin/')
      : chalk.bold.yellow('● NOT INSTALLED');

    console.log(`  ${chalk.hex('#00d4aa')('▸')} Apache    ${apacheStatus}`);
    console.log(`  ${chalk.hex('#00d4aa')('▸')} MariaDB   ${mysqlStatus}`);
    console.log(`  ${chalk.hex('#00d4aa')('▸')} phpMyAdmin ${pmaStatus}`);
    console.log();

    const choices = [];

    if (apacheOnline) {
      choices.push({ name: `${chalk.green('○')}  ${chalk.bold('Open HTTP')}      ${chalk.dim('http://localhost:' + APACHE_PORT + '/')}`, value: 'http' });
      choices.push({ name: `${chalk.green('○')}  ${chalk.bold('Open HTTPS')}     ${chalk.dim('https://localhost:' + APACHE_SSL_PORT + '/')}`, value: 'https' });
    }
    if (pmaInstalled && apacheOnline) {
      choices.push({ name: `${chalk.green('○')}  ${chalk.bold('Open phpMyAdmin')} ${chalk.dim('http://localhost:' + APACHE_PORT + '/phpmyadmin/')}`, value: 'pma' });
    }
    choices.push(new inquirer.Separator());
    choices.push({ name: `${chalk.dim('←')}  ${chalk.bold('Back to Home')}`, value: 'back' });

    const { action } = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: chalk.hex('#00d4aa')('Quick actions:'),
      choices,
      pageSize: 8,
      loop: false,
    }]);

    switch (action) {
      case 'http':
        execSync(`termux-open-url "http://localhost:${APACHE_PORT}/"`, { stdio: 'ignore' });
        break;
      case 'https':
        execSync(`termux-open-url "https://localhost:${APACHE_SSL_PORT}/"`, { stdio: 'ignore' });
        break;
      case 'pma':
        execSync(`termux-open-url "http://localhost:${APACHE_PORT}/phpmyadmin/"`, { stdio: 'ignore' });
        break;
      case 'back':
        back = true;
        break;
    }
  }
}

export async function doRestart() {
  renderHeader('Restarting DDS');
  await doStop();
  await new Promise(r => setTimeout(r, 1000));
  await doStart();
}

export function doUpdate() {
  renderHeader('Update DDS');
  try {
    const result = execSync(`cd ${DDS_DIR} && git remote update 2>/dev/null && git status -uno | grep -q 'up to date'`, { stdio: 'pipe' });
    console.log(chalk.yellow('  Already up to date.\n'));
  } catch {
    withSpinner('Updating DDS...', () => {
      execSync(`cd ${DDS_DIR} && git reset --hard HEAD && git pull`, { stdio: 'pipe' });
      execSync(`bash ${DDS_DIR}/update`, { stdio: 'inherit' });
      return true;
    });
    console.log(chalk.green('  DDS updated successfully\n'));
  }
}

function reloadApache() {
  try {
    execSync('apachectl -k graceful 2>/dev/null', { stdio: 'ignore' });
  } catch {
    try { execSync('apachectl restart 2>/dev/null', { stdio: 'ignore' }); } catch {}
  }
}

export async function doRoot() {
  const data = loadHosts();
  const { newRoot } = await inquirer.prompt([{
    type: 'input',
    name: 'newRoot',
    message: 'Enter new document root path:',
    default: data.defaultRoot,
    validate: v => v.trim() ? true : 'Path cannot be empty',
  }]);

  newRoot.trim();
  if (!existsSync(newRoot)) {
    mkdirSync(newRoot, { recursive: true });
  }
  setDefaultRoot(newRoot);
  generateVhostConfig();
  reloadApache();
  console.log(chalk.green('\n  Document root changed to: ' + newRoot + '\n'));
}

export async function doHostManager() {
  let back = false;
  while (!back) {
    console.clear();
    const { logo } = renderLogo();
    console.log(logo);
    renderHeader('Host Manager');

    const hosts = getHosts();
    console.log('  ' + chalk.bold('Current Hosts:'));
    console.log();
    for (const h of hosts) {
      const active = chalk.hex('#00d4aa')('>');
      console.log('    ' + active + '  ' + chalk.bold(h.name) + chalk.dim('  :' + h.port + '  ') + h.root);
    }
    console.log();

    const { action } = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: 'Host Manager:',
      choices: [
        { name: '+  Create Host', value: 'create' },
        { name: '~  Edit Host', value: 'edit' },
        { name: '-  Delete Host', value: 'delete' },
        new inquirer.Separator(),
        { name: '   Back to Home', value: 'back' },
      ],
      pageSize: 8,
      loop: false,
    }]);

    switch (action) {
      case 'create':
        await doHostCreate();
        break;
      case 'edit':
        await doHostEdit();
        break;
      case 'delete':
        await doHostDelete();
        break;
      case 'back':
        back = true;
        break;
    }
  }
}

async function doHostCreate() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Host name:',
      validate: v => /^[a-zA-Z0-9_-]+$/.test(v) ? true : 'Use only letters, numbers, hyphens, underscores',
    },
    {
      type: 'input',
      name: 'port',
      message: 'Port number:',
      default: () => {
        const hosts = getHosts();
        const used = new Set(hosts.map(h => h.port));
        for (let p = 8081; p < 9000; p++) {
          if (!used.has(p)) return p;
        }
        return 8081;
      },
      validate: v => {
        const n = parseInt(v);
        if (isNaN(n) || n < 1024 || n > 65535) return 'Use a port between 1024 and 65535';
        const hosts = getHosts();
        if (hosts.find(h => h.port === n)) return 'Port ' + n + ' is already in use';
        return true;
      },
    },
    {
      type: 'input',
      name: 'root',
      message: 'Document root path:',
      default: '/sdcard/htdocs/' + '{name}',
      filter: v => v.replace('{name}', v === '/sdcard/htdocs/{name}' ? '' : ''),
      validate: v => v.trim() ? true : 'Path cannot be empty',
    },
  ]);

  answers.root.trim();
  if (!existsSync(answers.root)) {
    mkdirSync(answers.root, { recursive: true });
    console.log(chalk.dim('  Created directory: ' + answers.root));
  }

  try {
    addHost(answers.name, parseInt(answers.port), answers.root);
    generateVhostConfig();
    reloadApache();
    console.log(chalk.green('\n  Host "' + answers.name + '" created on port ' + answers.port + '\n'));
  } catch (err) {
    console.log(chalk.red('\n  ' + err.message + '\n'));
  }
}

async function doHostEdit() {
  const hosts = getHosts();
  if (hosts.length <= 1) {
    console.log(chalk.yellow('\n  No extra hosts to edit.\n'));
    return;
  }

  const { name } = await inquirer.prompt([{
    type: 'list',
    name: 'name',
    message: 'Select host to edit:',
    choices: hosts.map(h => ({ name: h.name + '  :' + h.port + '  ' + h.root, value: h.name })),
  }]);

  const host = hosts.find(h => h.name === name);
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'port',
      message: 'New port (leave empty to keep ' + host.port + '):',
      default: host.port,
      validate: v => {
        if (!v.trim()) return true;
        const n = parseInt(v);
        if (isNaN(n) || n < 1024 || n > 65535) return 'Use a port between 1024 and 65535';
        return true;
      },
    },
    {
      type: 'input',
      name: 'root',
      message: 'New root path (leave empty to keep ' + host.root + '):',
      default: host.root,
      validate: v => v.trim() ? true : 'Path cannot be empty',
    },
  ]);

  const updates = {};
  if (answers.port && parseInt(answers.port) !== host.port) updates.port = parseInt(answers.port);
  if (answers.root && answers.root !== host.root) updates.root = answers.root;

  if (Object.keys(updates).length === 0) {
    console.log(chalk.yellow('\n  No changes made.\n'));
    return;
  }

  try {
    editHost(name, updates);
    generateVhostConfig();
    reloadApache();
    console.log(chalk.green('\n  Host "' + name + '" updated.\n'));
  } catch (err) {
    console.log(chalk.red('\n  ' + err.message + '\n'));
  }
}

async function doHostDelete() {
  const hosts = getHosts();
  if (hosts.length <= 1) {
    console.log(chalk.yellow('\n  No extra hosts to delete.\n'));
    return;
  }

  const { name, confirm } = await inquirer.prompt([
    {
      type: 'list',
      name: 'name',
      message: 'Select host to delete:',
      choices: hosts.filter(h => h.name !== 'default').map(h => ({
        name: h.name + '  :' + h.port + '  ' + h.root,
        value: h.name,
      })),
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Delete this host?',
      default: false,
    },
  ]);

  if (!confirm) {
    console.log(chalk.dim('\n  Cancelled.\n'));
    return;
  }

  try {
    removeHost(name);
    generateVhostConfig();
    reloadApache();
    console.log(chalk.green('\n  Host "' + name + '" deleted.\n'));
  } catch (err) {
    console.log(chalk.red('\n  ' + err.message + '\n'));
  }
}
