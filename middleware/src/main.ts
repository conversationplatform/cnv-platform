import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from './config/config/config.service';
import { NoderedModule } from './nodered/nodered.module';
import { Logger } from '@nestjs/common';



async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const noderedModule = app.get<NoderedModule>(NoderedModule);
  const logger = new Logger('bootstrap');
  noderedModule.init(app);

  logger.log('enabling swagger');
  const config = new DocumentBuilder()
    .setTitle('Conversation midleware')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  logger.log('enabling cookieParser');
  app.use(cookieParser());

  let cors = (configService.get('cors') || '').split(',');

  configService.events.subscribe(() => {
    cors = (configService.get('cors') || '').split(',');
  })
  if (cors) {
    logger.log(`enabling cors for ${cors}`);

    app.enableCors({
      origin: (origin, callback) => {
        if(!origin || cors.indexOf(origin) != -1) {
          callback(null, true);
        } else {
          logger.warn(`cors not processed for: ${origin}. If its an issue, don't forget to add this entry on the configuration file.`);
          callback(null, false);
        }
        
      },
      methods: ['GET', 'PUT', 'POST', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Accept'],
      credentials: true,
    })


  }

  await app.listen(3000);

}
bootstrap();
