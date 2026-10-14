import { BasicObject, MixedObject } from './data';

export type MessageQueuePayload = {
  org?: {
    id: string;
  } & BasicObject;
  user?: {
    id: string;
  } & BasicObject;
  [key: string]: MixedObject;
};

export type VCMMessageQueuePayload = {
  task?: {
    id: string;
  } & MixedObject;
  scene?: {
    id: string;
  } & MixedObject;
  project?: {
    id: string;
  } & MixedObject;
} & MessageQueuePayload;
