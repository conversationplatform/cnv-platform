import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import { InteractionService } from '../interaction/interaction.service';
import { AggregatedTrackByFlowId } from '../model/aggregatedTrackByFlowId';
import { ClientTrack } from '../model/client.track';
import { UserSession } from '../model/usersession';
import { ArangoService } from '../persistence/arango/arango.service';


@Injectable()
export class TrackService {

    constructor(
        private readonly arangoService: ArangoService,
        private readonly interactionService: InteractionService) {

        this.arangoService.collection.ensureIndex({
            type: 'persistent',
            fields: ['sid', 'flowId', 'tid']
        })

        const indexes = [
            'sid',
            'flowId',
            'tid',
            'interaction',
            'store',
            'date'
            ];

        indexes.forEach(index => {
            this.arangoService.collection.ensureIndex({
                type: 'persistent',
                fields: [index]
            })
        })
    }

    async createTrack(userSession: UserSession, flowId: string): Promise<ClientTrack> {
        const clientTrack = new ClientTrack(userSession.sid, flowId);
        const insert = this.arangoService.collection.save(clientTrack);
        if (insert) {
            return clientTrack;
        }
    }

    async getClientTracks(
        page?: number, take?: number, sid?: string, flowId?: string,
        sortBy?: string, sortByType?: string,
        ninteractions?: number, interactionsOperator?: string,
        nstore?: number, storeOperator?: string,
        startDate?: Date, endDate?: Date): Promise<ClientTrack[]> {

        const filters = [];

        if (sid) {
            filters.push(aql`
                FILTER ct.sid == ${sid}
            ` )
        }

        if (flowId) {
            filters.push(aql`
                FILTER ct.flowId == ${flowId}
            `);
        }

        if (startDate && endDate) {
            filters.push(aql`
                FILTER ct.date >= ${new Date(startDate)} && ct.date <= ${new Date(endDate)}
            `);
        }


        if (sortBy && sortByType) {
            filters.push(aql`
                SORT ct.${sortBy} ${sortByType}
            `)
        } else {
            filters.push(aql`
                SORT ct.date ASC
            `)
        }

        if (ninteractions > 0 && interactionsOperator) {
            filters.push(this.getInteractionFilter(ninteractions, interactionsOperator));
        }

        if (nstore > 0 && storeOperator) {
            filters.push(this.getStoreFilter(nstore, storeOperator));
        }

        filters.push(aql`
            LIMIT ${+(page * take)}, ${+take}
            `);

        const query = aql`
            FOR ct in ${this.arangoService.collection}
            ${aql.join(filters)}
            RETURN ct
            `;
        return this.arangoService.queryMany<ClientTrack>(query);

    }


    async getTrack(sid: string, tid: string): Promise<ClientTrack | null> {
        const filters = [];

        if (sid) {
            filters.push(aql`
                FILTER ct.sid == ${sid}
            `);
        }

        if (tid) {
            filters.push(aql`
                FILTER ct.tid == ${tid}
            `)
        }

        filters.push(aql`
            RETURN ct
        `)


        const query = aql`
            FOR ct in ${this.arangoService.collection}
            ${aql.join(filters)}
            `;

        return this.arangoService.query<ClientTrack>(query);

    }

    async updateStore(clientTrack: ClientTrack, store: any) {
        const query = aql`
            FOR doc in ${this.arangoService.collection}
            FILTER doc._key == ${clientTrack._key}
            UPDATE doc WITH { store: ${store}} IN ${this.arangoService.collection} OPTIONS { exclusive: true }
            RETURN doc
        `;

        return this.arangoService.query<ClientTrack>(query);

    }

    async countClientTracks(
        sid?: string, flowId?: string,
        ninteractions?: number, interactionsOperator?: string,
        nstore?: number, storeOperator?: string,
        startDate?: Date, endDate?: Date): Promise<number> {
        const filters = [];

        if (sid) {
            filters.push(aql`FILTER ct.sid == ${sid}`)
        }

        if (flowId) {
            filters.push(aql`FILTER ct.flowId == ${flowId}`)
        }

        if (startDate && endDate) {
            filters.push(
                aql`FILTER ct.date >= ${new Date(startDate)} && ct.date <= ${new Date(endDate)}`
            )
        }

        if (ninteractions > 0 && interactionsOperator) {
            filters.push(this.getInteractionFilter(ninteractions, interactionsOperator));
        }

        if (nstore > 0 && storeOperator) {
            filters.push(this.getStoreFilter(nstore, storeOperator));
        }


        const query = aql`
            FOR ct in ${this.arangoService.collection}
            ${aql.join(filters)}
            COLLECT WITH COUNT INTO length
            RETURN length
        `;
        return this.arangoService.query(query);
    }

