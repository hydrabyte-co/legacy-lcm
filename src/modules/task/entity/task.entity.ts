import { Column, Entity } from 'typeorm';
import { Resources } from '../../../common/enums/resources';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { BasicObject } from '../../../common/types/data';
import { TaskStatuses } from '../../../enums';

@Entity(Resources.LCM_Task)
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
