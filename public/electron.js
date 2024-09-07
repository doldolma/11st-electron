// public/electron.js
const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require("path");

const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

// 무제한 저장소 플래그 설정
app.commandLine.appendSwitch('unlimited-storage');

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 680,
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

app.on("ready", createWindow);

app.on("activate", () => {
    if (mainWindow === null) createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
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