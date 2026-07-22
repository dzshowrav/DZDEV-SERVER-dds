# DDS

[![GitHub repo size](https://img.shields.io/github/repo-size/dzshowrav/DZDEV-SERVER-dds?label=Size)](https://github.com/dzshowrav/DZDEV-SERVER-dds) [![GitHub License](https://img.shields.io/github/license/dzshowrav/DZDEV-SERVER-dds?label=License)](https://github.com/dzshowrav/DZDEV-SERVER-dds/blob/main/LICENSE)

DDS (Termux, Apache, MariaDB, PHP)

DDS is a local http web server for Android using Termux, with installation packages: Apache, MySQL/MariaDB, PHP, phpMyAdmin, & Composer.

ㅤ
## Requirements

- [Termux](https://github.com/termux/termux-app/releases/latest) **v0.118.0** or higher
- Stable and fast internet connection

ㅤ
## Installation

1. Install & open Termux
2. Update & upgrade packages: 
```bash
pkg update && pkg upgrade
```
3. Grant Termux storage permission: 
```bash
termux-setup-storage
```
4. Install `git` & clone this repo: 
```bash
pkg install git -y && cd ~/ && git clone https://github.com/dzshowrav/DZDEV-SERVER-dds.git dds
```
5. Install DDS: 
```bash
cd ~/dds && bash setup && cd ~/
```
6. Wait until installation is complete.
7. Enjoy!

ㅤ
## Usage

- Run `dds start` to open url in browser.
- Local web server with SSL:
  * run: `dds start-ssl`
  * port: `8443`
  * url: `https://localhost:8443`
- Login phpMyAdmin:
  * url: `http://localhost:8080/phpmyadmin`
  * username: `root`
  * password: {leave_it_blank}
- **htdocs** folder can be found in:
  * `/sdcard/htdocs`
  * or `/storage/emulated/0/htdocs`

ㅤ
## Commands

- dds start
- dds start-ssl
- dds stop
- dds update
- dds uninstall

ㅤ
## Credits

- [Termux](https://github.com/termux/termux-app)
- [parzibyte.me](https://parzibyte.me/blog/en/2019/04/28/install-apache-php-7-android-termux/)
- [termux-php-apache2-setup](https://github.com/gungunpriatna/termux-php-apache2-setup)
- [termux-webserver](https://github.com/HadiKhoirudin/termux-webserver)

ㅤ
## License

DDS is licensed under the GNU General Public License v3.0. See the [LICENSE](https://github.com/dzshowrav/DZDEV-SERVER-dds/blob/main/LICENSE) file for more details.
