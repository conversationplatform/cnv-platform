import { INestApplication, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config/config.module';
import { NoderedService } from './nodered.service';
import { NoderedController } from './nodered.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from 'src/config/config/config.service';

const DELAY_BUNDLED_NODERED_BOOTSTRAP = 2000;

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    HttpModule
  ],
  providers: [NoderedService],
  controllers: [NoderedController]
})
export class NoderedModule {

  constructor(
    private readonly noderedService: NoderedService,
    private readonly configService: ConfigService
    ) { }

  public init(app: INestApplication) {   
    if (this.configService.get('USE_BUNDLED_NODERED') == 'true') {
      setTimeout(() => {
        this.noderedService.init(app);
      }, DELAY_BUNDLED_NODERED_BOOTSTRAP);
    }
  }
}
