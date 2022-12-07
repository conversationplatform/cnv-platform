import { DynamicModule, Logger, Module, OnModuleInit } from '@nestjs/common';
import { NoderedService } from './nodered.service';
import { NoderedController } from './nodered.controller';
import { NodeRedAsyncOptions } from './nodered.settings.interface';
import { NODEREDOPTIONS } from './nodered.constants';
import { HttpModule } from '@nestjs/axios';



@Module({
  imports: [HttpModule],
  providers: [NoderedService],
})
export class NoderedModule implements OnModuleInit {
  private logger: Logger = new Logger(NoderedModule.name);

  static forRootAsync(asyncOptions: NodeRedAsyncOptions): DynamicModule {
    return {
      module: NoderedModule,
      imports: asyncOptions.imports,
      providers: [
        {
          provide: NODEREDOPTIONS,
          useFactory: async (...args) => {
            let nodeRedOptions = await asyncOptions.useFactory(...args);
            return nodeRedOptions;
          },
          inject: asyncOptions.inject || [],
        },
        NoderedService
      ],
      controllers: [NoderedController],
      exports: [NoderedService, NODEREDOPTIONS]

    };
  }

  constructor( 
    private readonly nodeRedService: NoderedService
  ) {}

  onModuleInit() {
    this.nodeRedService.enable();
  }
}
