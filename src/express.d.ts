import { TokenInformationDto } from './user/dto/token-info.dto'; // Adjust path based on your User entity/model

declare module 'express' {
  export interface Request {
    user?: TokenInformationDto; // Now TypeScript knows that `req.user` exists
  }
}
