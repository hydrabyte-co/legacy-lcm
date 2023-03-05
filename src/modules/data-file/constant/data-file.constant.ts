import { getTypeOf } from 'src/common/utils/object-helper';
import { replaceRegexPatternFromString } from 'src/common/utils/string-helper';

export const relations: {
  name: string;
  code: string;
  tags: string[];
}[] = [
  {
    name: 'Bố mẹ',
    code: 'parent',
    tags: ['bố mẹ', 'bố', 'mẹ'],
  },
  {
    name: 'Vợ chồng',
    code: 'spouse',
    tags: ['vợ chồng', 'vợ', 'chồng'],
  },
  {
    name: 'Anh chị em',
    code: 'sibling',
    tags: ['anh chị em', 'anh', 'chị', 'em'],
  },
  {
    name: 'Con cái',
    code: 'child',
    tags: ['con', 'con trai', 'con gái'],
  },
  {
    name: 'Bạn bè',
    code: 'friend',
    tags: ['bạn', 'bạn bè'],
  },
  {
    name: 'Người thân khác',
    code: 'other-relative',
    tags: ['cô', 'chú', 'bác', 'cháu', 'ông', 'bà'],
  },
  {
    name: 'Đồng nghiệp',
    code: 'colleague',
    tags: ['đồng nghiệp', 'công ty'],
  },
  {
    name: 'Đồng nghiệp',
    code: 'colleague',
    tags: ['đồng nghiệp'],
  },
  {
    name: 'Khác',
    code: 'other',
    tags: [''],
  },
];

export const activityTypes: {
  name: string;
  code: string;
  tags: string[];
}[] = [
  {
    name: 'Gọi',
    code: 'call',
    tags: ['call'],
  },
  {
    name: 'Mạnh xã hội',
    code: 'social-network',
    tags: ['mạng xã hội', 'mxh', 'facebook', 'zalo'],
  },
  {
    name: 'Điều tra',
    code: 'skip',
    tags: ['skip'],
  },
];

export const investigationTypes: {
  name: string;
  code: string;
  tags: string[];
}[] = [
  {
    name: 'Địa chỉ',
    code: 'address',
    tags: ['địa chỉ', 'address'],
  },
  {
    name: 'Email',
    code: 'email',
    tags: ['email'],
  },
  {
    name: 'Mạng xã hội',
    code: 'social-network',
    tags: [
      'mxh',
      'facebook',
      'mạng xã hội',
      'twitter',
      'zalo',
      'social-network',
    ],
  },
  {
    name: 'Số điện thoại',
    code: 'phone-number',
    tags: ['điện thoại', 'di dộng', 'số điện thoại', 'phone-number'],
  },
  {
    name: 'Thông tin khác',
    code: 'other',
    tags: ['thông tin khác', 'other'],
  },
];

export const CustomerXlsxSchema = {
  code: {
    prop: 'code',
    type: String,
    required: true,
  },
  partnerCode: {
    prop: 'partnerCode',
    type: String,
    required: true,
  },
  callStaffCode: {
    prop: 'callStaffCode',
    type: String,
    required: false,
  },
  fieldStaffCode: {
    prop: 'fieldStaffCode',
    type: String,
    required: false,
  },
  fullname: {
    prop: 'fullname',
    type: String,
    required: true,
  },
  gender: {
    prop: 'gender',
    type: String,
    required: false,
  },
  dob: {
    prop: 'dob',
    type: Date,
    required: false,
  },
  identityNumber: {
    prop: 'identityNumber',
    type: String,
    required: true,
  },
  mobileNumber: {
    prop: 'mobileNumber',
    type: String,
    required: true,
  },
  officeNumber: {
    prop: 'officeNumber',
    type: (value) => {
      return replaceRegexPatternFromString(value, '[^0-9]+', '');
    },
    required: false,
  },
  email: {
    prop: 'email',
    type: String,
    required: false,
  },
  temporaryAddress: {
    prop: 'temporaryAddress',
    type: String,
    required: false,
  },
  permanentAddress: {
    prop: 'permanentAddress',
    type: String,
    required: false,
  },
  officeAddress: {
    prop: 'officeAddress',
    type: String,
    required: false,
  },
  officeName: {
    prop: 'officeName',
    type: String,
    required: false,
  },
  jobPosition: {
    prop: 'jobPosition',
    type: String,
    required: false,
  },
  businessDomain: {
    prop: 'businessDomain',
    type: String,
    required: false,
  },
  note: {
    prop: 'note',
    type: String,
    required: false,
  },
  status: {
    prop: 'status',
    type: String,
    required: false,
  },
};

