import { app, Menu, Tray, BrowserWindow, ipcMain, globalShortcut } from 'electron';
var os = require('os');
var path = require('path');

// 运行平台
const osPlatform = os.platform()

let mainWindow: BrowserWindow = null;
// 创建托盘，全局变量，防止被垃圾回收
let tray = null;

let createWindow = function () {
	mainWindow = new BrowserWindow({
		width: 1024,
		height: 680,
		titleBarStyle: 'default',
		icon: path.resolve(__dirname, '..', 'public', 'weread.ico'),
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			webSecurity: false,
			webviewTag: true,
		},
		frame: false,
		// 初始化过程中先隐藏窗口
		show: false,
	})
	mainWindow.loadFile(path.resolve(__dirname, '..', 'public', 'index.html'))
	// 打开调试窗口
	// mainWindow.webContents.openDevTools();
	mainWindow.on('closed', function () {
		mainWindow = null
	});

	mainWindow.on('ready-to-show', function () {
		// 初始化后再显示
		mainWindow.show();
	})

	// 实现关闭窗口不销毁程序
	mainWindow.on('close', (event) => {
		if (osPlatform == "win32") {
			mainWindow.hide();
			event.preventDefault();
		}
	});

	//在主进程中监听窗口最大化、最小化事件  
	mainWindow.on('maximize', function () {
		mainWindow.webContents.send('main-window-max');
	});

	mainWindow.on('unmaximize', function () {
		mainWindow.webContents.send('main-window-unmax');
	});

	// 注册快捷键打开调试窗口
	globalShortcut.register('CommandOrControl+Shift+F12', function () {
		mainWindow.webContents.openDevTools()
	});

	console.log(osPlatform)
	if (osPlatform == "win32") {
		console.log(path.resolve(__dirname, '..', 'public', 'weread.png'))
		tray = new Tray(path.resolve(__dirname, '..', 'public', 'weread.png'));
		const contextMenu = Menu.buildFromTemplate([
			{
				label: '打开',
				click: () => {
					mainWindow.show();
				}
			},
			{
				label: '退出',
				click: function () {
					mainWindowCloseTearDown();
					app.exit();
				}
			}
		]);
		tray.setToolTip('微信阅读PC版');
		tray.setContextMenu(contextMenu);
		tray.on('double-click', () => {
			if (mainWindow) {
				mainWindow.restore();
				mainWindow.show();
			}
		})
	}

}
// 主进程
app.on('ready', appReadyTearDown);

app.on('window-all-closed', () => {
	// 所有窗口都关闭时的处理逻辑
	// if (osPlatform !== 'darwin') {
	// 	mainWindowCloseTearDown();
	// 	app.quit();
	// }
})

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	} else {
		mainWindow.show();
	}
})

ipcMain.handle('show-main-window', async (event) => {
	if (mainWindow === null) {
		createWindow()
	} else {
		mainWindow.show();
	}
});

//接收最小化命令
ipcMain.handle('window-min', function () {
	mainWindow.minimize();
})

//接收最大化命令
ipcMain.handle('window-max', function () {
	mainWindow.maximize();
})

//接收取消最大化命令
ipcMain.handle('window-unmax', function () {
	mainWindow.restore();
})

//接收关闭命令
ipcMain.handle('window-close', function () {
	// 点击关闭按钮时，退出应用
	// mainWindow.close();

	// 点击关闭按钮时，隐藏主窗口，不退出应用
	mainWindow.hide();
})

//接收关闭命令
ipcMain.handle('app-relaunch', function () {
	app.relaunch()
	app.exit(0)
})

// 限制只可以打开一个应用
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
	app.quit()
} else {
	app.on('second-instance', (event, commandLine, workingDirectory) => {
		// 当运行第二个实例时,将会聚焦到mainWindow这个窗口
		if (mainWindow) {
			if (mainWindow.isMinimized()) mainWindow.restore();
			mainWindow.focus();
			mainWindow.show();
		};
	})
}


function mainWindowCloseTearDown() {

}

function appReadyTearDown() {
	createWindow()
}

