import { execSync } from 'child_process';
import chalk from 'chalk';

function getWidth() {
  return process.stdout.columns || 80;
}

function apacheRunning() {
  try { return execSync('pgrep httpd', { encoding: 'utf8' }).trim().length > 0; }
  catch { return false; }
}

function mysqlRunning() {
  try {
    const pid = execSync('cat /data/data/com.termux/files/usr/var/run/mariadb.pid 2>/dev/null', { encoding: 'utf8' }).trim();
    if (!pid) return false;
    process.kill(parseInt(pid), 0);
    return true;
  } catch { return false; }
}

const pulse = ['#00d4aa', '#00c4a0', '#00b496', '#00a48c', '#009482', '#008478', '#00746e', '#008478', '#009482', '#00a48c', '#00b496', '#00c4a0'];
const spinners = ['◜', '◝', '◞', '◟'];

export function renderBadge(frame) {
  const apache = apacheRunning();
  const mysql = mysqlRunning();
  const w = getWidth();

  if (!apache && !mysql) {
    const txt = chalk.red('●') + '  ' + chalk.dim('Server Offline');
    return '\n' + centerPad(txt, w);
  }

  if (!mysql) {
    const txt = chalk.yellow('●') + '  ' + chalk.bold.yellow('DEGRADED') + chalk.dim('  Apache only (MariaDB down)');
    return '\n' + centerPad(txt, w);
  }

  const dot = chalk.hex(pulse[frame % pulse.length])('●');
  const spin = chalk.hex('#00d4aa')(spinners[frame % spinners.length]);
  const txt = `${dot}  ${chalk.bold('ACTIVE')} ${chalk.dim('·')} ${chalk.green('Apache')} ${chalk.dim('+')} ${chalk.green('MariaDB')} ${chalk.dim('·')} ${spin}`;
  return '\n' + centerPad(txt, w);
}

export function renderLogo() {
  const w = getWidth();
  const lines = [
    chalk.hex('#00d4aa')('██████╗ ██████╗ ███████╗'),
    chalk.hex('#00c4a0')('██╔══██╗██╔══██╗██╔════╝'),
    chalk.hex('#00b496')('██║  ██║██║  ██║███████╗'),
    chalk.hex('#00a48c')('██║  ██║██║  ██║╚════██║'),
    chalk.hex('#009482')('██████╔╝██████╔╝███████║'),
    chalk.hex('#008478')('╚═════╝ ╚═════╝ ╚══════╝'),
    chalk.hex('#00746e')('═══════════════════════════'),
  ];

  const logo = '\n' + lines.map(l => centerPad(l, w)).join('\n') + '\n';

  const tagline = centerPad(
    chalk.dim('Termux • Apache • MariaDB • PHP') + '  ' + chalk.hex('#00d4aa')('█'),
    w,
  );

  return { logo, tagline };
}

function terminalWidth(s) {
  let w = 0;
  for (const ch of s) {
    const c = ch.charCodeAt(0);
    if (c >= 0x2500 && c <= 0x259F) w += 2;
    else if (c >= 0x2E80 && c <= 0x9FFF) w += 2;
    else if (c >= 0xFF01 && c <= 0xFF60) w += 2;
    else if (c >= 0xAC00 && c <= 0xD7AF) w += 2;
    else if (c >= 0x1F000 && c <= 0x1FFFF) w += 2;
    else w += 1;
  }
  return w;
}

export function centerPad(str, width) {
  const visible = str.replace(/\u001b\[[0-9;]*m/g, '');
  if (visible.length <= 0) return str;
  const pad = Math.max(0, Math.floor((width - terminalWidth(visible)) / 2));
  return ' '.repeat(pad) + str;
}

export function renderHeader(title) {
  const w = getWidth();
  const line = chalk.hex('#00d4aa')('━'.repeat(50));
  console.log(`\n${centerPad(line, w)}`);
  console.log(centerPad(chalk.bold(title), w));
  console.log(`${centerPad(line, w)}\n`);
}
