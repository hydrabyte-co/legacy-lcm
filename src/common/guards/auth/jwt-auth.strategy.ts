import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JWTAuthStrategy extends PassportStrategy(Strategy, 'jwt-auth') {
  constructor(private readonly configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET') || process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is required but not configured');
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    let defaultRole = '';
    let defaultScope = '';
    if (Array.isArray(payload?.roles)) {
      if (payload.roles.length > 0) {
        defaultRole = payload.roles[0];
      }
    }
    if (defaultRole.indexOf('uni.') === 0) {
      defaultScope = 'universe';
    } else if (defaultRole.indexOf('org.') === 0) {
      defaultScope = 'organization';
    }
    return {
      userId: payload.user.id,
      appId: '',
      orgId: payload.user.orgId,
      role: defaultRole,
      roles: payload.roles,
      scope: defaultScope,
      staffCode: payload.user.staffCode,
      attributes: payload.user?.attributes || {},
    };
  }
}
