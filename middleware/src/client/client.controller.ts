import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ClientService } from './client.service';
@ApiTags('api/v1/client')
@Controller('client')
export class ClientController {

    constructor(private readonly clientService: ClientService) {

    }
    
    
}
