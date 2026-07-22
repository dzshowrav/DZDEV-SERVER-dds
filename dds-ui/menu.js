import inquirer from 'inquirer';
import chalk from 'chalk';

const choices = [
  {
    name: `${chalk.green('●')}  ${chalk.bold('Start')}       ${chalk.dim('Start DDS (HTTP :8080)')}`,
    value: 'start',
    short: 'Start',
  },
  {
    name: `${chalk.green('●')}  ${chalk.bold('Start SSL')}   ${chalk.dim('Start DDS with SSL (:8443)')}`,
    value: 'start-ssl',
    short: 'Start SSL',
  },
  {
    name: `${chalk.red('●')}  ${chalk.bold('Stop')}        ${chalk.dim('Stop all services')}`,
    value: 'stop',
    short: 'Stop',
  },
  {
    name: `${chalk.yellow('●')}  ${chalk.bold('Restart')}     ${chalk.dim('Restart DDS')}`,
    value: 'restart',
    short: 'Restart',
  },
  {
    name: `${chalk.cyan('●')}  ${chalk.bold('Status')}      ${chalk.dim('Show service status')}`,
    value: 'status',
    short: 'Status',
  },
  {
    name: `${chalk.blue('●')}  ${chalk.bold('Update')}      ${chalk.dim('Pull latest version')}`,
    value: 'update',
    short: 'Update',
  },
  {
    name: `${chalk.red('●')}  ${chalk.bold('Uninstall')}   ${chalk.dim('Remove DDS completely')}`,
    value: 'uninstall',
    short: 'Uninstall',
  },
  new inquirer.Separator(),
  {
    name: `${chalk.dim('✕')}  Exit`,
    value: 'exit',
    short: 'Exit',
  },
];

export async function showMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.hex('#00d4aa')('Select an action:'),
      choices,
      pageSize: 12,
      loop: false,
    },
  ]);
  return action;
}
