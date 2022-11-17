import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from './config/config/config.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly configService: ConfigService) {}

  @Get()
  getHello(@Res() res): string {
    return res.redirect(this.configService.get('root-redirect') || '/api');
  }

}
