import { writeFileSync, existsSync, readFileSync } from 'fs';
import { getHosts } from './hosts.js';

const PREFIX = '/data/data/com.termux/files/usr';
const VHOST_FILE = PREFIX + '/etc/apache2/conf.d/dds-vhosts.conf';

function existingPorts() {
  const confs = [
    PREFIX + '/etc/apache2/httpd.conf',
    PREFIX + '/etc/apache2/extra/httpd-ssl.conf',
  ];
  const ports = new Set();
  for (const f of confs) {
    if (!existsSync(f)) continue;
    const content = readFileSync(f, 'utf8');
    for (const line of content.split('\n')) {
      const m = line.match(/^\s*Listen\s+(\d+)/i);
      if (m) ports.add(parseInt(m[1]));
    }
  }
  return ports;
}

export function generateVhostConfig() {
  const hosts = getHosts();
  const existing = existingPorts();
  const blocks = [];

  blocks.push('# DDS Virtual Hosts -- auto-generated, do not edit manually');
  blocks.push('# Created by dds-ui at ' + new Date().toISOString());
  blocks.push('');

  const CERT = PREFIX + '/etc/apache2/server.crt';
  const KEY = PREFIX + '/etc/apache2/server.key';

  for (const host of hosts) {
    if (!existing.has(host.port)) {
      existing.add(host.port);
      blocks.push('Listen ' + host.port);
    }
  }

  blocks.push('');

  for (const host of hosts) {
    const port = host.port;
    const serverName = host.name === 'default' ? 'localhost' : host.name + '.localhost';
    const root = host.root;

    blocks.push('<VirtualHost *:' + port + '>');
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

  if (existsSync(CERT) && existsSync(KEY)) {
    let sslPort = 8443;
    for (const host of hosts) {
      if (host.name === 'default') continue;
      sslPort++;
      while (existing.has(sslPort)) sslPort++;
      existing.add(sslPort);

      blocks.push('Listen ' + sslPort);
      blocks.push('');
      blocks.push('<VirtualHost *:' + sslPort + '>');
      blocks.push('    DocumentRoot "' + host.root + '"');
      blocks.push('    ServerName ' + (host.name === 'default' ? 'localhost' : host.name + '.localhost'));
      blocks.push('');
      blocks.push('    SSLEngine on');
      blocks.push('    SSLCertificateFile "' + CERT + '"');
      blocks.push('    SSLCertificateKeyFile "' + KEY + '"');
      blocks.push('');
      blocks.push('    <Directory "' + host.root + '">');
      blocks.push('        Options Indexes FollowSymLinks');
      blocks.push('        AllowOverride All');
      blocks.push('        Require all granted');
      blocks.push('    </Directory>');
      blocks.push('');
      blocks.push('    ErrorLog "var/log/apache2/' + host.name + '-ssl-error_log"');
      blocks.push('    CustomLog "var/log/apache2/' + host.name + '-ssl-access_log" common');
      blocks.push('</VirtualHost>');
      blocks.push('');
    }
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
