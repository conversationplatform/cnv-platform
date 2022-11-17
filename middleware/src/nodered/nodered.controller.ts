import { Controller, Get, Header, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NoderedService } from './nodered.service';

@ApiTags('api/v1/nodered')
@Controller('api/v1/nodered')
export class NoderedController {
  constructor(private readonly noderedService: NoderedService) { }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    type: [String],
  })
  @Get('flows')
  get(): Promise<string[]> {
    return this.noderedService.getCurrentFlows();
  }

  @Get('theme/:flowId')
  getTheme(@Param('flowId') flowId: string): Promise<string[]> | null {
    return this.noderedService.getThemeByFlowId(flowId);
  }

  @Get('privacypolicy/:flowId')
  getPrivacyPolicy(@Param('flowId') flowId: string): Promise<string[]> | null {
    return this.noderedService.getPrivacyPolicyByFlowId(flowId);
  }

  @Get('widgetProviders')
  getWidgetProviders() {
    return this.noderedService.getWidgetProviders()
  }

  @Get('widgetProvider')
  @ApiQuery({
    name: 'widget',
    required: true,
    description: 'Plugin name',
  })
  @Header('content-type', 'text/javascript')
  getWidgetProvider(@Query('widget') widget): Promise<object> {
    return this.noderedService.getWidgetProvider(widget);
  }
}
