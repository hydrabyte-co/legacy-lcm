import { Roles } from '../roles';
import { Actions } from '../actions';
import { Resources } from '../resources';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const MSG_Permissions: Permission[] = [
  {
    role: Roles.OrganizationOwner,
    service: Services.MSG,
    resource: Resources.Any,
    action: Actions.Any,
    conditions: {},
    request: {
      'owner.orgId': '{{orgId}}',
      'owner.userId': '{{userId}}',
    },
    response: {
      isDeleted: null,
      deletedBy: null,
      deletedAt: null,
      createdBy: null,
      changedBy: null,
    },
  },
];
