// tslint:disable:no-implicit-dependencies
try { require('source-map-support').install(); } catch (e) { /* NOP */ }
import electron from 'electron';
// tslint:enable:no-implicit-dependencies
import module from './module';

const { app, BrowserWindow } = electron;

async function main() {
  await new Promise((resolve, reject) => app.once('ready', resolve));
  app.on('window-all-closed', app.quit.bind(app));
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    show: true,
  });
  win.loadURL(`file://${__dirname}/public/index.html`);
  await module();
}

main().catch((e) => { console.error(e.stack || e); });
