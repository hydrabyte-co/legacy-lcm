export enum MessagePattern {
  DataMigration = 'data-migration',
  MSSQLTableImport = 'mssql-table-import',
}

export enum EventType {
  System = 'system',
  User = 'user',
  Api = 'api'
}

export enum EventPriority {
  Low = 'low',
  Medium = 'medium', 
  High = 'high'
}

export enum EventStatus {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed'
}