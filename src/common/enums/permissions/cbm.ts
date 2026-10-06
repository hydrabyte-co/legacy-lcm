import { Roles } from '../roles';
import { Actions } from '../actions';
import { Resources } from '../resources';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const CBM_Permissions: Permission[] = [
  {
    role: Roles.UniverseOwner,
    service: Services.CBM,
    resource: Resources.CBM_ChatConnection,
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
    role: Roles.OrganizationOwner,
    service: Services.CBM,
    resource: Resources.CBM_Account,
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
    role: Roles.OrganizationOwner,
    service: Services.CBM,
    resource: Resources.CBM_Conversation,
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
    role: Roles.OrganizationOwner,
    service: Services.CBM,
    resource: Resources.CBM_Message,
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
