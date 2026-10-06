import { Roles } from '../roles';
import { Actions } from '../actions';
import { Resources } from '../resources';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const ERM_Permissions: Permission[] = [
  {
    role: Roles.OrganizationMember,
    service: Services.ERM,
    resource: Resources.Any,
    action: Actions.Any,
    conditions: {
      'owner.orgId': '{{orgId}}',
    },
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
  {
    role: Roles.OrganizationSimAdmin,
    service: Services.ERM,
    resource: Resources.Any,
    action: Actions.Any,
    conditions: {
      'owner.orgId': '{{orgId}}',
    },
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
