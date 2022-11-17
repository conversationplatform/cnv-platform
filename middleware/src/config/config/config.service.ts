import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Subject } from 'rxjs';

import { DEFAULTS } from './defaults';
@Injectable()
export class ConfigService {
    private readonly envConfig: { [key: string]: string };
    private _override: Map<string, string> = new Map<string, string>();

    public events: Subject<string>;

    constructor(filePath: string) {
        if (fs.existsSync(filePath)) {
            this.envConfig = dotenv.parse(fs.readFileSync(filePath));
        } else {
            this.envConfig = {}
        }

        this.events = new Subject();

    }

    get(key: string): string {
        if(this._override.has(key)) {
            return this._override.get(key);
        }
        return process.env[key] || this.envConfig[key] || DEFAULTS[key] || null;
    }

    override(key: string, value: string) {
        this._override.set(key, value);
    }
}
