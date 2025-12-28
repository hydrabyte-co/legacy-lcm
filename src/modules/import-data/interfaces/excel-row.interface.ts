/**
 * Interface for Excel import data rows
 * Defines the structure of customer data imported from Excel files
 */
export interface ExcelRowData {
  code?: string;
  partnerCode?: string;
  callStaffCode?: string;
  name?: string;
  identityNumber?: string;
  mobileNumber?: string;
  officeNumber?: string;
  address?: string;
  email?: string;
  dob?: string | Date;
  gender?: string;
  status?: string;
  contractCode?: string;
  contractAmount?: number;
  balance?: number;
  overdueDays?: number;
  notes?: string;
  lastCallDate?: string | Date;
  lastPaymentDate?: string | Date;
  [key: string]: any; // Allow additional properties
}

/**
 * Interface for Excel processing result
 */
export interface ExcelProcessingResult {
  rows: ExcelRowData[];
  errors: any[];
  totalRows: number;
  validRows: number;
  invalidRows: number;
}