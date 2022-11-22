import { Controller, Get, Header, Param, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from 'src/config/config/config.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NoderedService } from './nodered.service';

@ApiTags('api/v1/nodered')
@Controller('api/v1/nodered')
export class NoderedController {
  constructor(
    private readonly noderedService: NoderedService,
    private readonly configService: ConfigService) {

  }

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

  @Get('widgetProvider/*')
  @ApiQuery({
    name: 'widget',
    required: true,
    description: 'Plugin name',
  })
  async getWidgetProvider(@Res() response: Response, @Query('widget') widget) {

    const cache = this.configService.get('DEFAULT_PLUGINS_CACHE');
    if (cache) {
      response.set('Cache-control', `private, max-age=${this.configService.get('DEFAULT_PLUGINS_CACHE')}`)
    }
    response.set('Content-type', 'text/javascript')
    const data = await this.noderedService.getWidgetProvider(widget).catch(e => {
      response.status(404).send('not found')
    })
    if (data) {
      response.send(data);
    }
  }
}
