// public/electron.js
const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require("path");
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

// 무제한 저장소 플래그 설정
app.commandLine.appendSwitch('unlimited-storage');

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            devTools: isDev,
            webSecurity: false,
        },
    });

    mainWindow.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "../build/index.html")}`
    );

    if (isDev) {
        mainWindow.webContents.openDevTools();
        // 개발자 도구 단축키 등록
        mainWindow.webContents.on('before-input-event', (event, input) => {
            if (input.meta && input.alt && input.key.toLowerCase() === 'i') {  // macOS
                mainWindow.webContents.toggleDevTools();
                event.preventDefault();
            }
        });

    }

    mainWindow.setResizable(true);
    mainWindow.on("closed", () => {
        mainWindow = null;
        app.quit();
    });
    mainWindow.focus();

    // 메뉴 생성 및 설정
    const template = [
        {
            label: 'File',
            submenu: [
                { role: 'quit' }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: () => createAboutWindow()
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

app.on("ready", () => {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify();
});

app.on("activate", () => {
    if (mainWindow === null) createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

// 자동 업데이트 이벤트 핸들러
autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});

// React 컴포넌트에서 업데이트 확인 요청을 처리
ipcMain.on('check_for_update', () => {
    autoUpdater.checkForUpdatesAndNotify();
});

// 버전 조회
ipcMain.handle('get-app-version', () => {
    return app.getVersion();
});

// 업데이트 이벤트 처리
autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.send('update_available', info);
});

autoUpdater.on('update-not-available', (info) => {
    mainWindow.webContents.send('update_not_available', info);
});

autoUpdater.on('error', (err) => {
    mainWindow.webContents.send('update_error', err);
});

autoUpdater.on('update-downloaded', (info) => {
    mainWindow.webContents.send('update_downloaded', info);
});

function createAboutWindow() {
    dialog.showMessageBox(mainWindow, {
        title: '상품 조회',
        message: '상품 조회 앱',
        // detail: `Version: ${app.getVersion()}\nElectron: ${process.versions.electron}\nChrome: ${process.versions.chrome}\nNode.js: ${process.versions.node}\nV8: ${process.versions.v8}`,
        detail: `Version: ${app.getVersion()}\n문의는 정고에게`,
        buttons: ['OK'],
        icon: path.join(__dirname, 'public/logo192.png') // 앱 아이콘 경로
    });
}