import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindByIdResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindStaffByIdResult extends BaseFindByIdResult {
  @Expose()
  hostname;

  @Expose()
  note;

  @Expose()
  type;

  @Expose()
  attributes;

  @Expose()
  status;

  @Expose()
  orgIds;
}
