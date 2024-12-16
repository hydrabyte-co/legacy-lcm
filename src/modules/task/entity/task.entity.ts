import { Entity, Column } from 'typeorm';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Resources } from 'src/common/enums/resources';
import { BasicObject } from 'src/common/types/data';
import { TaskStatuses } from 'src/enums';

@Entity(Resources.LCM_Activities)
export class Task extends Base {
  @Column()
  assigner: {
    userId: string;
    staffCode: string;
  } = {
    userId: '',
    staffCode: '',
  };

  @Column()
  assignee: {
    userId: string;
    staffCode: string;
  } = {
    userId: '',
    staffCode: '',
  };

  @Column()
  summary = '';

  @Column()
  status: TaskStatuses = TaskStatuses.Todo;

  @Column()
  data: BasicObject = {};
}
