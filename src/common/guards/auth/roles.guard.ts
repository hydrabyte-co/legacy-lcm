import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RESOURCE_KEY, SERVICE_KEY } from 'src/common/decorators/service-info';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { Actions } from 'src/common/enums/actions';
import { Resources } from 'src/common/enums/resources';
import { Services } from 'src/common/enums/services';
import { Permissions } from '../../enums/permissions';
import { logData, logInfo } from 'src/common/utils/log-helper';
import { Permission } from 'src/common/types/data';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const service = this.reflector.getAllAndOverride<Services>(SERVICE_KEY, [
      context.getClass(),
    ]);
    const resource = this.reflector.getAllAndOverride<Resources>(RESOURCE_KEY, [
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const auth: DataHandler = request.user;
    const method = context.getHandler().name;
    auth.accessToken = request.headers.authorization || '';
    logInfo(`*`, `RolesGuads -> auth`, {
      userId: auth.userId,
      appId: auth.appId,
      orgId: auth.orgId,
      role: auth.role,
      roles: auth.roles,
    });
    logInfo(`*`, `RolesGuads -> service`, service);
    logInfo(`*`, `RolesGuads -> resource`, resource);
    logInfo(`*`, `RolesGuads -> action`, method);
    let permission = Permissions.find((p: Permission) => {
      return (
        p.service === service &&
        p.resource === resource &&
        p.action === method &&
        auth.roles.indexOf(p.role) >= 0
      );
    });
    if (permission === undefined) {
      permission = Permissions.find((p: Permission) => {
        return (
          p.service === service &&
          p.resource === resource &&
          p.action === Actions.Any &&
          auth.roles.indexOf(p.role) >= 0
        );
      });
      if (permission === undefined) {
        permission = Permissions.find((p: Permission) => {
          return (
            p.service === service &&
            p.resource === Resources.Any &&
            p.action === Actions.Any &&
            auth.roles.indexOf(p.role) >= 0
          );
        });
        if (permission === undefined) {
          permission = Permissions.find((p: Permission) => {
            return (
              p.service === Services.Any &&
              p.resource === Resources.Any &&
              p.action === Actions.Any &&
              auth.roles.indexOf(p.role) >= 0
            );
          });
        }
      }
    }
    if (permission) {
      auth.request = permission.request;
      auth.response = permission.response;
      auth.permission = permission;
    }
    logInfo(`*`, `RolesGuads -> permission`, permission);
    // console.log('BEAN', permission);
    return permission !== undefined;
  }
}
