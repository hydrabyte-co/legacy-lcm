import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindByIdResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindTeamByIdResult extends BaseFindByIdResult {
  @Expose()
  code = '';

  @Expose()
  name = '';

  @Expose()
  description = '';

  @Expose()
  managerCode = '';

  @Expose()
  partnerCode = '';

  @Expose()
  teamType = '';

  @Expose()
  status = '';

  @Expose()
  memberCount = 0;

  @Expose()
  targetAmount = 0;

  @Expose()
  achievedAmount = 0;

  @Expose()
  performance = 0;
}