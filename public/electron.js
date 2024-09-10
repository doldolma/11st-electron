// public/electron.js
const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require("path");
const { autoUpdater } = require('electron-updater');

const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

// 무제한 저장소 플래그 설정
app.commandLine.appendSwitch('unlimited-storage');

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
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

autoUpdater.on('checking-for-update', () => {
    mainWindow.webContents.send('업데이트가 있는지 확인 중 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ');
});

autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('새로운 버전이 릴리즈 되었습니다. 얼른 업데이트를 진행하십시오~!!!!!!!!!! 응 싫다해도 업데이트 할거야. 업데이트는 새로운 버그를 체집할 수 있는 좋은 기회죠');
});

autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('업데이트 파일 다운로드가 완료됐음~~~~~!!!!... 네트워크 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠 냠냠 냠 냠 냠냠  앙 맛있쪙');
});




function createAboutWindow() {
    dialog.showMessageBox(mainWindow, {
        title: '11번가 상품 조회',
        message: '11번가 슈팅배송 상품 조회',
        // detail: `Version: ${app.getVersion()}\nElectron: ${process.versions.electron}\nChrome: ${process.versions.chrome}\nNode.js: ${process.versions.node}\nV8: ${process.versions.v8}`,
        detail: `Version: ${app.getVersion()}\n문의는 정고에게`,
        buttons: ['OK'],
        icon: path.join(__dirname, 'public/logo192.png') // 앱 아이콘 경로
    });
}