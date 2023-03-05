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
}
