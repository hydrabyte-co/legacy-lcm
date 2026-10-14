import { MixedObject } from 'src/common/types/data';
import { DataOwner } from '../base/entity/data.class';

export enum ScheduledTaskStatuses {
  Scheduled = 'scheduled',
  Unscheduled = 'unscheduled',
  Stopped = 'stopped',
}
export type ScheduledTaskPayload = {
  id?: string;
  owner?: DataOwner;
  logId?: string;
  type?: string;
  parameters?: MixedObject;
  lastRunData?: MixedObject;
};
