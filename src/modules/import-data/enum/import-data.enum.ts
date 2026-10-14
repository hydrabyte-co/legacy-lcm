export enum ImportData_Status {
  New = 'new',
  Read = 'read',
  Queued = 'queued',
  Processing = 'proccessing',
  Failed = 'failed',
  Cancelled = 'cancelled',
  Done = 'done',
}

export enum ImportData_ImportRule {
  CloseAll = 'close-all',
  ReplaceAll = 'replace-all',
  DeleteAll = 'delete-all',
  // Customer only: hide (isDeleted = true) every customer of the partner that is not in the file
  SyncAll = 'sync-all',
}

export enum ImportData_ToTable {
  Customer = 'customer',
  Contract = 'contract',
  Investigation = 'investigation',
  Activity = 'activity',
  Reference = 'reference',
  Transaction = 'transaction',
}
