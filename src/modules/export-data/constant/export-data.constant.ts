import { getTypeOf } from 'src/common/utils/object-helper';
import { replaceRegexPatternFromString } from 'src/common/utils/string-helper';

export const ActivitiesToExcelSchema = [
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
    column: 'contactNote',
    type: String,
    value: (obj) => {
      if (obj.contactInfo) {
        return obj.contactInfo.note;
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

export const OutboundCallsToExcelSchema = [
  {
    column: 'staffCode',
    type: String,
    value: (obj) => {
      if (obj.data) {
        return obj.data.staffCode;
      } else {
        return '';
      }
    },
  },
  {
    column: 'customerCode',
    type: String,
    value: (obj) => {
      if (obj.data) {
        return obj.data.customerCode;
      } else {
        return '';
      }
    },
  },
  {
    column: 'fromSIPAccountId',
    type: String,
    value: (obj) => obj.fromSIPAccountId,
  },
  {
    column: 'fromUserId',
    type: String,
    value: (obj) => obj.fromUserId,
  },
  {
    column: 'fromNumber',
    type: String,
    value: (obj) => obj.fromNumber,
  },
  {
    column: 'toNumber',
    type: String,
    value: (obj) => obj.toNumber,
  },
  {
    column: 'startedAt',
    type: Date,
    format: 'mm/dd/yyyy',
    value: (obj) => {
      return new Date(obj.startedAt);
    },
  },
  {
    column: 'answeredAt',
    type: Date,
    format: 'mm/dd/yyyy',
    value: (obj) => {
      if (obj.answeredAt) {
        return new Date(obj.answeredAt);
      } else {
        return undefined;
      }
    },
  },
  {
    column: 'duration',
    type: Number,
    value: (obj) => obj.duration,
  },
  {
    column: 'answeredDuration',
    type: Number,
    value: (obj) => obj.answeredDuration,
  },
  {
    column: 'result',
    type: String,
    value: (obj) => obj.result,
  },
];
