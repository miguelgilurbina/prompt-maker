// Configuración de almacenamiento
export interface StorageConfig {
  autoSave: boolean;
  backupFrequency: number;
  maxHistorySize: number;
  storageKey: string;
}