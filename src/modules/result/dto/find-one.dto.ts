import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindByIdResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindResultByIdResult extends BaseFindByIdResult {
  @Expose()
  code = '';

  @Expose()
  parentCode = '';

  @Expose()
  index = 0;

  @Expose()
  name = '';

  @Expose()
  note = '';

  @Expose()
  isActive = false;

  @Expose()
  isSelectable = false;
}
