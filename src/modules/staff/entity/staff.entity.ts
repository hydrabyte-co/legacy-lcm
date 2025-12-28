import { Column, Entity } from 'typeorm';
import { Resources } from '../../../common/enums/resources';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { StaffStatus, StaffType } from '../enum/staff.enum';

@Entity(Resources.LCM_Staff)
export class Staff extends Base {
  @Column()
  hostname = '';

  @Column()
  note = '';

  @Column()
  type = StaffType.Asterisk;

  @Column()
  attributes: { [key: string]: number | Date | string | boolean } = {};

  @Column()
  orgIds: string[] = [];

  @Column()
  status = StaffStatus.Active;
}
