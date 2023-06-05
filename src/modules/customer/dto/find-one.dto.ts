import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindByIdResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindCustomerByIdResult extends BaseFindByIdResult {
  @Expose()
  code = '';

  @Expose()
  partnerCode = '';

  @Expose()
  callStaffCode = '';

  @Expose()
  fieldStaffCode = '';

  @Expose()
  fullname = '';

  @Expose()
  gender = '';

  @Expose()
  dob = new Date();

  @Expose()
  identityNumber = '';

  @Expose()
  mobileNumber = '';

  @Expose()
  officeNumber = '';

  @Expose()
  email = '';

  @Expose()
  temporaryAddress = '';

  @Expose()
  permanentAddress = '';

  @Expose()
  officeAddress = '';

  @Expose()
  officeName = '';

  @Expose()
  jobPosition = '';

  @Expose()
  businessDomain = '';

  @Expose()
  status = '';

  @Expose()
  note = '';

  @Expose()
  priority;

  @Expose()
  lastActivityDate;

  @Expose()
  lastActivity;

  @Expose()
  lastPTPActivity;

  @Expose()
  contractCodes;

  @Expose()
  nextOVDDate;

  //activitiesCountInMonth
  @Expose()
  acim = 0;

  //totalPaymentAmountInMonth
  @Expose()
  tpaim = 0;

  //totalPaymentAmountFromPartnerInMonth
  @Expose()
  tpafpim = 0;

  //resultCodesInMonth
  @Expose()
  rcim: string[] = [];

  @Expose()
  sols: string[] = [];

  //totalBalanceInMonth
  @Expose()
  tbim = 0;

  //largestOVDDays
  @Expose()
  lovdd = 0;

  //lastPaidDate
  @Expose()
  lastPaidDate;

  //lastPaidAmount
  @Expose()
  lastPaidAmount;
}
