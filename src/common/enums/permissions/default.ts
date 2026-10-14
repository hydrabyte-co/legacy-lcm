import { Roles } from '../roles';
import { Actions } from '../actions';
import { Resources } from '../resources';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const Default_Permissions: Permission[] = [
  // Start: UniverseOwner
  {
    role: Roles.UniverseOwner,
    service: Services.Any,
    resource: Resources.Any,
    action: Actions.Any,
    request: {
      'owner.orgId': '{{orgId}}',
      'owner.userId': '{{userId}}',
    },
  },
  {
    role: Roles.UniverseOwner,
    service: Services.WebBot,
    resource: Resources.Any,
    action: Actions.Any,
    request: {
      owner: {
        orgId: '{{orgId}}',
        userId: '{{userId}}',
      },
    },
  },
  // End: UniverseOwner
  {
    role: Roles.OrganizationOwner,
    service: Services.Any,
    resource: Resources.Any,
    action: Actions.Any,
    conditions: {
      'owner.orgId': '{{orgId}}',
    },
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
      owner: {
        orgId: '{{orgId}}',
        userId: '{{userId}}',
      },
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
