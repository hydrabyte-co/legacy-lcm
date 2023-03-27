import { getTypeOf } from 'src/common/utils/object-helper';
import { replaceRegexPatternFromString } from 'src/common/utils/string-helper';

export const ActivityToExcelSchema = [
  {
    column: 'staffCode',
    type: String,
    value: (obj) => obj.staffCode,
  },
  {
    column: 'contractCode',
    type: String,
    value: (obj) => obj.contractCode,
  },
  {
    column: 'customerCode',
    type: String,
    value: (obj) => obj.customerCode,
  },
  {
    column: 'relationCode',
    type: String,
    value: (obj) => {
      if (obj.contactInfo) {
        return obj.contactInfo.relation.code;
      } else {
        return '';
      }
    },
  },
  {
    column: 'relationName',
    type: String,
    value: (obj) => {
      if (obj.contactInfo) {
        return obj.contactInfo.relation.name;
      } else {
        return '';
      }
    },
  },
  {
    column: 'fullname',
    type: String,
    value: (obj) => {
      if (obj.contactInfo) {
        return obj.contactInfo.fullname;
      } else {
        return '';
      }
    },
  },
  {
    column: 'phoneNumber',
    type: String,
    value: (obj) => {
      if (obj.contactInfo) {
        return obj.contactInfo.phoneNumber;
      } else {
        return '';
      }
    },
  },
  {
    column: 'performAt',
    type: Date,
    format: 'mm/dd/yyyy',
    value: (obj) => obj.performAt,
  },
  {
    column: 'ptpAmount',
    type: Number,
    value: (obj) => obj.ptpAmount,
  },
  {
    column: 'ptpDate',
    type: Date,
    format: 'mm/dd/yyyy',
    value: (obj) => obj.ptpDate,
  },
  {
    column: 'note',
    type: String,
    value: (obj) => obj.note,
  },
  {
    column: 'type',
    type: String,
    value: (obj) => obj.type,
  },
];
