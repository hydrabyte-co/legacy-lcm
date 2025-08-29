import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindByIdResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindCallByIdResult extends BaseFindByIdResult {
  @Expose()
  customerCode = '';

  @Expose()
  partnerCode = '';

  @Expose()
  staffCode = '';

  @Expose()
  phoneNumber = '';

  @Expose()
  callType = '';

  @Expose()
  callStatus = '';

  @Expose()
  callResult = '';

  @Expose()
  startTime = new Date();

  @Expose()
  endTime = new Date();

  @Expose()
  duration = 0;

  @Expose()
  recording = '';

  @Expose()
  notes = '';

  @Expose()
  followUpDate = new Date();

  @Expose()
  promiseToPayAmount = 0;

  @Expose()
  promiseToPayDate = new Date();
}