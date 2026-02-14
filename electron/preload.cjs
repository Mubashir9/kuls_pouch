const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Transactions
    getTransactions: () => ipcRenderer.invoke('get-transactions'),
    saveTransactions: (data) => ipcRenderer.invoke('save-transactions', data),

    // Categories
    getCategories: () => ipcRenderer.invoke('get-categories'),
    saveCategories: (data) => ipcRenderer.invoke('save-categories', data),

    // Settings
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (data) => ipcRenderer.invoke('save-settings', data),

    // Utils
    getDataPath: () => ipcRenderer.invoke('get-data-path'),
});
