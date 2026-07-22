import { readFileSync, writeFileSync, existsSync } from 'fs';

const DDS_DIR = process.env.HOME + '/dds';
const HOSTS_FILE = DDS_DIR + '/hosts.json';

function getDefaultHosts() {
  return {
    defaultRoot: '/sdcard/htdocs',
    hosts: [
      { name: 'default', port: 8080, root: '/sdcard/htdocs', ssl: false },
    ],
  };
}

export function loadHosts() {
  if (!existsSync(HOSTS_FILE)) {
    const data = getDefaultHosts();
    saveHosts(data);
    return data;
  }
  return JSON.parse(readFileSync(HOSTS_FILE, 'utf8'));
}

export function saveHosts(data) {
  writeFileSync(HOSTS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export function getHosts() {
  return loadHosts().hosts;
}

export function addHost(name, port, root) {
  const data = loadHosts();
  if (data.hosts.find(h => h.name === name)) {
    throw new Error('Host "' + name + '" already exists');
  }
  if (data.hosts.find(h => h.port === port)) {
    throw new Error('Port ' + port + ' is already in use by host "' + data.hosts.find(h => h.port === port).name + '"');
  }
  data.hosts.push({ name, port, root, ssl: false });
  saveHosts(data);
  return data.hosts;
}

export function removeHost(name) {
  const data = loadHosts();
  if (name === 'default') {
    throw new Error('Cannot delete the default host');
  }
  const idx = data.hosts.findIndex(h => h.name === name);
  if (idx === -1) throw new Error('Host "' + name + '" not found');
  data.hosts.splice(idx, 1);
  saveHosts(data);
  return data.hosts;
}

export function editHost(name, updates) {
  const data = loadHosts();
  const host = data.hosts.find(h => h.name === name);
  if (!host) throw new Error('Host "' + name + '" not found');
  if (updates.port && updates.port !== host.port) {
    const existing = data.hosts.find(h => h.port === updates.port);
    if (existing) throw new Error('Port ' + updates.port + ' is already in use by host "' + existing.name + '"');
  }
  Object.assign(host, updates);
  saveHosts(data);
  return data.hosts;
}

export function setDefaultRoot(path) {
  const data = loadHosts();
  data.defaultRoot = path;
  const def = data.hosts.find(h => h.name === 'default');
  if (def) def.root = path;
  saveHosts(data);
  return data;
}
