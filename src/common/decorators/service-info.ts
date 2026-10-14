import { SetMetadata } from '@nestjs/common';
import { Resources } from '../enums/resources';
import { Services } from '../enums/services';

//
export const SERVICE_KEY = 'service';
export const RESOURCE_KEY = 'resource';
// eslint-disable-next-line prettier/prettier
export const ServiceInfo = (name: Services) => SetMetadata(SERVICE_KEY, name);
export const ControllerInfo = (name: Resources) =>
  SetMetadata(RESOURCE_KEY, name);
