import { Roles } from '../roles';
import { Actions } from '../actions';
import { Resources } from '../resources';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const IAM_Permissions: Permission[] = [
  {
    role: Roles.OrganizationOwner,
    service: Services.IAM,
    resource: Resources.Any,
    action: Actions.Any,
    conditions: {
      'owner.orgId': '{{orgId}}',
    },
    response: {
      isDeleted: null,
      deletedBy: null,
      deletedAt: null,
      createdBy: null,
      changedBy: null,
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.IAM,
    resource: Resources.IAM_User,
    action: Actions.Any,
    conditions: {
      'owner.orgId': '{{orgId}}',
    },
    response: {
      password: null,
      isDeleted: null,
      deletedBy: null,
      deletedAt: null,
      createdBy: null,
      changedBy: null,
    },
  },
];
