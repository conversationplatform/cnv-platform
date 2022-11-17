import { ModuleMetadata } from "@nestjs/common";

export interface ArangoOptions {
    host?: string;
    user?: string;
    password?: string;
    database?: string;
}

export interface ArangoModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useFactory?: (
    ...args: any[]
  ) => Promise<ArangoOptions> | ArangoOptions;
  inject?: any[];
}