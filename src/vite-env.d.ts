/// <reference types="vite/client" />

interface Window {
    api: {
        getTransactions: () => Promise<any>;
        saveTransactions: (data: any) => Promise<any>;
        getCategories: () => Promise<any>;
        saveCategories: (data: any) => Promise<any>;
        getSettings: () => Promise<any>;
        saveSettings: (data: any) => Promise<any>;
        getDataPath: () => Promise<string>;
    };
}
