import { execSync } from 'child_process';
import chalk from 'chalk';
import { withSpinner } from './spinner.js';
import { renderHeader } from './logo.js';

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

export async function doStart(ssl = false) {
  execSync(`mkdir -p ${HTDOCS_DIR}`, { stdio: 'ignore' });

  await withSpinner('Starting Apache...', () => {
    execSync('apachectl start 2>/dev/null', { stdio: 'ignore' });
    return true;
  });

  await withSpinner('Starting MariaDB...', () => {
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

export async function doStop() {
  await withSpinner('Stopping Apache...', () => {
    try { execSync('apachectl stop 2>/dev/null', { stdio: 'ignore' }); } catch {}
    return true;
  });

  await withSpinner('Stopping MariaDB...', () => {
    const pid = mysqlPid();
    if (pid) {
      try { process.kill(parseInt(pid), 'SIGTERM'); } catch {}
      try { execSync(`rm -f ${MYSQL_PID_FILE}`, { stdio: 'ignore' }); } catch {}
    } else {
      try { execSync('pkill mariadb 2>/dev/null', { stdio: 'ignore' }); } catch {}
    }
    return true;
  });

  console.log(chalk.green('\n  ✓ DDS stopped\n'));
}

export async function doStatus() {
  renderHeader('DDS Status');

  const apachePidList = apachePids();
  const mysqlPidVal = mysqlPid();
  const mysqlIsRunning = mysqlRunning();

  const apacheStatus = apachePidList.length > 0
    ? chalk.bold.green(`● RUNNING`) + chalk.dim(`  (${apachePidList.length} processes, port ${APACHE_PORT})`)
    : chalk.bold.red(`● STOPPED`);

  const mysqlStatus = mysqlIsRunning
    ? chalk.bold.green(`● RUNNING`) + chalk.dim(`  (PID ${mysqlPidVal})`)
    : chalk.bold.red(`● STOPPED`);

  console.log(`  ${chalk.hex('#00d4aa')('▸')} Apache  ${apacheStatus}`);
  console.log(`  ${chalk.hex('#00d4aa')('▸')} MariaDB ${mysqlStatus}`);

  const apacheSSL = apachePidList.length > 0
    ? chalk.green('✓') + chalk.dim(` https://localhost:${APACHE_SSL_PORT}/`)
    : chalk.red('✗');

  console.log(`\n  ${chalk.dim('HTTP:')}  ${chalk.underline(`http://localhost:${APACHE_PORT}/`)}`);
  console.log(`  ${chalk.dim('SSL:')}   ${apacheSSL}`);
  console.log(`  ${chalk.dim('Root:')}  ${HTDOCS_DIR}\n`);
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
    console.log(chalk.green('  ✓ DDS updated successfully\n'));
  }
}
