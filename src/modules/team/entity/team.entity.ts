import { Entity, Column } from 'typeorm';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Resources } from 'src/common/enums/resources';
import { BasicObject } from 'src/common/types/data';
import { TeamStatuses } from 'src/enums';

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
