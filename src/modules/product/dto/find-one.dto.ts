import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindByIdResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindCategoryByIdResult extends BaseFindByIdResult {
  @Expose()
  name = '';

  @Expose()
  note = '';

  @Expose()
  isActive = false;
}
