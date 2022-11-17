import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActiveClientsByFlows } from '../model/ActiveClientsByFlows.interface';
import { ActiveTrack } from '../model/ActiveTrack';
import { AggregatedSessionByBrowser } from '../model/aggregatedSessionByBrowser';
import { AggregatedSessionByLocation } from '../model/aggregatedSessionByLocation';
import { AggregatedSessionByOS } from '../model/aggregatedSessionByOS';
import { AggregatedTrackByFlowId } from '../model/aggregatedTrackByFlowId';
import { MetricsService } from './metrics.service';


@ApiTags('api/v1/metrics')
@Controller('api/v1/metrics')
export class MetricsController {

    constructor(private readonly metricsService: MetricsService) {
        
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get("activeClients")
    @ApiResponse({
        type: [ActiveTrack]
    })
    public getActiveClients() {
        return this.metricsService.getActiveTracks();
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get("activeClientsByFlows")
    @ApiResponse({
        type: [ActiveClientsByFlows]
    })
    public getActiveClientsByFlows() {
        return this.metricsService.getActiveClientsByFlows();
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiQuery({
        name: 'startDate',
        required: false,
        description: 'Query Start Date <br><strong>Format:</strong> YYYY-MM-DD <br><strong>Defaults to empty</strong>',
        example: new Date()

    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        description: 'Query End Date <br><strong>Format:</strong> YYYY-MM-DD <br><strong>Defaults to empty</strong>',
        example: new Date()
    })
    @Get("getAggregatedSessionsByLocation")
    @ApiResponse({
        type: [AggregatedSessionByLocation]
    })
    public getAggregatedSessionsByLocation(@Query("startDate") startDate: Date, @Query("endDate") endDate: Date) {
        return this.metricsService.getAggregatedSessionsByLocation(startDate, endDate)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiQuery({
        name: 'startDate',
        required: false,
        description: 'Query Start Date <br><strong>Format:</strong> YYYY-MM-DD <br><strong>Defaults to empty</strong>',
        example: new Date()

    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        description: 'Query End Date <br><strong>Format:</strong> YYYY-MM-DD <br><strong>Defaults to empty</strong>',
        example: new Date()
    })
    @Get("getAggregatedSessionsByBrowser")
    @ApiResponse({
        type: [AggregatedSessionByBrowser]
    })
    public getAggregatedSessionsByBrowser(@Query("startDate") startDate: Date, @Query("endDate") endDate: Date) {
        return this.metricsService.getAggregatedSessionsByBrowser(startDate, endDate)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiQuery({
        name: 'startDate',
        required: false,
        description: 'Query Start Date <br><strong>Format:</strong> YYYY-MM-DD <br><strong>Defaults to empty</strong>',
        example: new Date()

    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        description: 'Query End Date <br><strong>Format:</strong> YYYY-MM-DD <br><strong>Defaults to empty</strong>',
        example: new Date()
    })
    @Get("getAggregatedSessionsByOS")
    @ApiResponse({
        type: [AggregatedSessionByOS]
    })
    public getAggregatedSessionsByOS(@Query("startDate") startDate: Date, @Query("endDate") endDate: Date) {
        return this.metricsService.getAggregatedSessionsByOS(startDate, endDate)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiQuery({
        name: 'startDate',
        required: false,
        description: 'Query Start Date <br><strong>Format:</strong> YYYY-MM-DD <br><strong>Defaults to empty</strong>',
        example: new Date()

    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        description: 'Query End Date <br><strong>Format:</strong> YYYY-MM-DD <br><strong>Defaults to empty</strong>',
        example: new Date()
    })
    @Get("getAggregatedTracksByFlowId")
    @ApiResponse({
        type: [AggregatedTrackByFlowId]
    })
    public getAggregatedTracksByFlowId(@Query("startDate") startDate: Date, @Query("endDate") endDate: Date) {
        return this.metricsService.getAggregatedTracksByFlowId(startDate, endDate)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiQuery({
        name: 'startDate',
        required: false,
        description: 'Query Start Date <br><strong>Format:</strong> YYYY-MM-DD <br><strong>Defaults to empty</strong>',
        example: new Date()

    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        description: 'Query End Date <br><strong>Format:</strong> YYYY-MM-DD <br><strong>Defaults to empty</strong>',
        example: new Date()
    })
    @Get("getNormalizedMetricsFlowByHour")
    public getNormalizedMetricsFlowByHour(@Query("startDate") startDate: Date, @Query("endDate") endDate: Date) {
        return this.metricsService.getNormalizedMetricsFlowByHour(startDate, endDate);
    }

}
