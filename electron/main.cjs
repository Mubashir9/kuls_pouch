const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const storage = require('./storage.cjs');
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1000,
        minHeight: 600,
        titleBarStyle: 'hiddenInset',
        backgroundColor: '#FAFAFA',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs'),
        },
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(async () => {
    await storage.initialize(); // Ensure storage is ready
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    // --- IPC Handlers ---

    // Transactions
    ipcMain.handle('get-transactions', async () => {
        return await storage.read('transactions.json');
    });

    ipcMain.handle('save-transactions', async (event, data) => {
        return await storage.write('transactions.json', data);
    });

    // Categories
    ipcMain.handle('get-categories', async () => {
        return await storage.read('categories.json');
    });

    ipcMain.handle('save-categories', async (event, data) => {
        return await storage.write('categories.json', data);
    });

    // Settings
    ipcMain.handle('get-settings', async () => {
        return await storage.read('settings.json');
    });

    ipcMain.handle('save-settings', async (event, data) => {
        return await storage.write('settings.json', data);
    });

    // Utility
    ipcMain.handle('get-data-path', () => storage.getDataPath());
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
