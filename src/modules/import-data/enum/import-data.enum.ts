export enum DataFile_Status {
  New = 'new',
  Read = 'read',
  Queued = 'queued',
  Processing = 'proccessing',
  Failed = 'failed',
  Cancelled = 'cancelled',
  Done = 'done',
}

export enum DataFile_ImportRule {
  CloseAll = 'close-all',
  ReplaceAll = 'replace-all',
  DeleteAll = 'delete-all',
}

export enum DataFile_ToTable {
  Customer = 'customer',
  Contract = 'contract',
  Investigation = 'investigation',
  Activity = 'activity',
  Reference = 'reference',
  Transaction = 'transaction',
}
