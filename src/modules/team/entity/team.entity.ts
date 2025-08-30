import { Column, Entity } from 'typeorm';
import { Resources } from '../../../common/enums/resources';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { BasicObject } from '../../../common/types/data';
import { TeamStatuses } from '../../../enums';

@Entity(Resources.LCM_Team)
export class Team extends Base {
  @Column()
  name = '';

  @Column()
  leaderStaffCode = '';

  @Column()
  memberStaffCodes = [];

  @Column()
  status: TeamStatuses = TeamStatuses.Inactive;

  @Column()
  data: BasicObject = {};
}
