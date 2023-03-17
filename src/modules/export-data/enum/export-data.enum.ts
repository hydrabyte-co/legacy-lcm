export enum ExportData_Status {
  New = 'new',
  Read = 'read',
  Queued = 'queued',
  Processing = 'proccessing',
  Failed = 'failed',
  Cancelled = 'cancelled',
  Done = 'done',
}

export enum ExportData_ExportRule {
  CloseAll = 'close-all',
  ReplaceAll = 'replace-all',
  DeleteAll = 'delete-all',
}

export enum ExportData_ToTable {
  Customer = 'customer',
  Contract = 'contract',
  Investigation = 'investigation',
  Activity = 'activity',
  Reference = 'reference',
  Transaction = 'transaction',
}
