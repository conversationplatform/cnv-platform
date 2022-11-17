import { Body, Controller, Get, HttpException, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBody, ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { BasicAuthUserPasswordDTO } from './basicAuthUserPasswordDTO';
import { ActivateFlowResponse } from '../model/activateflowresponse';
import { LoginResponse } from '../model/loginresponse';

@ApiTags('api/auth')
@Controller('api/auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {

    }

    
    @Get('renew')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        type: ActivateFlowResponse
    })
    renew(@Request() req){
        return this.authService.login(req.user.username);
    }
    
    @ApiBody({
        type: BasicAuthUserPasswordDTO
    })
    @ApiResponse({
        type: LoginResponse
    })
    @Post('bearer')
    authBearer(@Body("user") user: string, @Body("password") password: string) {

        if(this.authService.validateUser(user, password)) {
            return this.authService.login(user);
        }

        throw new HttpException('Authentication failure', HttpStatus.UNAUTHORIZED)
    }
}
