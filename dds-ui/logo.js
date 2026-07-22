import chalk from 'chalk';

function getWidth() {
  return process.stdout.columns || 80;
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

export function centerPad(str, width) {
  const visible = str.replace(/\u001b\[[0-9;]*m/g, '');
  const pad = Math.max(0, Math.floor((width - visible.length) / 2));
  return ' '.repeat(pad) + str;
}

export function renderHeader(title) {
  const w = getWidth();
  const line = chalk.hex('#00d4aa')('━'.repeat(50));
  console.log(`\n${centerPad(line, w)}`);
  console.log(centerPad(chalk.bold(title), w));
  console.log(`${centerPad(line, w)}\n`);
}
