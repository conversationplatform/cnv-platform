import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import { ConfigService } from 'src/config/config/config.service';
import { CustomProperties } from 'src/model/custom.properties';
import { Property } from '../model/property';
import { ArangoService } from '../persistence/arango/arango.service';

@Injectable()
export class PropertiesService {

    constructor(
        private readonly arangoService: ArangoService,
        private readonly configService: ConfigService) {

    }

    async setProperty<T>(name: string, data: T): Promise<Property<T>> {

        let property: Property<T> = await this.getProperty<T>(name);

        if (!property) {
            property = new Property(name, data);
        } else {
            property.data = data;
        }

        let insert;

        if (property._key) {
            insert = this.updateProperty<T>(property);
        } else {
            insert = this.arangoService.collection.save(property);
        }

        if (insert) {
            return property;
        }
    }

    async updateProperty<T>(property: Property<T>): Promise<Property<T>> {

        const query = aql`
            FOR p in ${this.arangoService.collection}
            FILTER p._key == ${property._key} 
            UPDATE p WITH { modifiedDate: ${new Date()}, data: ${<any>property.data}} IN ${this.arangoService.collection} OPTIONS { exclusive: true }
            RETURN p
            `;
        return this.arangoService.database.query(query)
            .then(res => res.all())
            .then(res => res?.[0]);
    }

    async getProperty<T>(name): Promise<Property<T>> {

        const query = aql`
            FOR p in ${this.arangoService.collection}
            FILTER p.name == ${name}
            RETURN p
            `;

        return this.arangoService.database.query(query)
            .then(res => res.all())
            .then(res => res?.[0]);
    }

    public async initCustomProperties() {
        const customProperties = await this.getProperty<CustomProperties>('customProperties');

        if (customProperties && customProperties.data) {
            const keys = Object.keys(customProperties.data);
            Object.keys(customProperties.data).forEach(key => {
                this.configService.override(key, customProperties.data[key]);
            })
        }

        this.configService.events.next('config updated');
    }

    public async getCustomProperties(): Promise<CustomProperties> {
        return (await this._getCustomProperties()).data
    }

    public async updateCustomProperties(customProperties: CustomProperties): Promise<CustomProperties> {
        let cp = await this._getCustomProperties();

        cp.data = customProperties;
        cp = await this.updateProperty(cp);

        this.initCustomProperties();

        return cp.data;

    }


    private async _getCustomProperties(): Promise<Property<CustomProperties>> {
        let customProperties = await this.getProperty<CustomProperties>('customProperties');
        if(!customProperties) {
            customProperties = await this.setProperty<CustomProperties>('customProperties', {
                cors: this.configService.get('cors'),
                NODERED_ENABLE_PROJECTS: this.configService.get('NODERED_ENABLE_PROJECTS') == 'true',
                NODERED_ENABLE_PALLETE: this.configService.get('NODERED_ENABLE_PALLETE') == 'true',
                SESSION_COOKIE_NAME: this.configService.get('SESSION_COOKIE_NAME'),
                TRACK_LIFETIME_MONTHS: +this.configService.get('TRACK_LIFETIME_MONTHS')
            })
        }

        return customProperties
    }

}
