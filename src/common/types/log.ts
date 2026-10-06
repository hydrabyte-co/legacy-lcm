import { Resources } from '../enums/resources';
import { Services } from '../enums/services';
import { MixedObject } from './data';

export type LogData = {
  service: Services;
  resource: Resources;
  action: string;
  queries: MixedObject;
  inputData: MixedObject;
  preData: MixedObject;
  postData: MixedObject;
  createdBy: {
    orgId: string;
    userId: string;
  };
};
