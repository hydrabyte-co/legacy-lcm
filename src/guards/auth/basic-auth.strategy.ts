import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

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

  public validate = async (req, appId, appSecret): Promise<any> => {
    if (process.env.APP_ID === appId && process.env.APP_SECRET === appSecret) {
      return {
        userId: '',
        appId,
        orgId: '',
        roles: [],
      };
    }
    throw new UnauthorizedException();
  };
}
