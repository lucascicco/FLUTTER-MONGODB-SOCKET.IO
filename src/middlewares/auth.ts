import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction }  from 'express';

interface UserPayload {
    id: string;
};

declare global {
    namespace Express {
      interface Request {
        userId?: string;
      }
    }
  }
  
export default async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.APP_SECRET!) as UserPayload;

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ Token: 'Token invalid' });
  }
};
