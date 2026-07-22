# DDS

[![GitHub repo size](https://img.shields.io/github/repo-size/dzshowrav/DZDEV-SERVER-dds?label=Size)](https://github.com/dzshowrav/DZDEV-SERVER-dds) [![GitHub License](https://img.shields.io/github/license/dzshowrav/DZDEV-SERVER-dds?label=License)](https://github.com/dzshowrav/DZDEV-SERVER-dds/blob/main/LICENSE)

DDS (Termux, Apache, MariaDB, PHP) — a full LAMP-like local web server for Android, powered by Termux.

Includes Apache httpd, MariaDB, PHP, phpMyAdmin, Composer, and a visual CLI interface for managing everything.

## Requirements

- [Termux](https://github.com/termux/termux-app/releases/latest) **v0.118.0** or higher
- Node.js (installed automatically if missing)
- Stable internet connection

## Installation

1. Install & open Termux
2. Update & upgrade packages:
```bash
pkg update && pkg upgrade
```
3. Grant storage permission:
```bash
termux-setup-storage
```
4. Install git & clone:
```bash
pkg install git -y && cd ~/ && git clone https://github.com/dzshowrav/DZDEV-SERVER-dds.git dds
```
5. Install DDS:
```bash
cd ~/dds && bash setup && cd ~/
```
6. Wait for installation to complete.
7. Run `dds` to launch the visual interface.

## Visual CLI Interface

Running `dds` without arguments opens the interactive menu:

```
██████╗ ██████╗ ███████╗
██╔══██╗██╔══██╗██╔════╝
██║  ██║██║  ██║███████╗
██║  ██║██║  ██║╚════██║
██████╔╝██████╔╝███████║
╚═════╝ ╚═════╝ ╚══════╝
     Termux · Apache · MariaDB · PHP
            ●  ACTIVE · Apache + MariaDB

  Start DDS
  Stop DDS
  Restart DDS
  Status
  Manage Hosts
  Change Root
  Update DDS
  Uninstall
  Exit
```

The badge animates live — shows service status (green dot + spinner when running, red when stopped, orange when degraded).

## Commands

| Command | Description |
|---|---|
| `dds` | Launch interactive visual menu |
| `dds start` | Start Apache + MariaDB |
| `dds start-ssl` | Start with HTTPS (port 8443) |
| `dds stop` | Stop all services |
| `dds restart` | Restart all services |
| `dds status` | Show service status with host list |
| `dds hosts` | Manage virtual hosts |
| `dds root <path>` | Change default document root |
| `dds update` | Pull latest version |
| `dds uninstall` | Remove DDS completely |

## Status Page

The interactive status page shows:

- Apache status (process count + port)
- MariaDB status (PID)
- phpMyAdmin installation status
- All virtual hosts (name, port, document root)
- Quick action links (Open HTTP/HTTPS/phpMyAdmin per host)

## Virtual Hosts

Manage multiple sites from the **Manage Hosts** menu or `dds hosts`:

- **Create Host** — add a host with name, port, document root
- **Edit Host** — change port or root of an existing host
- **Delete Host** — remove a host (default host is protected)

Hosts are stored in `~/dds/hosts.json`. Apache config auto-generates to `$PREFIX/etc/apache2/conf.d/dds-vhosts.conf`.

Example — create `test1` on port 8082:

```
dds hosts → Create Host
  Name: test1
  Port: 8082
  Root: /sdcard/htdocs/test1
```

Then access `http://localhost:8082/`.

## Usage

- **phpMyAdmin**: `http://localhost:8080/phpmyadmin` (user: `root`, password: blank)
- **HTTPS**: `https://localhost:8443/`
- **Document root**: `/sdcard/htdocs/`

## Credits

- [Termux](https://github.com/termux/termux-app)
- [parzibyte.me](https://parzibyte.me/blog/en/2019/04/28/install-apache-php-7-android-termux/)
- [termux-php-apache2-setup](https://github.com/gungunpriatna/termux-php-apache2-setup)
- [termux-webserver](https://github.com/HadiKhoirudin/termux-webserver)

## License

DDS is licensed under the GNU General Public License v3.0. See the [LICENSE](https://github.com/dzshowrav/DZDEV-SERVER-dds/blob/main/LICENSE) file for more details.
