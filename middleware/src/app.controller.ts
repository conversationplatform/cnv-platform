import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from './config/config/config.service';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getHello(@Res() res): string {
    return res.redirect(this.configService.get('root-redirect') || '/api');
  }

}
