import { Injectable, Logger } from '@nestjs/common';
import { SessionService } from '../session/session.service';
import { UAParser } from 'ua-parser-js';
import { lookup } from 'geoip-lite';
import { TrackService } from '../track/track.service';

@Injectable()
export class MigrationService {
    private readonly logger: Logger = new Logger(MigrationService.name);

    constructor(
        private readonly sessionService: SessionService,
        private readonly trackService: TrackService
    ) {
        
    }

    async runMigrations(): Promise<any> {

        await this.sessionUserAgentMigrations();
        await this.sessionUserLocationMigrations();
        await this.sessionUserIPMigrations();
        await this.deleteInvalidTracks();
        await this.migrateInteractions();

    }

    async sessionUserAgentMigrations(): Promise<any> {

        const batchSize = 10;
        let nsessions = await this.sessionService.countessionsWithNoParsedUserAgent();

        if (nsessions == 0) {
            this.logger.log(`Session user agent migrations not required`);
        } else {
            this.logger.log(`Preparing to migrate user agent on ${nsessions} sessions`);
        }

        while (nsessions - batchSize > 0) {
            await this.updateSessionWithDetailedUserAgent(0, batchSize)
            nsessions -= batchSize;
        }
        if (nsessions > 0) {
            await this.updateSessionWithDetailedUserAgent(0, batchSize)
        }

    }
    async sessionUserLocationMigrations() {
        const batchSize = 10;
        let nsessions = await this.sessionService.countessionsWithNoParsedUserLocation();

        if (nsessions == 0) {
            this.logger.log(`Session user location migrations not required`);
        } else {
            this.logger.log(`Preparing to migrate user IP on ${nsessions} sessions`);
        }

        while (nsessions - batchSize > 0) {
            await this.updateSessionWithDetailedUserLocation(0, batchSize)
            nsessions -= batchSize;
        }
        if (nsessions > 0) {
            await this.updateSessionWithDetailedUserLocation(0, batchSize)
        }
    }

    async sessionUserIPMigrations() {
        const batchSize = 10;
        let nsessions = await this.sessionService.countessionsWithParsedUserLocationAndIP();

        if (nsessions == 0) {
            this.logger.log(`Session user ip migrations not required`);
        } else {
            this.logger.log(`Preparing to migrate user locations on ${nsessions} sessions`);
        }

        while (nsessions - batchSize > 0) {
            await this.updateSessionsWithParsedUserLocationAndIP(0, batchSize)
            nsessions -= batchSize;
        }
        if (nsessions > 0) {
            await this.updateSessionsWithParsedUserLocationAndIP(0, batchSize)
        }
    }


    private async updateSessionWithDetailedUserAgent(page: number, take: number) {
        const sessions = await this.sessionService.getSessionsWithNoParsedUserAgent(page, take);
        sessions.forEach(async (session) => {
            if (session.userAgent) {
                try {
                    const parsedUA = UAParser(session.userAgent);
                    session.browser = parsedUA?.browser;
                    session.cpu = parsedUA.cpu;
                    session.operatingSystem = parsedUA.os;

                } catch (e) {
                    this.logger.error(e);
                }

                this.logger.log(` * updating ${session.sid} with detailed useragent`);
                await this.sessionService.updateSession(session);
            } else {
                this.logger.error(`Session ${session.sid} is missing a valid user agent`);
            }

        })
    }

    private async updateSessionWithDetailedUserLocation(page: number, take: number) {
        const sessions = await this.sessionService.getSessionsWithNoParsedUserLocation(page, take);
        sessions.forEach(async (session) => {

            if (session.userIp) {
                let country: string;
                let city: string;
                try {
                    const userInfoLocation = lookup(session.userIp);
                    country = userInfoLocation?.country || '';
                    city = userInfoLocation?.city || '';
                } catch (e) {
                    this.logger.error(e);
                }
                session.country = country;
                session.city = city;
                this.logger.log(` * updating ${session.sid} with detailed user location`);

                await this.sessionService.updateSession(session);
            } else {
                this.logger.error(`Session ${session.sid} is missing a valid user ip`);
            }

        })
    }

    private async updateSessionsWithParsedUserLocationAndIP(page: number, take: number) {
        const sessions = await this.sessionService.getSessionsWithParsedUserLocationAndIP(page, take);
        sessions.forEach(async (session) => {

            if (session.userIp) {
                session.userIp = null;
                this.logger.debug(`removing userIp on ${session.sid}`);

                await this.sessionService.updateSession(session);
            } else {
                this.logger.error(`Session ${session.sid} is missing a valid user ip`);
            }

        })
    }

    
    private async deleteInvalidTracks(): Promise<any> {

        const invalidTracks = await this.trackService.deleteInvalidInteractions();
        if (invalidTracks.length > 0) {
            this.logger.error(`The following tracks contains invalid interactions. Migration module will schedule a cleanup shortly.`)
            invalidTracks.forEach(track => {
                this.logger.warn(` * deleting track ${track.flowId} tid:${track.tid}`)
            })
        }
    }

    private async migrateInteractions(): Promise<any> {
        this.logger.log(`Checking for pending interaction migrations from tracks`);
        let count =  await this.trackService.getMigratableInteractionTracks();
        const chunkSize = 10;

        while(count > 0) {
            const migrated = await this.trackService.migrateTrackInteraction(chunkSize);
            this.logger.log(` * migrated interaction: ${migrated}`)
            count = await this.trackService.getMigratableInteractionTracks();
        }
    }

}
