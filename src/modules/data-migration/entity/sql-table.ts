import { SetMetadata } from '@nestjs/common';
import { ControllerInfo } from 'src/common/decorators/service-info';

export class MSSQLActivity {
  refId = '';
  contractCode = '';
  customerCode = '';
  staffCode = '';
  class = '';
  resultCode = '';
  relationCode = '';
  relationName = '';
  phoneNumber = '';
  fullname = '';
  contactNote = '';
  ptpDate: Date | null | undefined;
  resultParentCode = '';
  note = '';
  type = '';
  ptpAmount: number | null | undefined;
  createdAt: Date | null | undefined;
  performedAt: Date | null | undefined;
}
export class MSSQLCustomer {
  refId = '';
  code = '';
  partnerCode = '';
  callStaffCode = '';
  fullname = '';
  gender = '';
  dob = '';
  mobileNumber = '';
  officeNumber = '';
  temporaryAddress = '';
  permanentAddress = '';
  createdAt: Date | null | undefined;
  identityNumber = '';
  priority: number | null | undefined;
  status = '';
  fromFile = '';
  officeName = '';
  acim: number | null | undefined;
  lovdd: number | null | undefined;
  tbim: number | null | undefined;
  tpafpim: number | null | undefined;
  tpaim: number | null | undefined;
  active = '';
  officeAddress = '';
  lastPaidAmount: number | null | undefined;
}
export class MSSQLContract {
  refId: string;
  code = '';
  partnerCode = '';
  customerCode = '';
  customerCIF = '';
  productGroup = '';
  originalBalance: number | null | undefined;
  totalBalance: number | null | undefined;
  ovdBalance: number | null | undefined;
  performingBalance: number | null | undefined;
  periodicalPaymentAmount: number | null | undefined;
  prAmount: number | null | undefined;
  inAmount: number | null | undefined;
  psAmount: number | null | undefined;
  ovdDays: number | null | undefined;
  totalPaymentAmount: number | null | undefined;
  term = '';
  status = '';
  isDeleted: boolean;
  createdAt: Date | null | undefined;
  accountNo = '';
  statusOfLoan = '';
  guid = '';
  fromFile = '';
  totalPaymentAmountFromPartner: number | null | undefined;
  bucket = '';
  active = '';
}
export class MSSQLReference {
  refId: string;
  customerCode = '';
  callStaffCode = '';
  relationCode = '';
  mobileNumber = '';
  isDeleted: boolean;
  createdAt: Date | null | undefined;
  fullname = '';
  gender = '';
  identityNumber = '';
  officeNumber = '';
  fromFile = '';
}
export class MSSQLInvestigation {
  refId: string;
  customerCode = '';
  staffCode = '';
  typeCode = '';
  value = '';
  note = '';
  createdAt: Date | null | undefined;
}

export class MSSQLCalls {
  refId: string;
  direction = '';
  campaignId = '';
  campaignName = '';
  fromSIPAccountId = '';
  result = '';
  recordFile = '';
  fromNumber = '';
  toNumber = '';
  activityId = '';
  customerFullname = '';
  staffCode = '';
  customerCode = '';
  createdAt: Date | null | undefined;
  duration = 0;
  answeredDuration = 0;
}
