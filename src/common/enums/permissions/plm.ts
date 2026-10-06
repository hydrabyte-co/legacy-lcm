import { Roles } from '../roles';
import { Actions } from '../actions';
import { Resources } from '../resources';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const PLM_Permissions: Permission[] = [
  {
    role: Roles.UniverseOwner,
    service: Services.PLM,
    resource: Resources.Any,
    action: Actions.Any,
    request: {
      where: {},
      owner: {
        orgId: '{{orgId}}',
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
  {
    role: Roles.OrganizationOwner,
    service: Services.PLM,
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
      createdBy: null,
      changedBy: null,
    },
  },
];
