import { Roles } from '../roles';
import { Actions } from '../actions';
import { Resources } from '../resources';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const LXM_Permissions: Permission[] = [
  {
    role: Roles.OrganizationManager,
    service: Services.LXM,
    resource: Resources.Any,
    action: Actions.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
      owner: {
        orgId: '{{orgId}}',
      },
    },
    response: {
      isDeleted: null,
      deletedBy: null,
      deletedAt: null,
      changedBy: null,
    },
  },
  {
    role: Roles.OrganizationAgent,
    service: Services.LXM,
    resource: Resources.Any,
    action: Actions.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
      owner: {
        orgId: '{{orgId}}',
      },
    },
    response: {
      isDeleted: null,
      deletedBy: null,
      deletedAt: null,
      changedBy: null,
    },
  },
  {
    role: Roles.OrganizationStaff,
    service: Services.LXM,
    resource: Resources.Any,
    action: Actions.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
      owner: {
        orgId: '{{orgId}}',
      },
    },
    response: {
      isDeleted: null,
      deletedBy: null,
      deletedAt: null,
      changedBy: null,
    },
  },
];
