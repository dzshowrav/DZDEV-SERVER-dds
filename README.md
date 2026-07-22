# DDS

[![GitHub repo size](https://img.shields.io/github/repo-size/dzshowrav/DZDEV-SERVER-dds?label=Size)](https://github.com/dzshowrav/DZDEV-SERVER-dds) [![GitHub License](https://img.shields.io/github/license/dzshowrav/DZDEV-SERVER-dds?label=License)](https://github.com/dzshowrav/DZDEV-SERVER-dds/blob/main/LICENSE)

<p align="center">
  <img src="https://raw.githubusercontent.com/dzshowrav/DZDEV-SERVER-dds/main/assets/screenshot.jpg" alt="DDS Screenshot" width="600">
</p>

**DDS** (Termux, Apache, MariaDB, PHP) is a full LAMP-like local web server for Android, running entirely inside Termux. It includes Apache httpd, MariaDB, PHP 8, phpMyAdmin, Composer, and a visual CLI interface for managing everything.

<p align="center">
  <img src="https://raw.githubusercontent.com/dzshowrav/DZDEV-SERVER-dds/main/assets/Screenshot_20260722-184210.jpg" width="180" alt="Screenshot">
  <img src="https://raw.githubusercontent.com/dzshowrav/DZDEV-SERVER-dds/main/assets/Screenshot_20260722-185815.jpg" width="180" alt="Screenshot">
  <img src="https://raw.githubusercontent.com/dzshowrav/DZDEV-SERVER-dds/main/assets/Screenshot_20260722-185836.jpg" width="180" alt="Screenshot">
  <img src="https://raw.githubusercontent.com/dzshowrav/DZDEV-SERVER-dds/main/assets/Screenshot_20260722-185849.jpg" width="180" alt="Screenshot">
  <img src="https://raw.githubusercontent.com/dzshowrav/DZDEV-SERVER-dds/main/assets/Screenshot_20260722-185906.jpg" width="180" alt="Screenshot">
</p>

## Features

- **Visual CLI** — interactive menu with animated status badge, no need to remember commands
- **Apache httpd** — port 8080 (HTTP) and 8443 (HTTPS with SSL)
- **MariaDB** — MySQL-compatible database server
- **PHP 8** — mod_php, runs inside Apache
- **phpMyAdmin** — database management via browser
- **Virtual Hosts** — host multiple sites on custom ports
- **Live Status** — real-time service status with host listing
- **SSL support** — auto-generated self-signed certificate
- **Composer** — PHP dependency manager included
- **Persistent config** — survives Termux sessions via hosts.json

## Requirements

- [Termux](https://github.com/termux/termux-app/releases/latest) **v0.118.0** or higher (install from [F-Droid](https://f-droid.org/packages/com.termux/) for best compatibility)
- Node.js (installed automatically if missing)
- Stable internet connection
- Storage permission (for /sdcard/htdocs)

## Installation

1. **Install & open Termux**

2. **Update packages:**
```bash
pkg update && pkg upgrade -y
```

3. **Grant storage permission:**
```bash
termux-setup-storage
```

4. **Install git and clone the repo:**
```bash
pkg install git -y && cd ~/ && git clone https://github.com/dzshowrav/DZDEV-SERVER-dds.git dds
```

5. **Run the installer:**
```bash
cd ~/dds && bash setup && cd ~/
```

6. **Wait** — installation takes a few minutes (downloads Apache, MariaDB, PHP, phpMyAdmin via Composer).

7. **Launch:**
```bash
dds
```

## Visual CLI Interface

Running `dds` without arguments opens an interactive full-screen menu:

```
██████╗ ██████╗ ███████╗
██╔══██╗██╔══██╗██╔════╝
██║  ██║██║  ██║███████╗
██║  ██║██║  ██║╚════██║
██████╔╝██████╔╝███████║
╚═════╝ ╚═════╝ ╚══════╝
     Termux · Apache · MariaDB · PHP
            ●  ACTIVE · Apache + MariaDB

  ❯ Start DDS
    Stop DDS
    Restart DDS
    Status
    Manage Hosts
    Change Root
    Update DDS
    Uninstall
    Exit
```

The badge below the logo animates in real time — pulsing green dot + spinner when both services are up, yellow "DEGRADED" when only Apache is running, red "Server Offline" when both are down.

Navigate with arrow keys and press Enter to select.

## Commands Reference

| Command | Description |
|---|---|
| `dds` | Launch interactive visual menu |
| `dds start` | Start Apache (port 8080) + MariaDB |
| `dds start-ssl` | Start with HTTPS (port 8443) |
| `dds stop` | Stop all services gracefully |
| `dds restart` | Restart all services |
| `dds status` | Show service status with host list |
| `dds hosts` | Open virtual host manager |
| `dds root <path>` | Change default document root |
| `dds update` | Pull latest version from GitHub |
| `dds uninstall` | Remove DDS and all packages |

## Service Management

### Start

```bash
dds start
```

Starts both Apache httpd and MariaDB. Apache listens on port 8080. Spinners show progress, stale PID files are cleaned automatically.

### Stop

```bash
dds stop
```

Stops both services gracefully. Waits for processes to fully terminate before returning.

### Restart

```bash
dds restart
```

Stops all services, waits 1 second, then starts everything again.

## Status Page

```bash
dds status
```

Opens an interactive status page that refreshes each iteration:

```
██████╗ ██████╗ ███████╗
██╔══██╗██╔══██╗██╔════╝
██║  ██║██║  ██║███████╗
██║  ██║██║  ██║╚════██║
██████╔╝██████╔╝███████║
╚═════╝ ╚═════╝ ╚══════╝
     Termux · Apache · MariaDB · PHP
            ●  ACTIVE · Apache + MariaDB

          ── DDS Status ──

  ▸ Apache    ● RUNNING  (3 processes, port 8080)
  ▸ MariaDB   ● RUNNING  (PID 12345)
  ▸ phpMyAdmin ● INSTALLED  /phpmyadmin/

  ── Virtual Hosts ──
  ● default → :8080 [/sdcard/htdocs]
  ● test1 → :8082 [/sdcard/htdocs/test1]

  ? Quick actions:
    ○ Open phpMyAdmin http://localhost:8080/phpmyadmin/
    ○ Open HTTP      http://localhost:8080/
    ○ Open HTTPS     https://localhost:8443/
    ○ test1     http://localhost:8082/
    ──────────────
  ❯ ← Back to Home
```

Features:
- Live service status with process counts
- phpMyAdmin installation status
- All virtual hosts listed with name, port, and document root
- Quick action links to open each host in browser
- phpMyAdmin always pinned to the top

## Virtual Hosts

DDS supports hosting multiple websites on different ports. Manage them from the **Manage Hosts** menu or `dds hosts`.

### Menu

```
  ── Host Manager ──

  ❯ Create Host
    Edit Host
    Delete Host
    ← Back to Home
```

### Create a Host

```
  Enter host name: test1
  Enter port number: 8082
  Enter document root: /sdcard/htdocs/test1

  ✔ Host 'test1' created on port 8082
```

- The host is saved to `~/dds/hosts.json`
- Apache config is auto-generated to `$PREFIX/etc/apache2/conf.d/dds-vhosts.conf`
- Apache reloads automatically (graceful) — config takes effect immediately
- Default host (port 8080) cannot be deleted

### Edit a Host

```
  Select host: test1
  Enter new port (or leave blank): 9090
  Enter new root (or leave blank): /sdcard/htdocs/test1-v2

  ✔ Host 'test1' updated
```

### Delete a Host

```
  Select host: test1
  ? Are you sure? (y/N): y

  ✔ Host 'test1' deleted
```

### How It Works

- **hosts.json** (`~/dds/hosts.json`): Stores all host definitions in JSON format
- **dds-vhosts.conf** (auto-generated): Apache reads this file for VirtualHost and Listen directives
- On every start, `dds` regenerates the Apache config from the latest hosts.json
- Managed ports are automatically added as `Listen` directives (no duplicates)
- Apache graceful reload applies changes without dropping existing connections

### Example: Multi-site Setup

```
Hosts:
  default  → :8080  → /sdcard/htdocs
  blog     → :8082  → /sdcard/htdocs/blog
  api      → :8083  → /sdcard/htdocs/api
  admin    → :8084  → /sdcard/htdocs/admin
```

Access each at:
- `http://localhost:8080/`
- `http://localhost:8082/`
- `http://localhost:8083/`
- `http://localhost:8084/`

## Change Document Root

Change the default document root (port 8080) from the menu or command line:

```bash
dds root /sdcard/htdocs/myproject
```

or via the interactive menu:

```
  Enter new document root path: /sdcard/htdocs/myproject

  ✔ Default root changed to /sdcard/htdocs/myproject
  Apache reloaded
```

This updates both `defaultRoot` and the default host's root in `hosts.json` and reloads Apache.

## phpMyAdmin

phpMyAdmin is installed during `setup` via Composer. Access it at:

- **URL:** `http://localhost:8080/phpmyadmin`
- **Username:** `root`
- **Password:** *(leave blank)*

The config file is at `/sdcard/htdocs/phpmyadmin/config.inc.php` and uses a dynamically generated blowfish secret on each page load.

To reinstall (if missing):
```bash
cd /sdcard/htdocs && composer create-project phpmyadmin/phpmyadmin
```

## HTTPS / SSL

DDS generates a self-signed SSL certificate during installation. Start with HTTPS:

```bash
dds start-ssl
```

- **HTTP:** port 8080
- **HTTPS:** port 8443

If the certificate expires (checks automatically on start), a new one is generated.

## Document Root

All website files go in `/sdcard/htdocs/`. This is Android's shared storage — accessible from file managers and MTP:

```
/sdcard/htdocs/
├── index.php
├── phpinfo/
├── phpmyadmin/
└── .htaccess
```

A default `.htaccess` is copied during setup that prefers `index.php` over `index.html`.

## Update

```bash
dds update
```

or from the menu. This:

1. Stops all services
2. Copies fresh httpd.conf and httpd-ssl.conf
3. Replaces the `dds` binary in `$PREFIX/bin/`
4. Installs npm dependencies if missing
5. Regenerates vhost config
6. Restarts Apache and MariaDB

## Uninstall

```bash
dds uninstall
```

or from the menu. Removes Apache, MariaDB, PHP, phpMyAdmin, Composer, and all DDS files. Confirmation required.

## File Structure

```
~/dds/
├── dds                  # CLI entry point (bash, delegates to Node.js)
├── setup                # One-shot installer
├── update               # Config re-apply after git pull
├── httpd.conf           # Apache configuration (port 8080)
├── httpd-ssl.conf       # Apache SSL configuration (port 8443)
├── config.inc.php       # phpMyAdmin configuration template
├── .htaccess            # Directory index preference
├── hosts.json           # Virtual host definitions
├── assets/              # Screenshots and media
├── dds-ui/              # Visual CLI interface (Node.js)
│   ├── index.js         # Entry point, menu loop, direct commands
│   ├── menu.js          # Interactive menu definitions
│   ├── logo.js          # ASCII logo + animated status badge
│   ├── commands.js      # All command implementations
│   ├── hosts.js         # Host data layer (JSON CRUD)
│   ├── vhost.js         # Apache vhost config generator
│   ├── spinner.js       # Spinner utilities
│   └── package.json     # Dependencies (chalk, ora, inquirer)
└── LICENSE              # GPL v3
```

## Troubleshooting

| Problem | Solution |
|---|---|
| `dds` shows no menu | Run `pkg install nodejs -y` |
| Apache won't start | Check `$PREFIX/var/log/apache2/error_log` |
| MariaDB won't start | Remove `$PREFIX/var/run/mariadb.pid` and try again |
| New host port not responding | Run `dds start` (regenerates vhost config) |
| phpMyAdmin blank page | Run `composer update` in `/sdcard/htdocs/phpmyadmin` |
| SSL certificate expired | Run `dds start-ssl` (auto-renew if expired) |
| Port already in use | Use a different port for your host |
| Permission denied | Run `termux-setup-storage` once |

## Credits

- [Termux](https://github.com/termux/termux-app)
- [parzibyte.me](https://parzibyte.me/blog/en/2019/04/28/install-apache-php-7-android-termux/)
- [termux-php-apache2-setup](https://github.com/gungunpriatna/termux-php-apache2-setup)
- [termux-webserver](https://github.com/HadiKhoirudin/termux-webserver)

## License

DDS is licensed under the GNU General Public License v3.0. See the [LICENSE](https://github.com/dzshowrav/DZDEV-SERVER-dds/blob/main/LICENSE) file for more details.