export const ContractXlsxSchema = {
  code: {
    prop: 'code',
    type: String,
    required: true,
  },
  partnerCode: {
    prop: 'partnerCode',
    type: String,
    required: true,
  },
  customerCode: {
    prop: 'customerCode',
    type: String,
    required: false,
  },
  guid: {
    prop: 'guid',
    type: String,
    required: false,
  },
  customerCIF: {
    prop: 'customerCIF',
    type: String,
    required: false,
  },
  productGroup: {
    prop: 'productGroup',
    type: String,
    required: false,
  },
  originalBalance: {
    prop: 'originalBalance',
    type: Number,
    required: false,
  },
  totalBalance: {
    prop: 'totalBalance',
    type: Number,
    required: false,
  },
  ovdBalance: {
    prop: 'ovdBalance',
    type: Number,
    required: false,
  },
  performingBalance: {
    prop: 'performingBalance',
    type: Number,
    required: false,
  },
  periodicalPaymentAmount: {
    prop: 'periodicalPaymentAmount',
    type: Number,
    required: false,
  },
  prAmount: {
    prop: 'prAmount',
    type: Number,
    required: false,
  },
  inAmount: {
    prop: 'inAmount',
    type: Number,
    required: false,
  },
  peAmount: {
    prop: 'peAmount',
    type: Number,
    required: false,
  },
  psAmount: {
    prop: 'psAmount',
    type: Number,
    required: false,
  },
  ovdDays: {
    prop: 'ovdDays',
    type: Number,
    required: false,
  },
  totalPaymentAmountFromPartner: {
    prop: 'totalPaymentAmountFromPartner',
    type: Number,
    required: false,
  },
  totalPaymentAmount: {
    prop: 'totalPaymentAmount',
    type: Number,
    required: false,
  },
  valueDate: {
    prop: 'valueDate',
    type: Date,
    required: false,
  },
  maturityDate: {
    prop: 'maturityDate',
    type: Date,
    required: false,
  },
  ovdDate: {
    prop: 'ovdDate',
    type: Date,
    required: false,
  },
  dueDayOfMonth: {
    prop: 'dueDayOfMonth',
    type: Number,
    required: false,
  },
  bucket: {
    prop: 'bucket',
    type: Number,
    required: false,
  },
  term: {
    prop: 'term',
    type: String,
    required: false,
  },
  transferDate: {
    prop: 'transferDate',
    type: Date,
    required: false,
  },
  status: {
    prop: 'status',
    type: String,
    required: false,
  },
  interestRate: {
    prop: 'interestRate',
    type: Number,
    required: false,
  },
  branchName: {
    prop: 'branchName',
    type: String,
    required: false,
  },
  branchCode: {
    prop: 'branchCode',
    type: String,
    required: false,
  },
  accountNo: {
    prop: 'accountNo',
    type: String,
    required: false,
  },
  lastPaymentAmount: {
    prop: 'lastPaymentAmount',
    type: Number,
    required: false,
  },
  lastPaymentDate: {
    prop: 'lastPaymentDate',
    type: Date,
    required: false,
  },
  contractLink: {
    prop: 'contractLink',
    type: String,
    required: false,
  },
  ovdPeriod: {
    prop: 'ovdPeriod',
    type: Number,
    required: false,
  },
  statusOfLoan: {
    prop: 'statusOfLoan',
    type: String,
    required: false,
  },
};

export const TransactionXlsxSchema = {
  customerCode: {
    prop: 'customerCode',
    type: String,
    required: true,
  },
  contractCode: {
    prop: 'contractCode',
    type: String,
    required: true,
  },
  amount: {
    prop: 'amount',
    type: Number,
    required: true,
  },
  date: {
    prop: 'date',
    type: Date,
    required: true,
  },
};

export const ReferenceXlsxSchema = {
  customerCode: {
    prop: 'customerCode',
    type: String,
    required: true,
  },
  callStaffCode: {
    prop: 'callStaffCode',
    type: String,
    required: true,
  },
  relationCode: {
    prop: 'relationCode',
    type: String,
    required: false,
  },
  fullname: {
    prop: 'fullname',
    type: String,
    required: true,
  },
  gender: {
    prop: 'gender',
    type: String,
    required: false,
  },
  dob: {
    prop: 'dob',
    type: Date,
    required: false,
  },
  identityNumber: {
    prop: 'identityNumber',
    type: String,
    required: false,
  },
  mobileNumber: {
    prop: 'mobileNumber',
    type: String,
    required: true,
  },
  officeNumber: {
    prop: 'officeNumber',
    type: String,
    required: false,
  },
  email: {
    prop: 'email',
    type: String,
    required: false,
  },
  temporaryAddress: {
    prop: 'temporaryAddress',
    type: String,
    required: false,
  },
  permanentAddress: {
    prop: 'permanentAddress',
    type: String,
    required: false,
  },
  note: {
    prop: 'note',
    type: String,
    required: false,
  },
  createdAt: {
    prop: 'date',
    type: Date,
    required: true,
  },
};

export const InvestigationXlsxSchema = {
  customerCode: {
    prop: 'customerCode',
    type: String,
    required: true,
  },
  staffCode: {
    prop: 'staffCode',
    type: String,
    required: true,
  },
  typeCode: {
    prop: 'typeCode',
    type: String,
    required: true,
  },
  value: {
    prop: 'value',
    type: String,
    required: false,
  },
  note: {
    prop: 'note',
    type: String,
    required: false,
  },
};

export const ActivityXlsxSchema = {
  customerCode: {
    prop: 'customerCode',
    type: String,
    required: true,
  },
  staffCode: {
    prop: 'staffCode',
    type: String,
    required: true,
  },
  contractCode: {
    prop: 'contractCode',
    type: String,
    required: false,
  },
  type: {
    prop: 'type',
    type: String,
    required: true,
  },
  note: {
    prop: 'note',
    type: String,
    required: false,
  },
  referenceId: {
    prop: 'referenceId',
    type: String,
    required: false,
  },
  resultCode: {
    prop: 'resultCode',
    type: String,
    required: false,
  },
  resultParentCode: {
    prop: 'resultParentCode',
    type: String,
    required: false,
  },
  ptpDate: {
    prop: 'ptpDate',
    type: String,
    required: false,
  },
  ptpAmount: {
    prop: 'ptpAmount',
    type: Number,
    required: false,
  },
  createdAt: {
    prop: 'createdAt',
    type: Date,
    required: false,
  },
};
