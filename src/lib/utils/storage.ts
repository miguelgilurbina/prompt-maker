// lib/utils/storage.ts
import { StorageSystem, StorageData, BackupData, StorageResult } from '../types/storage';

export class LocalStorageSystem implements StorageSystem {
  private readonly VERSION = '1.0.0';

  async save<T extends keyof StorageData>(
    key: T, 
    data: StorageData[T]
  ): Promise<void> {
    try {
      localStorage.setItem(
        `promptmaker:${key}`, 
        JSON.stringify(data)
      );
    } catch (error:unknown) {
     // Manera correcta de manejar el error unknown
     const errorMessage = error instanceof Error 
     ? error.message 
     : 'Unknown error occurred';
   
   throw new Error(`Failed to save ${key}: ${errorMessage}`);
 }
}
  

  async load<T extends keyof StorageData>(
    key: T
  ): Promise<StorageData[T]> {
    try {
      const data = localStorage.getItem(`promptmaker:${key}`);
      if (!data) {
        throw new Error(`No data found for ${key}`);
      }
      return JSON.parse(data) as StorageData[T];
    } catch (error:unknown) {
        const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
      
      throw new Error(`Failed to load ${key}: ${errorMessage}`);
    }
  }

  async remove(key: keyof StorageData): Promise<void> {
    try {
      localStorage.removeItem(`promptmaker:${key}`);
    } catch (error:unknown) {
        const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
      
      throw new Error(`Failed to remove ${key}: ${errorMessage}`);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = Object.keys(localStorage);
      keys
        .filter(key => key.startsWith('promptmaker:'))
        .forEach(key => localStorage.removeItem(key));
    } catch (error:unknown) {
        const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
      
      throw new Error(`Failed to clear storage: ${errorMessage}`);
    }
  }

  async backup(): Promise<BackupData> {
    try {
      const data: StorageData = {
        prompts: await this.load('prompts'),
        settings: await this.load('settings'),
        backups: await this.load('backups'),
      };

      const backup: BackupData = {
        version: this.VERSION,
        timestamp: new Date().toISOString(),
        data,
      };

      return backup;
    } catch (error:unknown) {
        const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
      
      throw new Error(`Failed to create backup: ${errorMessage}`);
    }
  }

  async restore(backup: BackupData): Promise<void> {
    try {
      if (backup.version !== this.VERSION) {
        throw new Error('Incompatible backup version');
      }

      await this.save('prompts', backup.data.prompts);
      await this.save('settings', backup.data.settings);
      await this.save('backups', backup.data.backups);
    } catch (error:unknown) {
        const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
      
      throw new Error(`Failed to restore backup: ${errorMessage}`);
    }
  }
}

// Helper functions
export const createStorageResult = <T>(
    data?: T,
    error?: Error
  ): StorageResult<T> => ({
    success: !error,
    data,
    error,
    timestamp: new Date(),
  });