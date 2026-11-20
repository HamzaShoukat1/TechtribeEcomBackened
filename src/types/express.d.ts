import type { IUser } from "./Models.Types.js";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
