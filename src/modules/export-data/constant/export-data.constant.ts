
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
    //type: Date,
    type: String,
    //format: 'mm/dd/yyyy',
    value: (obj) => {
      if (obj.performAt) {
        return obj.performAt.toISOString();
      } else {
        return '';
      }
    },
  },
  {
    column: 'ptpAmount',
    type: Number,
    value: (obj) => obj.ptpAmount,
  },
  {
    column: 'ptpDate',
    type: String,
    //format: 'mm/dd/yyyy',
    value: (obj) => {
      if (obj.ptpDate) {
        return obj.ptpDate.toISOString();
      } else {
        return '';
      }
    },
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
  {
    column: 'resultCode',
    type: String,
    value: (obj) => obj.resultCode,
  },
  {
    column: 'resultParentCode',
    type: String,
    value: (obj) => obj.resultParentCode,
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
    column: 'SIPAccountName',
    type: String,
    value: (obj) => {
      if (obj.data) {
        return obj.data.sipAccountName;
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
    type: String,
    //format: 'mm/dd/yyyy hh:mm:ss',
    value: (obj) => {
      //return new Date(obj.startedAt);
      return obj.startedAt;
    },
  },
  {
    column: 'answeredAt',
    //type: Date,
    type: String,
    //format: 'mm/dd/yyyy hh:mm:ss',
    value: (obj) => {
      if (obj.answeredAt) {
        //return new Date(obj.answeredAt);
        return obj.answeredAt;
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

export const CustomersToExcelSchema = [
  {
    column: 'code',
    type: String,
    value: (obj) => obj.code,
  },
  {
    column: 'partnerCode',
    type: String,
    value: (obj) => obj.partnerCode,
  },
  {
    column: 'callStaffCode',
    type: String,
    value: (obj) => obj.callStaffCode,
  },
  {
    column: 'fieldStaffCode',
    type: String,
    value: (obj) => obj.fieldStaffCode,
  },
  {
    column: 'fullname',
    type: String,
    value: (obj) => obj.fullname,
  },
  {
    column: 'temporaryAddress',
    type: String,
    value: (obj) => obj.temporaryAddress,
  },
  {
    column: 'priority',
    type: Number,
    value: (obj) => obj.priority,
  },
  {
    column: 'status',
    type: String,
    value: (obj) => obj.status,
  },
  {
    column: 'lastPTPActivity.ptpAmount',
    type: String,
    value: (obj) => obj.ptpAmount,
  },
  {
    column: 'lastPTPActivity.ptpDate',
    type: String,
    value: (obj) => obj.ptpDate,
  },
  {
    column: 'contractCodes',
    type: String,
    value: (obj) => {
      if (obj.contractCodes) {
        return obj.contractCodes.join(',');
      } else {
        return '';
      }
    },
  },
];
