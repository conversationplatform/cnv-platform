import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    @Inject(AuthService)
    private readonly authService;


    async canActivate(context: ExecutionContext): Promise<boolean> {
        if(!this.authService.useAuth) {
            return true;
        }
        return (await super.canActivate(context)) as boolean;
        
    }
}
