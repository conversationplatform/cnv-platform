import { ModuleMetadata } from "@nestjs/common";
import { BehaviorSubject } from "rxjs";

export interface NodeRedWorkerSettings {
    port: number;
    settings: any;
}

export interface NodeRedOptions {
    home_dir?: string;
    enable_projects: boolean;
    enable_pallete: boolean;
    flow_file: string;
    admin_user: string;
    admin_password_encrypted: string;
    admin_password_plain: string;
}

export interface NodeRedAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useFactory?: (
    ...args: any[]
  ) => Promise<NodeRedOptions> | BehaviorSubject<NodeRedOptions> | NodeRedOptions;
  inject?: any[];
}