import { IUser } from './Models.Types'; // Adjust path to your user type interface

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export { };
