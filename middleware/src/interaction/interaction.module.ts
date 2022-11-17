import { Module } from '@nestjs/common';
import { ArangoModule } from '../persistence/arango/arango.module';
import { InteractionService } from './interaction.service';
import { InteractionController } from './interaction.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ArangoModule.collection('interaction'),
    AuthModule
  ],
  providers: [InteractionService],
  exports: [InteractionService],
  controllers: [InteractionController]
})
export class InteractionModule { }
