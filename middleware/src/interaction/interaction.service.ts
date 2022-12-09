import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import { DocumentCollection, EdgeCollection } from 'arangojs/collection';
import { TrackService } from 'src/track/track.service';
import { Interaction } from '../model/client.interaction';
import { ArangoService } from '../persistence/arango/arango.service';
const parser = require('json2csv');

@Injectable()
export class InteractionService {

    constructor(
        private readonly arangoService: ArangoService,
        private readonly trackService: TrackService) {
        this.arangoService.collection.ensureIndex({
            type: 'persistent',
            fields: ['sid', 'flowId', 'tid']
        })
        this.arangoService.collection.ensureIndex({
            type: 'persistent',
            fields: ['flowId', 'tid']
        })
        const indexes = [
            'sid',
            'flowId',
            'tid',
            'timestamp'
        ];

        indexes.forEach(index => {
            this.arangoService.collection.ensureIndex({
                type: 'persistent',
                fields: [index]
            })
        })
    }

    public getCollection(): DocumentCollection<any> & EdgeCollection<any> {
        return this.arangoService.collection;
    }

    async createInteraction(interaction: Interaction): Promise<Interaction> {

        const insert = await this.arangoService.collection.save(interaction);
        if (insert) {
            return interaction;
        }
    }

    async getInteractions(
        page: number = 0, take: number = 5, flowId?: string | string[], tid?: string | string[],
        sortBy?: string, sortByType?: string, startDate?: Date, endDate?: Date, origin?: string,
        nodeId?: string | string[], type?: string | string[], name?: string | string[], value?: string): Promise<Interaction[]> {

        const filters = [];
        
        if (tid) {
            if(Array.isArray(tid)) {
                filters.push(aql`
                    FILTER CONTAINS(${tid}, i.tid)
                ` )
            } else {
                filters.push(aql`
                    FILTER i.tid == ${tid}
                ` )

            }
        }

        if (flowId) {
            if(Array.isArray(flowId)) {
                filters.push(aql`
                    FILTER CONTAINS(${flowId}, i.flowId)
                ` )
            } else {
                filters.push(aql`
                    FILTER i.flowId == ${flowId}
                ` )

            }
        }

        if(startDate && endDate) {
            filters.push(aql`
                FILTER i.timestamp >= ${new Date(startDate)} && i.timestamp <= ${new Date(endDate)}
            ` )
        }
        
        if (sortBy && sortByType) {
            filters.push(aql`
                SORT i.${sortBy} ${sortByType}
            `)
        } else {
            filters.push(aql`
                SORT i.timestamp ASC
            `)
        }

        if (origin) {
            filters.push(aql`
                FILTER i.origin == ${origin}
            `);
        }

        if (nodeId) {
            if(Array.isArray(nodeId)) {
                filters.push(aql`
                    FILTER CONTAINS(${nodeId}, i.data.nodeId)
                ` )
            } else {
                filters.push(aql`
                    FILTER i.data.nodeId == ${flowId}
                ` )

            }
        }

        if (type) {
            if(Array.isArray(type)) {
                filters.push(aql`
                    FILTER CONTAINS(${type}, i.data.type)
                ` )
            } else {
                filters.push(aql`
                    FILTER i.data.type == ${type}
                ` )

            }
        }

        if (name) {
            if(Array.isArray(name)) {
                filters.push(aql`
                    FILTER CONTAINS(${name}, i.data.name) || CONTAINS(${name}, i.data.nodeName) || CONTAINS(${name}, i.data.type)
                ` )
            } else {
                filters.push(aql`
                    FILTER i.data.name == ${name} || i.data.nodeName == ${name} || i.data.type == ${name}
                ` )

            }
        }


        if(value) {
            filters.push(aql`
                FILTER i.data.value == ${value}
            `);
        }
       
        filters.push(aql`
            LIMIT ${+(page * take)}, ${+take}
            `);
        

        const query = aql`
            FOR i in ${this.arangoService.collection}
            LET sid = (
                FOR t in ${this.trackService.getCollection()}
                FILTER t.tid == i.tid
                RETURN t.sid
            )
            ${aql.join(filters)}
            
            RETURN MERGE(i, {sid: sid[0]})
        `;
        return this.arangoService.queryMany<Interaction>(query);

    }

