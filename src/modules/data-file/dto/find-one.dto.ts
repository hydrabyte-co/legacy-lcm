import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindByIdResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindDataFileByIdResult extends BaseFindByIdResult {
  @Expose()
  fileName = '';

  @Expose()
  info = {};

  @Expose()
  settings = {};

  @Expose()
  note = '';

  @Expose()
  status = '';
}
