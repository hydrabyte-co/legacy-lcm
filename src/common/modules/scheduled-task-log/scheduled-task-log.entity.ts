import { MixedObject } from 'src/common/types/data';
import { Column, Entity } from 'typeorm';
import { Resources } from '../../enums/resources';
import { Base } from '../base/entity/base.entity';
import { ScheduledTaskLogStatuses } from './scheduled-task-log.misc';

@Entity(Resources.ScheduledTaskLog)
export class ScheduledTaskLog extends Base {
  @Column()
  taskId: string;

  @Column()
  errorData: MixedObject;

  @Column()
  resultData: MixedObject;

  @Column()
  status: ScheduledTaskLogStatuses;
}
