import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { jwtConstants } from './constants';
import { ConfigService } from '../config/config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger: Logger = new Logger(JwtStrategy.name);
  private adminuser: any;

  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });

    this.adminuser = this.configService.get('ADMIN_USER');

    if(process.env.NODE_ENV == 'DEVELOPMENT') {
      this.logger.warn('Server is in development mode. A jwt secret will be static accross server reboots')
    }

  }

  async validate(payload: any) {
    if(payload.username === this.adminuser ) {
      return { userId: payload.sub, username: payload.username };
    }
    return false;
  }
}