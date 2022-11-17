import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config/config.module';
import { ConfigService } from 'src/config/config/config.service';
import { ArangoModule } from '../persistence/arango/arango.module';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ArangoModule.collection('properties'),
    ConfigModule
  ],
  providers: [
    PropertiesService
  ],
  exports: [
    PropertiesService
  ],
  controllers: [PropertiesController]
})
export class PropertiesModule { 
  private readonly logger: Logger = new Logger(PropertiesModule.name);
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly configService: ConfigService
  ) {

    if(this.configService.get('ENABLE_CUSTOM_PROPERTIES') == 'true') {
      this.logger.warn('custom properties are enabled by default. If they are causing issues, try to disable them by adding "ENABLE_CUSTOM_PROPERTIES=false" on the environment file.');
      this.propertiesService.initCustomProperties();
    } else {
      this.logger.warn('custom properties are disabled. To enable add "ENABLE_CUSTOM_PROPERTIES=true" on the environment file.')
    }
  }
}
