export enum ExportData_FromDocuments {
  Customers = 'customers',
  Contracts = 'contracts',
  Investigations = 'investigations',
  Activities = 'activities',
  References = 'references',
  Transactions = 'transactions',
  AnsweredOutboundCalls = 'answered-outbound-calls',
  OutboundCalls = 'outbound-calls',
  InboundCalls = 'inbound-calls',
}

export enum ExportData_OutputFileType {
  CSV = 'csv',
  Excel = 'excel',
}

export enum ExportData_Status {
  Todo = 'todo',
  Queued = 'queued',
  InProgress = 'in-progress',
  Done = 'done',
  Failed = 'failed',
  Canceled = 'canceld',
}
