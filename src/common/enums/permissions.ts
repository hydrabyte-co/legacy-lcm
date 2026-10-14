import { LXM_Permissions } from './permissions/lxm';
import { Permission } from '../types/data';
import { Default_Permissions } from './permissions/default';
import { OFM_Permissions } from './permissions/ofm';
import { Voice_Permissions } from './permissions/voice';
import { BPO_Permissions } from './permissions/bpo';
import { CSM_Permissions } from './permissions/csm';
import { BSM_Permissions } from './permissions/bsm';
import { LSM_Permissions } from './permissions/lsm';
import { LCM_Permissions } from './permissions/lcm';
import { Other_Permissions } from './permissions/other';
import { Storage_Permissions } from './permissions/storage';
import { CVB_Permissions } from './permissions/cvb';
import { VSM_Permissions } from './permissions/vsm';
import { SLM_Permissions } from './permissions/slm';
import { CBM_Permissions } from './permissions/cbm';
import { SW_Permissions } from './permissions/sw';
import { MSG_Permissions } from './permissions/msg';
import { IAM_Permissions } from './permissions/iam';
import { PLM_Permissions } from './permissions/plm';
import { ERM_Permissions } from './permissions/erm';
//
export const Permissions: Permission[] = [
  ...Default_Permissions,
  ...Other_Permissions,
  ...Voice_Permissions,
  ...OFM_Permissions,
  ...BPO_Permissions,
  ...LCM_Permissions,
  ...CSM_Permissions,
  ...BSM_Permissions,
  ...LSM_Permissions,
  ...LXM_Permissions,
  ...Storage_Permissions,
  ...CVB_Permissions,
  ...VSM_Permissions,
  ...SLM_Permissions,
  ...CBM_Permissions,
  ...SW_Permissions,
  ...MSG_Permissions,
  ...IAM_Permissions,
  ...PLM_Permissions,
  ...ERM_Permissions,
];
