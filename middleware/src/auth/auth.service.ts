import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config/config.service';
import { LoginResponse } from '../model/loginresponse';
import { v4 as uuidv4 } from 'uuid';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {

    private adminuser: string;
    private adminpassword: string;
    public bcryptpassword: string;
    public useAuth: boolean = false;
    private readonly logger = new Logger(AuthService.name);

    constructor(private readonly configService: ConfigService,
        private jwtService: JwtService) {
        this.adminuser = configService.get('ADMIN_USER')
        this.adminpassword = configService.get('ADMIN_PASSWORD');

        if(!this.adminuser) {
            this.logger.warn(`

            ██╗    ██╗ █████╗ ██████╗ ███╗   ██╗██╗███╗   ██╗ ██████╗ 
            ██║    ██║██╔══██╗██╔══██╗████╗  ██║██║████╗  ██║██╔════╝ 
            ██║ █╗ ██║███████║██████╔╝██╔██╗ ██║██║██╔██╗ ██║██║  ███╗
            ██║███╗██║██╔══██║██╔══██╗██║╚██╗██║██║██║╚██╗██║██║   ██║
            ╚███╔███╔╝██║  ██║██║  ██║██║ ╚████║██║██║ ╚████║╚██████╔╝
             ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═══╝ ╚═════╝ 

            ---------------------------------------------------------------------
            < WARNING: admin user not setted. Using the application without admin >
            <          credentials is meant for development purposes ONLY!        >
            ---------------------------------------------------------------------
                    \\   ^__^
                    \\  (oo)\\_______
                        (__)\\       )\\/\\
                            ||----w |
                            ||     ||`
)
        } else {
            this.useAuth = true;

            if(!this.adminpassword) {
                this.logger.warn(`admin password for user ${this.adminuser} not setted. generating new one`);
                this.adminpassword = Buffer.from(uuidv4()).toString('base64');
                this.logger.warn(`Generated password: ${this.adminpassword}`);
            }

            this.bcryptpassword = bcrypt.hashSync(this.adminpassword, 10);

            
        }
    }


    validateUser(user: string, password: string): boolean {
        return user == this.adminuser && bcrypt.compareSync(password, this.bcryptpassword);
    }

    async login(user: any): Promise<LoginResponse> {
        const payload = {
            username: user,
            timestamp: new Date()
        };
        return {
            access_token: this.jwtService.sign(payload)
        }
    }


    
}
