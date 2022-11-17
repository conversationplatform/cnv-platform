import { Injectable, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { existsSync, createReadStream, fstat, fstatSync, lstatSync } from 'fs';
const path = require('path');
const mime = require('mime-types')

@Injectable()
export class PublicService {

    private readonly logger: Logger = new Logger(PublicService.name);

    async getDefaultApp(req: Request, res: Response) {
        const currentDir = process.env.PWD;
        const publicDir = path.resolve(currentDir, '..', 'public/');
        const originalUrl = req.originalUrl.replace('/_/', 'dashboard/');
        let filePath: string = path.resolve(publicDir, originalUrl);

        const defaultFile = path.resolve(publicDir, 'dashboard/index.html')
        if( !existsSync(filePath) || lstatSync(filePath).isDirectory()) {
            filePath = defaultFile;
        }
        this.streamFile(filePath, res)
        
    }

    async getApp(req: Request, res: Response) {
        const currentDir = process.env.PWD;
        const publicDir = path.resolve(currentDir, '..', 'public/');
        const originalUrl = req.originalUrl.replace('/app/', 'app/');
        
        let filePath: string = path.resolve(publicDir, originalUrl);
        const defaultFile = path.resolve(publicDir, 'app/index.html')

        if( !existsSync(filePath) || lstatSync(filePath).isDirectory()) {
            filePath = defaultFile;
        }
        this.streamFile(filePath, res)
    }

    private streamFile(path: string, res: Response) {
        try {
            if(existsSync(path)) {
                const file = createReadStream(path);
                res.set({
                    'Content-Type': mime.lookup(path)
                })
                file.pipe(res); 
            } else {
                res.status(404);
                res.send('not found')
            }
        } catch(e) {

            res.status(404);
                res.send('not found')
        }
        
    }
}
