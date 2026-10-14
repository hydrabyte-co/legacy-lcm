import { Roles } from '../roles';
import { Actions } from '../actions';
import { Resources } from '../resources';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const VSM_Permissions: Permission[] = [
  {
    role: Roles.OrganizationOwner,
    service: Services.VSM,
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
    role: Roles.OrganizationTechnician,
    service: Services.VSM,
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
    role: Roles.OrganizationManager,
    service: Services.VSM,
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
  /* {
    role: Roles.OrganizationOwner,
    service: Services.VSM,
    resource: Resources.VSM_Calls,
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
  } ,*/
  {
    role: Roles.OrganizationPartner,
    service: Services.VSM,
    resource: Resources.VSM_Calls,
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
  {
    role: Roles.OrganizationManager,
    service: Services.VSM,
    resource: Resources.VSM_Calls,
    action: Actions.Any,
    conditions: {
      'owner.orgId': '{{orgId}}',
    },
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
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
    role: Roles.OrganizationStaff,
    service: Services.VSM,
    resource: Resources.VSM_Calls,
    action: Actions.Any,
    conditions: {
      'owner.orgId': '{{orgId}}',
    },
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
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
