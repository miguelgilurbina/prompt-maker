import { Prompt } from "@prisma/client";

// lib/types/storage.ts


// Reexportamos StorageConfig si está en otro archivo
export interface StorageConfig {
    autoSave: boolean;
    backupFrequency: number;
    maxHistorySize: number;
    storageKey: string;
  }

export type StorageData = {
    prompts: Prompt[];
    settings: StorageConfig;
    backups: {
      date: string;
      data: Prompt[];
    }[];
  };


  // Tipo para los datos de backup
export type BackupData = {
    version: string;
    timestamp: string;
    data: StorageData;
  };

// Interfaz para el sistema de almacenamiento
export interface StorageSystem {
    save<T extends keyof StorageData>(key: T, data: StorageData[T]): Promise<void>;
    load<T extends keyof StorageData>(key: T): Promise<StorageData[T]>;
    remove(key: keyof StorageData): Promise<void>;
    clear(): Promise<void>;
    backup(): Promise<BackupData>;
    restore(backup: BackupData): Promise<void>;
  }
  
  
// Eventos del sistema de almacenamiento con tipos específicos
export type StorageEvent = 
  | { type: 'SAVE_SUCCESS'; key: keyof StorageData }
  | { type: 'SAVE_ERROR'; error: Error; key: keyof StorageData }
  | { type: 'LOAD_SUCCESS'; key: keyof StorageData }
  | { type: 'LOAD_ERROR'; error: Error; key: keyof StorageData }
  | { type: 'BACKUP_CREATED'; backup: BackupData }
  | { type: 'STORAGE_CLEARED' };


  // Resultado de operaciones de almacenamiento
export type StorageResult<T> = {
    success: boolean;
    data?: T;
    error?: Error;
    timestamp: Date;
  };