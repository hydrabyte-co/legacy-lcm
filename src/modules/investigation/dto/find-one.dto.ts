import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindByIdResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindInvestigationByIdResult extends BaseFindByIdResult {
  @Expose()
  customerCode = '';

  @Expose()
  staffCode = '';

  @Expose()
  typeCode = '';

  @Expose()
  value = '';

  @Expose()
  note = '';

  @Expose()
  date = new Date();
}
