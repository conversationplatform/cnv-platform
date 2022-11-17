import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClientTrack } from '../model/client.track';
import { TrackService } from './track.service';
@ApiTags('api/v1/client')
@Controller('api/v1/client')
export class TrackController {

    constructor(private readonly trackService: TrackService) {

    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get("tracks")
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Current page of the results. <br><strong>Defaults to 0</strong>'
    })
    @ApiQuery({
        name: 'take',
        required: false,
        description: 'Number of items to return per page. <br><strong>Defaults to 20</strong>'
    })
    @ApiQuery({
        name: 'sid',
        required: false,
        description: 'User Session Id <br><strong>Defaults to empty</strong>'
    })
    @ApiQuery({
        name: 'flowId',
        required: false,
        description: 'Flow Id <br><strong>Defaults to empty</strong>',
        example: '/m4_v2'
    })
    @ApiQuery({
        name: 'sortBy',
        required: false,
        description: 'Sort by field name',
    })
    @ApiQuery({
        name: 'sortByType',
        required: false,
        description: 'Sort by field direction. ASC | DESC',
    })
    @ApiQuery({
        name: 'interaction',
        required: false,
        description: 'Filter by number of interactions. must be used with interactionOperator <br><strong>Defaults to empty</strong>'
    })
    @ApiQuery({
        name: 'interactionOperator',
        required: false,
        description: 'Filter interactions by operator. must be used with interaction. <br><strong>Defaults to empty</strong>',
        enum: ['===', '!=', '<', '>', '=>', '<=']
    })
    @ApiQuery({
        name: 'store',
        required: false,
        description: 'Filter by number of stores. must be used with storeOperator <br><strong>Defaults to empty</strong>'
    })
    @ApiQuery({
        name: 'storeOperator',
        required: false,
        description: 'Filter stores by operator. must be used with store. <br><strong>Defaults to empty</strong>',
        enum: ['===', '!=', '<', '>', '=>', '<=']

    })
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
    @ApiResponse({
        type: [ClientTrack]
    })

    public async getClientTracks(
        @Query("sid") sid: string, @Query("flowId") flowId: string,
        @Query("sortBy") sortBy: string, @Query("sortByType") sortByType: string,
        @Query("interaction") interaction: number, @Query("interactionOperator") interactionOperator: string,
        @Query("store") store: number, @Query("storeOperator") storeOperator: string,
        @Query("startDate") startDate: Date, @Query("endDate") endDate: Date, @Query("page") page: number = 0, @Query("take") take: number = 20): Promise<ClientTrack[]> {

        return this.trackService.getClientTracks(
            page, take, sid, flowId,
            sortBy, sortByType,
            interaction, interactionOperator,
            store, storeOperator,
            startDate, endDate);

    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get("track")
    @ApiQuery({
        name: 'sid',
        required: false,
        description: '<strong>Optional:</strong> user session id. in cognito mode this value are not used since its generated on each refresh'
    })
    @ApiQuery({
        name: 'tid',
        required: true,
        description: '<strong>Required:</strong> the flow track id that holds the user <-> server interactions'
    })
    @ApiResponse({
        type: [ClientTrack]

    })
    public async getClientTrack(@Query("sid") sid: string, @Query("tid") tid: string): Promise<ClientTrack> {
        return this.trackService.getTrack(sid, tid);

    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Number of sessions'
    })
    @ApiQuery({
        name: 'sid',
        required: false,
        description: 'User Session Id <br><strong>Defaults to empty</strong>'
    })
    @ApiQuery({
        name: 'flowId',
        required: false,
        description: 'Flow Id <br><strong>Defaults to empty</strong>',
        example: '/m4_v2'
    })
    @ApiQuery({
        name: 'interaction',
        required: false,
        description: 'Filter by number of interaction. must be used with interactionOperator <br><strong>Defaults to empty</strong>'
    })
    @ApiQuery({
        name: 'interactionOperator',
        required: false,
        description: 'Filter interaction by operator. must be used with interaction. <br><strong>Defaults to empty</strong>',
        enum: ['===', '!=', '<', '>', '=>', '<=']

    })
    @ApiQuery({
        name: 'store',
        required: false,
        description: 'Filter by number of store. must be used with storeOperator <br><strong>Defaults to empty</strong>'
    })
    @ApiQuery({
        name: 'storeOperator',
        required: false,
        description: 'Filter store by operator. must be used with store. <br><strong>Defaults to empty</strong>',
        enum: ['===', '!=', '<', '>', '=>', '<=']

    })
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
    @Get("count")
    public async countSessions(
        @Query("sid") sid: string, @Query("flowId") flowId: string,
        @Query("interaction") interaction: number, @Query("interactionOperator") interactionOperator: string,
        @Query("store") store: number, @Query("storeOperator") storeOperator: string,
        @Query("startDate") startDate: Date, @Query("endDate") endDate: Date) {

        return this.trackService.countClientTracks(
            sid, flowId,
            interaction, interactionOperator,
            store, storeOperator,
            startDate, endDate);

    }
}
