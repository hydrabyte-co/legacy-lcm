import { Resources } from '../enums/resources';
import { Actions } from '../enums/actions';
import { Roles } from '../enums/roles';
import { Services } from '../enums/services';

export type BasicObject = { [key: string]: number | Date | string | boolean };
export type MixedObject = { [key: string]: any };
export type Permission = {
  role: Roles;
  service: Services;
  resource: Resources;
  action: Actions;
  conditions?: {
    orgId?: '{{orgId}}' | string;
    userId?: '{{userId}}' | string;
    [key: string]: any;
  };
  request?: any;
  response?: any;
};
