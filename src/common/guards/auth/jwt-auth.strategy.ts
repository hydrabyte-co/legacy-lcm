import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JWTAuthStrategy extends PassportStrategy(Strategy, 'jwt-auth') {
  constructor(private readonly configService: ConfigService) {
    const jwtSecret = '' || process.env.JWT_SECRET;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.user.id,
      appId: '',
      orgId: '',
      roles: payload.roles,
    };
  }
}
