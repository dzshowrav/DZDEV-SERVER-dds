import { writeFileSync, existsSync, readFileSync } from 'fs';
import { getHosts } from './hosts.js';

const PREFIX = '/data/data/com.termux/files/usr';
const VHOST_FILE = PREFIX + '/etc/apache2/conf.d/dds-vhosts.conf';

export function generateVhostConfig() {
  const hosts = getHosts();
  const listens = new Set();
  const blocks = [];

  blocks.push('# DDS Virtual Hosts -- auto-generated, do not edit manually');
  blocks.push('# Created by dds-ui at ' + new Date().toISOString());
  blocks.push('');

  for (const host of hosts) {
    const port = host.port;
    if (!listens.has(port)) {
      listens.add(port);
      blocks.push('Listen ' + port);
    }
  }

  blocks.push('');

  for (const host of hosts) {
    const port = host.port;
    const serverName = host.name === 'default' ? 'localhost' : host.name + '.localhost';
    const root = host.root;

    blocks.push('<VirtualHost _default_:' + port + '>');
    blocks.push('    DocumentRoot "' + root + '"');
    blocks.push('    ServerName ' + serverName);
    blocks.push('');
    blocks.push('    <Directory "' + root + '">');
    blocks.push('        Options Indexes FollowSymLinks');
    blocks.push('        AllowOverride All');
    blocks.push('        Require all granted');
    blocks.push('    </Directory>');
    blocks.push('');
    blocks.push('    ErrorLog "var/log/apache2/' + host.name + '-error_log"');
    blocks.push('    CustomLog "var/log/apache2/' + host.name + '-access_log" common');
    blocks.push('</VirtualHost>');
    blocks.push('');
  }

  const content = blocks.join('\n');
  writeFileSync(VHOST_FILE, content, 'utf8');
  return content;
}

export function hasVhostInclude() {
  const httpdConf = PREFIX + '/etc/apache2/httpd.conf';
  if (!existsSync(httpdConf)) return false;
  const content = readFileSync(httpdConf, 'utf8');
  return content.includes('dds-vhosts.conf');
}

export function getDefaultPort() {
  const hosts = getHosts();
  const def = hosts.find(h => h.name === 'default');
  return def ? def.port : 8080;
}
