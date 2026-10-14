import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(
  Strategy,
  'basic-auth',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      passReqToCallback: true,
    });
  }

  public validate = async (
    req: Request,
    appId: string,
    appSecret: string,
  ): Promise<any> => {
    // Check for SIM Edge App credentials
    const simedgeUser = process.env.SIMEDGE_APP_USER || 'simedge_app';
    const simedgePass = process.env.SIMEDGE_APP_PASS || 'SE@2025!SecurePass';

    if (appId === simedgeUser && appSecret === simedgePass) {
      return {
        userId: 'simedge_app',
        appId,
        orgId: '',
        roles: ['simedge.client'],
      };
    }

    // Check for default APP credentials
    if (process.env.APP_ID === appId && process.env.APP_SECRET === appSecret) {
      const result: {
        userId: string;
        appId: string;
        orgId: string;
        roles: string[];
      } = {
        userId: '',
        appId,
        orgId: '',
        roles: [],
      };
      const orgId = req.headers['x-hydrabyte-orgid'] as string;
      if (orgId) {
        result.orgId = orgId;
      }
      const role = req.headers['x-hydrabyte-role'] as string;
      if (role && role.toString().indexOf('uni') !== 0) {
        result.roles.push(role);
      } else if (process.env.APP_ROLE) {
        result.roles.push(process.env.APP_ROLE);
      }
      return result;
    }
    throw new UnauthorizedException();
  };
}
