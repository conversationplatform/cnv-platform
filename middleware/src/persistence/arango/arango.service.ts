import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { Database } from 'arangojs';
import { AqlQuery } from 'arangojs/aql';
import { DocumentCollection, EdgeCollection } from 'arangojs/collection';
import { QueryOptions } from 'arangojs/database';
import { ARANGO_COLLECTION, ARANGO_DATABASE } from './arango.constants';

@Injectable()
export class ArangoService {
    logger: Logger = new Logger(ArangoService.name);
    collection: DocumentCollection<any> & EdgeCollection<any>;
    database: Database;
    constructor(
        @Inject(ARANGO_DATABASE) private arangoDatabase: Database,
        @Inject(ARANGO_COLLECTION) private arangoCollection: string) {

        this.database = arangoDatabase;
        this.collection = arangoDatabase.collection(arangoCollection);
        this.collection.create().catch(e => {
            if(e.message !== 'duplicate name') {
                this.logger.error(`While creating collection ${arangoCollection}: ${e}`);
            }
            
        });

    }

    async queryMany<T>(query: AqlQuery, options?: QueryOptions): Promise<T[]> {
        return this.database.query(query)
        .then(res => res.all())
        .catch(e => {
            throw new HttpException(e.response.body.errorMessage, e.code)
        })
    }

    async query<T>(query: AqlQuery, options?: QueryOptions): Promise<T> {
        return this.database.query(query)
        .then(res => res.all())
        .then(res => res?.[0])
        .catch(e => {
            throw new HttpException(e.response.body.errorMessage, e.code)
        })
    }

    

}
