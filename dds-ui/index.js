#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import { renderLogo } from './logo.js';
import { showMenu } from './menu.js';
import { doStart, doStop, doStatus, doRestart, doUpdate } from './commands.js';

const args = process.argv.slice(2);

async function main() {
  const { logo, tagline } = renderLogo();
  console.clear();
  console.log(logo);
  console.log(tagline);
  console.log();

  if (args.length > 0) {
    return runDirect(args[0]);
  }

  let running = true;
  while (running) {
    const action = await showMenu();

    switch (action) {
      case 'start':    await doStart(false); break;
      case 'start-ssl': await doStart(true); break;
      case 'stop':     await doStop(); break;
      case 'restart':  await doRestart(); break;
      case 'status':   await doStatus(); break;
      case 'update':   doUpdate(); break;
      case 'uninstall':
        const { confirm } = await inquirer.prompt([{
          type: 'confirm',
          name: 'confirm',
          message: chalk.red('Are you sure you want to uninstall DDS?'),
          default: false,
        }]);
        if (confirm) {
          await doStop();
          console.log(chalk.dim('  Uninstalling packages...'));
          process.exit(0);
        }
        break;
      case 'exit':
        running = false;
        console.log(chalk.dim('\n  Goodbye!\n'));
        break;
    }
  }
}

function runDirect(cmd) {
  switch (cmd) {
    case 'start':      return doStart(false);
    case 'start-ssl':  return doStart(true);
    case 'stop':       return doStop();
    case 'restart':    return doRestart();
    case 'status':     return doStatus();
    case 'update':     doUpdate(); break;
    case 'help':
      console.log(chalk.dim('  Usage: dds [command]'));
      console.log(chalk.dim('  Commands:'));
      console.log(chalk.dim('    start       Start DDS (HTTP :8080)'));
      console.log(chalk.dim('    start-ssl   Start DDS with SSL (:8443)'));
      console.log(chalk.dim('    stop        Stop all services'));
      console.log(chalk.dim('    restart     Restart DDS'));
      console.log(chalk.dim('    status      Show service status'));
      console.log(chalk.dim('    update      Pull latest version'));
      console.log(chalk.dim('    uninstall   Remove DDS completely\n'));
      break;
    default:
      console.log(chalk.red(`  Unknown command: ${cmd}`));
      console.log(chalk.dim('  Usage: dds [start|stop|restart|status|update|uninstall]\n'));
  }
}

main().catch(err => {
  console.error(chalk.red('\n  ERROR:'), err.message);
  process.exit(1);
});
