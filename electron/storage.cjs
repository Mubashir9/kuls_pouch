const fs = require('fs').promises;
const path = require('path');
const { app } = require('electron');

// Get the user's AppData directory
// On Windows: C:\Users\[User]\AppData\Roaming\BudgetTracker
// On macOS: ~/Library/Application Support/BudgetTracker
const DATA_DIR = path.join(app.getPath('userData'), 'data');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');

// Default Data Structures
const DEFAULTS = {
    transactions: { transactions: [] },
    categories: {
        categories: [
            { id: '1', name: 'Food', color: '#F59E0B', icon: 'utensils', type: 'expense', isDefault: true },
            { id: '2', name: 'Transport', color: '#3B82F6', icon: 'bus', type: 'expense', isDefault: true },
            { id: '3', name: 'Housing', color: '#6B7280', icon: 'home', type: 'expense', isDefault: true },
            { id: '4', name: 'Income', color: '#10B981', icon: 'wallet', type: 'income', isDefault: true },
        ]
    },
    settings: {
        theme: 'system',
        currency: 'USD',
        dateFormat: 'MM/dd/yyyy'
    }
};

class StorageService {
    constructor() {
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        try {
            await fs.mkdir(DATA_DIR, { recursive: true });
            await fs.mkdir(BACKUP_DIR, { recursive: true });

            // Initialize files if they don't exist
            await this.initFile('transactions.json', DEFAULTS.transactions);
            await this.initFile('categories.json', DEFAULTS.categories);
            await this.initFile('settings.json', DEFAULTS.settings);

            this.initialized = true;
            console.log('Storage initialized at:', DATA_DIR);
        } catch (error) {
            console.error('Failed to initialize storage:', error);
            throw error;
        }
    }

    async initFile(filename, defaultValue) {
        const filePath = path.join(DATA_DIR, filename);
        try {
            await fs.access(filePath);
        } catch {
            await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2));
        }
    }

    async read(filename) {
        if (!this.initialized) await this.initialize();

        try {
            const data = await fs.readFile(path.join(DATA_DIR, filename), 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error reading ${filename}:`, error);
            // Fallback to defaults if read fails
            const key = filename.replace('.json', '');
            return DEFAULTS[key] || {};
        }
    }

    async write(filename, data) {
        if (!this.initialized) await this.initialize();

        try {
            // Create backup before writing
            await this.createBackup(filename);

            await fs.writeFile(
                path.join(DATA_DIR, filename),
                JSON.stringify(data, null, 2)
            );
            return true;
        } catch (error) {
            console.error(`Error writing ${filename}:`, error);
            throw error;
        }
    }

    async createBackup(filename) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupName = `${path.basename(filename, '.json')}_${timestamp}.json`;

            try {
                await fs.copyFile(
                    path.join(DATA_DIR, filename),
                    path.join(BACKUP_DIR, backupName)
                );

                // Cleanup old backups (keep last 5)
                // This is a simple implementation, ideally specific per file
                // For MVP we might skip complex cleanup logic or implement basic one
            } catch (err) {
                // Ignore copy error if source file doesn't exist yet
                if (err.code !== 'ENOENT') throw err;
            }
        } catch (error) {
            console.error('Backup failed:', error);
        }
    }

    getDataPath() {
        return DATA_DIR;
    }
}

module.exports = new StorageService();
