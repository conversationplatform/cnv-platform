import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, response } from 'express';
import { PublicService } from './public.service';

@Controller('')
export class PublicController {
    
    constructor(
        private readonly publicService: PublicService
    ) { }

    @Get('_/*')
    getDefault(@Req() request: Request, @Res() response) {
        this.publicService.getDefaultApp(request, response);
    }

    @Get('app/*')
    getApp(@Req() request: Request, @Res() response) {
        this.publicService.getApp(request, response);
    }
}
