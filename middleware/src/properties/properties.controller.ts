import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CustomProperties } from 'src/model/custom.properties';
import { PropertiesService } from './properties.service';

@ApiTags('api/v1/properties')
@Controller('api/v1/properties')
export class PropertiesController {

    constructor(
        private readonly propertiesService: PropertiesService
    ) {}
    
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('customProperties')
    @ApiResponse({
        type: CustomProperties
    })
    getCustomProperties(): Promise<CustomProperties> {
        return this.propertiesService.getCustomProperties();
    }

    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    @Put('customProperties')
    @ApiResponse({
        type: CustomProperties
    })
    updateCustomProperties(@Body() customProperties: CustomProperties): Promise<CustomProperties> {
        return this.propertiesService.updateCustomProperties(customProperties);
        return null
    }
}
