import { Roles } from '../roles';
import { Actions } from '../actions';
import { Resources } from '../resources';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const SW_Permissions: Permission[] = [
  {
    role: Roles.OrganizationOwner,
    service: Services.SW,
    resource: Resources.Any,
    action: Actions.Any,
    conditions: {},
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
    service: Services.SW,
    resource: Resources.SW_User,
    action: Actions.FindOne,
    conditions: {},
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
      password: null,
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.SW,
    resource: Resources.SW_User,
    action: Actions.FindOne,
    conditions: {},
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
      password: null,
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.SW,
    resource: Resources.SW_Request,
    action: Actions.UpdateOne,
    conditions: {
      'owner.orgId': '{{orgId}}',
      'owner.userId': '{{userId}}',
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
      password: null,
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.SW,
    resource: Resources.SW_Request,
    action: Actions.DeleteOne,
    conditions: {
      'owner.orgId': '{{orgId}}',
      'owner.userId': '{{userId}}',
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
      password: null,
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.SW,
    resource: Resources.SW_Update,
    action: Actions.DeleteOne,
    conditions: {
      'owner.orgId': '{{orgId}}',
      'owner.userId': '{{userId}}',
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
      password: null,
    },
  },
];
