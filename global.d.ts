import Session from 'junction-orm/lib/Session';

declare global {
  namespace Express {
    interface Request {
      junction: Session;
    }
  }
}
