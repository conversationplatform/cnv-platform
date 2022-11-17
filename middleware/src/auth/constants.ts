import { v4 as uuidv4 } from 'uuid';

export const jwtConstants = {
    secret: process.env.NODE_ENV == 'DEVELOPMENT' ? 'secret' : Buffer.from(uuidv4()).toString('base64'),
  };