    private getInteractionFilter(ninteraction: number, interactionOperator: string) {
        switch (interactionOperator) {
            case '===':
                return aql`
                        FILTER LENGTH(ct.interaction) == ${+ninteraction}
                    `
            case '!=':
                return aql`
                        FILTER LENGTH(ct.interaction) != ${+ninteraction}
                    `
            case '<':
                return aql`
                        FILTER LENGTH(ct.interaction) < ${+ninteraction}
                    `
            case '<=':
                return aql`
                        FILTER LENGTH(ct.interaction) <= ${+ninteraction}
                    `
            case '>':
                return aql`
                        FILTER LENGTH(ct.interaction) > ${+ninteraction}
                    `
            case '>=':
                return aql`
                        FILTER LENGTH(ct.interaction) >= ${+ninteraction}
                    `
        }
    }

    private getStoreFilter(nstore: number, storeOperator: string) {
        switch (storeOperator) {
            case '===':
                return aql`
                        FILTER LENGTH(ct.store) == ${+nstore}
                    `
            case '!=':
                return aql`
                        FILTER LENGTH(ct.store) != ${+nstore}
                    `
            case '<':
                return aql`
                        FILTER LENGTH(ct.store) < ${+nstore}
                    `
            case '<=':
                return aql`
                        FILTER LENGTH(ct.store) <= ${+nstore}
                    `
            case '>':
                return aql`
                        FILTER LENGTH(ct.store) > ${+nstore}
                    `
            case '>=':
                return aql`
                        FILTER LENGTH(ct.store) >= ${+nstore}
                    `
        }
    }

    // metrics

    async getAggregatedTracksByFlowId(startDate?: Date, endDate?: Date): Promise<AggregatedTrackByFlowId[]> {
        const filters = [];

        if (startDate && endDate) {
            filters.push(aql`
                FILTER ct.date >= ${new Date(startDate)} && ct.date <= ${new Date(endDate)}
            `);
        }

        filters.push(aql`
            COLLECT name = ct.flowId into count
        ` )

        const query = aql`
            FOR ct in ${this.arangoService.collection}
            ${aql.join(filters)}
            RETURN {
                name: name,
                count: LENGTH(count)
            }
        `;
        return this.arangoService.queryMany<AggregatedTrackByFlowId>(query);
    }

    // migrations

    async deleteInvalidInteractions(): Promise<ClientTrack[]> {
        const query = aql`
            FOR ct in ${this.arangoService.collection}
            FILTER (ct.interaction && !IS_ARRAY(ct.interaction)) || (ct.interaction && LENGTH(ct.interaction) == 0)
            REMOVE { _key: ct._key } in ${this.arangoService.collection}
            RETURN { flowId: ct.flowId, tid: ct.tid}
        `;

        return this.arangoService.queryMany<ClientTrack>(query);

    }

    async getMigratableInteractionTracks(): Promise<number> {
        const query = aql`
            FOR ct in ${this.arangoService.collection}
            FILTER ct.interaction
            COLLECT WITH count into count
            RETURN count
        `;

        return this.arangoService.query<number>(query);

    }
    async migrateTrackInteraction(limit: number): Promise<number> {
        const query = aql`
            FOR ct in ${this.arangoService.collection}
            FILTER ct.interaction
            LIMIT 0, ${limit}
            REPLACE ct WITH UNSET(ct, 'interaction') IN ${this.arangoService.collection}
                FOR interaction in ct.interaction
                let data = MERGE(interaction, {flowId: ct.flowId, tid: ct.tid})
                INSERT data in ${this.interactionService.getCollection()}
                LET inserted = NEW
                COLLECT WITH count into count
            RETURN count
            
        `;
        return this.arangoService.query<number>(query);
    }


    // cron helpers

    async deleteExpiredTracks(endDate: Date): Promise<ClientTrack[]> {
        const query = aql`
            FOR ct in ${this.arangoService.collection}
            FILTER ct.date <= ${new Date(endDate)}
            REMOVE { _key: ct._key } in ${this.arangoService.collection}
                FOR interaction in ${this.interactionService.getCollection()}
                FILTER interaction.tid == ct.tid
                REMOVE { _key: interaction._key } in ${this.interactionService.getCollection()}
            RETURN {
                tid: ct.tid,
                flowId: ct.flowId
            }
        `;
        return this.arangoService.queryMany<ClientTrack>(query);
    }

}
