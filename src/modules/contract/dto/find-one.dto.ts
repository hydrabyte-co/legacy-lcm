import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindByIdResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindContractByIdResult extends BaseFindByIdResult {
  code = '';

  @Expose()
  partnerCode = '';

  @Expose()
  customerCode = '';

  @Expose()
  guid = '';

  @Expose()
  customerCIF = '';

  @Expose()
  productGroup = '';

  @Expose()
  originalBalance = 0;

  @Expose()
  TotalBalance = 0;

  @Expose()
  ovdBalance = 0;

  @Expose()
  performingBalance = 0;

  @Expose()
  periodicalPaymentAmount = 0;

  @Expose()
  prAmount = 0;

  @Expose()
  inAmount = 0;

  @Expose()
  peAmount = 0;

  @Expose()
  psAmount = 0;

  @Expose()
  valueDate = new Date();

  @Expose()
  maturityDate = new Date();

  @Expose()
  ovdDate = new Date();

  @Expose()
  dueDayOfMonth = 1;

  @Expose()
  bucket = 0;

  @Expose()
  term = '';

  @Expose()
  startedAt: Date = new Date();

  @Expose()
  endedAt: Date = new Date();

  @Expose()
  status = '';
}
