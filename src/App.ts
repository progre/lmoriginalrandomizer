// tslint:disable-next-line:no-implicit-dependencies
import electron from 'electron';
const { app, BrowserWindow, ipcMain } = electron;
import fs from 'fs';
import util from 'util';
import { initMacMenu } from './macmenu';
import SettingsRepo from './repo/SettingsRepo';
import { InitialParameters, Settings } from './types';

const readFile = util.promisify(fs.readFile);

export default class App {
  static async create() {
    await new Promise((resolve, reject) => app.once('ready', resolve));
    initMacMenu();
    const settingsFilePath = `${app.getPath('userData')}/settings.json`;
    const settingsRepo = new SettingsRepo(settingsFilePath);
    const settings = await settingsRepo.get();
    const version = JSON.parse(
      await readFile(`${__dirname}/../package.json`, { encoding: 'utf8' }),
    ).version;
    return new this(version, settingsRepo, settings);
  }

  private win: electron.BrowserWindow;

  constructor(
    version: string,
    private settingsRepo: SettingsRepo,
    private settings: Settings,
  ) {
    app.on('window-all-closed', app.quit.bind(app));
    this.win = new BrowserWindow({
      title: `La-Mulana Original Randomizer v${version}`,
      width: 800,
      height: 331,
      resizable: true,
      show: false,
    });
    this.win.on('ready-to-show', () => {
      this.win.show();
    });
    ipcMain.on('setSeed', async (ev: any, seed: string) => {
      try {
        this.settings.seed = seed;
        await this.settingsRepo.set(this.settings);
      } catch (err) {
        console.error(err);
      }
    });
    ipcMain.on('setInstallDirectory', async (ev: any, path: string) => {
      try {
        this.settings.installDirectory = path;
        await this.settingsRepo.set(this.settings);
      } catch (err) {
        console.error(err);
      }
    });
    ipcMain.on('setEasyMode', async (ev: any, easyMode: boolean) => {
      try {
        this.settings.easyMode = easyMode;
        await this.settingsRepo.set(this.settings);
      } catch (err) {
        console.error(err);
      }
    });
    const initialParams: InitialParameters = {
      seed: this.settings.seed || '',
      installDirectory: this.settings.installDirectory || '',
      easyMode: this.settings.easyMode || false,
    };
    const search = encodeURIComponent(JSON.stringify(initialParams));
    this.win.loadURL(
      `file://${__dirname}/public/index.html?${search}`,
    );
  }
}
