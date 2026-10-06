import { Roles } from '../roles';
import { Actions } from '../actions';
import { Resources } from '../resources';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const CVB_Permissions: Permission[] = [
  {
    role: Roles.OrganizationOwner,
    service: Services.CVB,
    resource: Resources.Any,
    action: Actions.Any,
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
  {
    role: Roles.OrganizationPartner,
    service: Services.CVB,
    resource: Resources.Any,
    action: Actions.Any,
    request: {
      where: {
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
