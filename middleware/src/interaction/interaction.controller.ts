import { Controller, Get, Query, Response, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Interaction } from '../model/client.interaction';
import { InteractionService } from './interaction.service';

@ApiTags('api/v1/interaction')
@Controller('api/v1/interaction')
export class InteractionController {

    constructor(private readonly interactionService: InteractionService) {

    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get("interactions")
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Current page of the results. <br><strong>Defaults to 0</strong>'
    })
    @ApiQuery({
        name: 'take',
        required: false,
        description: 'Number of items to return per page. <br><strong>Defaults to 5</strong>'
    })
    @ApiQuery({
        name: 'tid',
        required: false,
        description: 'Track Id <br><strong>Defaults to empty</strong>',
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
    @ApiQuery({
        name: 'origin',
        required: false,
        description: 'Origin <br><strong>Defaults to empty</strong>',
        example: 'server'
    })
    @ApiQuery({
        name: 'nodeId',
        required: false,
        description: 'Node Id <br><strong>Defaults to empty</strong>',
        example: 'id'
    })
    @ApiQuery({
        name: 'type',
        required: false,
        description: 'Node Id <br><strong>Defaults to empty</strong>',
        example: 'answer'
    })
    @ApiQuery({
        name: 'name',
        required: false,
        description: 'Name <br><strong>Defaults to empty</strong>',
        example: 'variable'
    })
    @ApiQuery({
        name: 'value',
        required: false,
        description: 'Value <br><strong>Defaults to empty</strong>',
        example: '12'
    })
    getInteractions(
        @Query("tid") tid: string | string[], @Query("flowId") flowId: string | string[],
        @Query("sortBy") sortBy: string, @Query("sortByType") sortByType: string,
        @Query("startDate") startDate: Date, @Query("endDate") endDate: Date, @Query("origin") origin: string, 
        @Query("nodeId") nodeId: string | string[], @Query("type") type: string | string[], 
        @Query("name") name: string | string[], @Query("value") value: string,
        @Query("page") page: number = 0, @Query("take") take: number = 20): Promise<Interaction[]> {
        return this.interactionService.getInteractions(page, take, flowId, tid, sortBy, sortByType, startDate, endDate, origin, nodeId, type, name, value);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get("count")
    @ApiQuery({
        name: 'tid',
        required: false,
        description: 'Track Id <br><strong>Defaults to empty</strong>',
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
    @ApiQuery({
        name: 'origin',
        required: false,
        description: 'Origin <br><strong>Defaults to empty</strong>',
        example: '/m4_v2'
    })
    @ApiQuery({
        name: 'nodeId',
        required: false,
        description: 'Node Id <br><strong>Defaults to empty</strong>',
        example: '/m4_v2'
    })
    @ApiQuery({
        name: 'type',
        required: false,
        description: 'Node Id <br><strong>Defaults to empty</strong>',
        example: '/m4_v2'
    })
    @ApiQuery({
        name: 'name',
        required: false,
        description: 'Name <br><strong>Defaults to empty</strong>',
        example: '/m4_v2'
    })
    @ApiQuery({
        name: 'value',
        required: false,
        description: 'Value <br><strong>Defaults to empty</strong>',
        example: '/m4_v2'
    })
    countInteractions(
        @Query("tid") tid: string | string[], @Query("flowId") flowId: string | string[],
        @Query("sortBy") sortBy: string, @Query("sortByType") sortByType: string,
        @Query("startDate") startDate: Date, @Query("endDate") endDate: Date, @Query("origin") origin: string,
        @Query("nodeId") nodeId: string | string[], @Query("type") type: string | string[], @Query("name") name: string | string[], @Query("value") value: string): Promise<number> {
        return this.interactionService.countInteractions(flowId, tid, sortBy, sortByType, startDate, endDate, origin, nodeId, type, name, value);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get("interactionsCSV")
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Current page of the results. <br><strong>Defaults to 0</strong>'
    })
    @ApiQuery({
        name: 'take',
        required: false,
        description: 'Number of items to return per page. <br><strong>Defaults to 5</strong>'
    })
    @ApiQuery({
        name: 'tid',
        required: false,
        description: 'Track Id <br><strong>Defaults to empty</strong>',
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
    @ApiQuery({
        name: 'origin',
        required: false,
        description: 'Origin <br><strong>Defaults to empty</strong>',
        example: 'server'
    })
    @ApiQuery({
        name: 'nodeId',
        required: false,
        description: 'Node Id <br><strong>Defaults to empty</strong>',
        example: 'id'
    })
    @ApiQuery({
        name: 'type',
        required: false,
        description: 'Node Id <br><strong>Defaults to empty</strong>',
        example: 'answer'
    })
    @ApiQuery({
        name: 'name',
        required: false,
        description: 'Name <br><strong>Defaults to empty</strong>',
        example: 'variable'
    })
    @ApiQuery({
        name: 'value',
        required: false,
        description: 'Value <br><strong>Defaults to empty</strong>',
        example: '12'
    })
    
    async getInteractionsCSV(
        
        @Query("tid") tid: string | string[], @Query("flowId") flowId: string | string[],
        @Query("sortBy") sortBy: string, @Query("sortByType") sortByType: string,
        @Query("startDate") startDate: Date, @Query("endDate") endDate: Date, @Query("origin") origin: string, 
        @Query("nodeId") nodeId: string | string[], @Query("type") type: string | string[], 
        @Query("name") name: string | string[], @Query("value") value: string,
        @Query("page") page: number = 0, @Query("take") take: number = 20, @Response() res) {
        res.set({
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="export-${new Date().toISOString()}.csv"`,
          });
        res.charset = 'UTF-8';
        res.write(await this.interactionService.getInteractionCSV(page, take, flowId, tid, sortBy, sortByType, startDate, endDate, origin, nodeId, type, name, value));
        res.end();
    }

    @ApiQuery({
        name: 'propertyName',
        required: true,
        
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get("getPropertyValues")
    async getPropertyValues(@Query("propertyName") propertyName: string) {
        return this.interactionService.getPropertyValues(propertyName);
    }
}
