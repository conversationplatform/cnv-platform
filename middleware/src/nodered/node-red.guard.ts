import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { NodeREDState } from "./node-red.worker.state";
import { NoderedService } from "./nodered.service";

@Injectable()
export class NodeREDGuard implements CanActivate {
    @Inject(NoderedService)
    private readonly nodeRedService: NoderedService;


    async canActivate(context: ExecutionContext): Promise<boolean> {
        if(this.nodeRedService.nodeRedState != NodeREDState.RUNNING || !this.nodeRedService.isAuthenticated()) {
            return false;
        }
        return true;
        
    }
}
