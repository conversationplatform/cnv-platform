import { Controller, Get, Logger, Query, Req, Res, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { Request, Response } from 'express';
import { UserSession } from '../model/usersession';
import { TrackService } from '../track/track.service';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConfigService } from '../config/config/config.service';
import { ActivateFlowResponse } from '../model/activateflowresponse';

@ApiTags('api/v1/session')
@Controller('api/v1/session')
export class SessionController {
    private readonly logger = new Logger(SessionController.name);

  
    constructor(
        private readonly configService: ConfigService,
        private readonly sessionService: SessionService,
        private readonly trackService: TrackService) {
    }

    @ApiQuery({
        name: 'flowId',
        required: true,
        description: 'nodered server name flowid <strong>Eg: /default</strong>'
    })
    @ApiResponse({
        type: ActivateFlowResponse
    })
    @Get("activate")
    public async getUserSession(@Req() req: Request, @Query('flowId') flowId: string, @Res({ passthrough: true }) response: Response): Promise<ActivateFlowResponse> {
        const userAgent = req.headers['user-agent'];
        const userIp = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress;
        const session_cookie_name = this.configService.get('SESSION_COOKIE_NAME');
        let userSession: UserSession;
        let sid = req.cookies[session_cookie_name];
        if(sid) {
            userSession = await this.sessionService.getSession(sid);
        }
        if (!sid || !userSession) {
            userSession = await this.sessionService.createSession(userAgent, userIp);
            let expireDate = new Date;
            const expirationTime = +this.configService.get('TRACK_LIFETIME_MONTHS');
            expireDate.setMonth(expireDate.getMonth() + expirationTime);
            response.cookie(session_cookie_name, userSession.sid, {
                expires: expireDate,
                httpOnly: true,
                sameSite: 'none',
                secure: true
            });
        }

        const clientTrack = await this.trackService.createTrack(userSession, flowId);

        return { tid: clientTrack.tid };

    }

    
    @Get("deactivate")
    public async deactivateUserSession(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
        const session_cookie_name = this.configService.get('SESSION_COOKIE_NAME');

        let sid = req.cookies[session_cookie_name];

        if (sid) {
            response.clearCookie(session_cookie_name, {
                httpOnly: true
            });
            return { message: `${sid} cleared` };
        }

        return { message: `sid not found` };

    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get("sessions")
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Current page of the results. <strong>Defaults to 0</strong>'
    })
    @ApiQuery({
        name: 'take',
        required: false,
        description: 'Number of items to return per page. <strong>Defaults to 20</strong>'
    })
    @ApiResponse({
        type: [UserSession]
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
    public async getSessions(
        @Query("sortBy") sortBy: string, @Query("sortByType") sortByType: string, @Query("page") page: number = 0, @Query("take") take: number = 20): Promise<UserSession[]> {
        return this.sessionService.getSessions(page, take, sortBy, sortByType);

    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get("session")
    @ApiQuery({
        name: 'sessionId',
        required: false,
        description: 'Get session by sessionId'
    })
    @ApiResponse({
        type: UserSession
    })
    public async getSession(@Query("sessionId") sessionId: string): Promise<UserSession> {
        return this.sessionService.getSession(sessionId);

    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Number of sessions'
    })
    @Get("count")
    public async countSessions() {
        return this.sessionService.countSessions();

    }

}
