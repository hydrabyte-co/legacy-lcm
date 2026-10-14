import { Roles } from '../roles';
import { Actions } from '../actions';
import { Resources } from '../resources';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const VCM_Permissions: Permission[] = [
  {
    role: Roles.OrganizationOwner,
    service: Services.VCM,
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
