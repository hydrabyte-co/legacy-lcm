import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindByIdResult } from '../../../common/modules/base/dto/find-one.dto';
import { ActivityTypeCode } from '../enum/activity.enum';

@Exclude()
export class FindActivityByIdActivity extends BaseFindByIdResult {
  @Expose()
  staffCode = '';

  @Expose()
  contractCode = '';

  @Expose()
  customerCode = '';

  @Expose()
  type = ActivityTypeCode.Call;

  @Expose()
  contactInfo = {};

  @Expose()
  reference = {};

  @Expose()
  resultCode = '';

  @Expose()
  resultParentCode = '';

  @Expose()
  note = '';

  @Expose()
  ptpDate;

  @Expose()
  ptpAmount;

  @Expose()
  performAt;
}
