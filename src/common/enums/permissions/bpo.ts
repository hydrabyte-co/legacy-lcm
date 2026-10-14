import { Roles } from '../roles';
import { Actions } from '../actions';
import { Resources } from '../resources';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const BPO_Permissions: Permission[] = [
  {
    role: Roles.OrganizationOwner,
    service: Services.BPO,
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
    role: Roles.OrganizationSale,
    service: Services.BPO,
    resource: Resources.BPO_Product,
    action: Actions.FindManyWithPaging,
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
      attributes: null,
      costPrice: null,
      partnerCode: null,
      status: null,
    },
  },
  {
    role: Roles.OrganizationSale,
    service: Services.BPO,
    resource: Resources.BPO_Order,
    action: Actions.FindManyWithPaging,
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
      partnerCode: null,
      partnerAPIResponse: null,
    },
  },
  {
    role: Roles.OrganizationSale,
    service: Services.BPO,
    resource: Resources.BPO_Order,
    action: Actions.CreateOne,
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
      partnerCode: null,
      partnerAPIResponse: null,
    },
  },
  {
    role: Roles.OrganizationSale,
    service: Services.BPO,
    resource: Resources.OFM_Report,
    action: Actions.StatisticsOrder,
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
      partnerCode: null,
      partnerAPIResponse: null,
    },
  },
];