    async countInteractions(flowId?: string | string[], tid?: string | string[],
        sortBy?: string, sortByType?: string, startDate?: Date, endDate?: Date, origin?: string,
        nodeId?: string | string[], type?: string | string[], name?: string | string[], value?: string): Promise<number> {

        const filters = [];

        if (tid) {
            if(Array.isArray(tid)) {
                filters.push(aql`
                    FILTER CONTAINS(${tid}, i.tid)
                ` )
            } else {
                filters.push(aql`
                    FILTER i.tid == ${tid}
                ` )

            }
        }

        if (flowId) {
            if(Array.isArray(flowId)) {
                filters.push(aql`
                    FILTER CONTAINS(${flowId}, i.flowId)
                ` )
            } else {
                filters.push(aql`
                    FILTER i.flowId == ${flowId}
                ` )

            }
        }

        if(startDate && endDate) {
            filters.push(aql`
                FILTER i.timestamp >= ${new Date(startDate)} && i.timestamp <= ${new Date(endDate)}
            ` )
        }
        
        if (sortBy && sortByType) {
            filters.push(aql`
                SORT i.${sortBy} ${sortByType}
            `)
        } else {
            filters.push(aql`
                SORT i.timestamp ASC
            `)
        }

        if (origin) {
            filters.push(aql`
                FILTER i.origin == ${origin}
            `);
        }

        if (nodeId) {
            if(Array.isArray(nodeId)) {
                filters.push(aql`
                    FILTER CONTAINS(${nodeId}, i.data.nodeId)
                ` )
            } else {
                filters.push(aql`
                    FILTER i.data.nodeId == ${flowId}
                ` )

            }
        }

        if (type) {
            if(Array.isArray(type)) {
                filters.push(aql`
                    FILTER CONTAINS(${type}, i.data.type)
                ` )
            } else {
                filters.push(aql`
                    FILTER i.data.type == ${type}
                ` )

            }
        }

        if (name) {
            if(Array.isArray(name)) {
                filters.push(aql`
                    FILTER CONTAINS(${name}, i.data.name) || CONTAINS(${name}, i.data.nodeName) || CONTAINS(${name}, i.data.type)
                ` )
            } else {
                filters.push(aql`
                    FILTER i.data.name == ${name} || i.data.nodeName == ${name} || i.data.type == ${name}
                ` )

            }
        }


        if(value) {
            filters.push(aql`
                FILTER i.data.value == ${value}
            `);
        }

        const query = aql`
            FOR i in ${this.arangoService.collection}
            ${aql.join(filters)}
            COLLECT WITH COUNT into count
            RETURN count
        `;

        return this.arangoService.query<number>(query);
    }
    
    

    public async getInteractionCSV(page: number = 0, take: number = 5, flowId?: string | string[], tid?: string | string[],
        sortBy?: string, sortByType?: string, startDate?: Date, endDate?: Date, origin?: string,
        nodeId?: string | string[], type?: string | string[], name?: string | string[], value?: string): Promise<string> {
        let interactions = await this.getInteractions(page, take, flowId, tid, sortBy, sortByType, startDate, endDate, origin, nodeId, type, name, value);
        interactions = interactions.map(interaction => {
            let type = 'flow';
            switch (interaction.data.type) {
                case 'event': type = 'event'; break;
                case 'question': type = 'question'; break;
                case 'answer': type = 'answer'; break;

            }
            return {
                sid: interaction.sid,
                tid: interaction.tid,
                flowId: interaction.flowId,
                timestamp: interaction.timestamp,
                origin: interaction.origin,
                nodeId: interaction.data.nodeId,
                type,
                name: interaction.data.name || interaction.data.type,
                value: interaction.data.value,
                //data: interaction.data

            }
        });
        if(interactions.length == 0) {
            return '';
        }
        const p = new parser.Parser();
        return p.parse(interactions);
    }

}
