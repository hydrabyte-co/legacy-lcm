import { BPOResources } from './resources/bpo';
import { CommonResources } from './resources/common';
import { LCMResources } from './resources/lcm';
import { LSMResources } from './resources/lsm';
import { LXMResources } from './resources/lxm';
import { OFMResources } from './resources/ofm';
import { SLMResources } from './resources/slm';
import { StorageResources } from './resources/storage';
import { TemplateResources } from './resources/template';
import { UIMResources } from './resources/uim';
import { VSMResources } from './resources/vsm';
import { CBMResources } from './resources/cbm';
import { SWResources } from './resources/sw';
import { MSGResources } from './resources/msg';
import { VCMResources } from './resources/vcm';
import { IAMResources } from './resources/iam';
import { ERMResources } from './resources/erm';
import { PLMResources } from './resources/plm';

export const Resources = {
  ...CommonResources,
  ...TemplateResources,
  ...UIMResources,
  ...LCMResources,
  ...LSMResources,
  ...StorageResources,
  ...OFMResources,
  ...BPOResources,
  ...VSMResources,
  ...LXMResources,
  ...SLMResources,
  ...CBMResources,
  ...SWResources,
  ...MSGResources,
  ...VCMResources,
  ...IAMResources,
  ...ERMResources,
  ...PLMResources,
};
export type Resources =
  | CommonResources
  | TemplateResources
  | UIMResources
  | LCMResources
  | LXMResources
  | LSMResources
  | OFMResources
  | BPOResources
  | StorageResources
  | VSMResources
  | SLMResources
  | CBMResources
  | SWResources
  | MSGResources
  | VCMResources
  | IAMResources
  | ERMResources
  | PLMResources;
