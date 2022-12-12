import { forwardRef, Module } from '@nestjs/common';
import { ArangoModule } from '../persistence/arango/arango.module';
import { InteractionService } from './interaction.service';
import { InteractionController } from './interaction.controller';
import { AuthModule } from '../auth/auth.module';
import { TrackModule } from 'src/track/track.module';

@Module({
  imports: [
    ArangoModule.collection('interaction'),
    AuthModule,
    forwardRef(() => TrackModule)
  ],
  providers: [InteractionService],
  exports: [InteractionService],
  controllers: [InteractionController]
})
export class InteractionModule { }
