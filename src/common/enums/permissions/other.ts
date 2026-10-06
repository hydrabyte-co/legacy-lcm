import { Roles } from '../roles';
import { Actions } from '../actions';
import { Resources } from '../resources';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const Other_Permissions: Permission[] = [
  {
    role: Roles.OrganizationSalesManager,
    service: Services.Any,
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
    role: Roles.OrganizationAdmin,
    service: Services.Any,
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
];
