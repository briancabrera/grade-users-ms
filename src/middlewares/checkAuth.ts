import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserPayload } from '../types/types';

export const checkAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const userHeader = req.header('user');
  if (!userHeader) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }
  try {
    const user = JSON.parse(userHeader) as UserPayload;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid user data' });
  }
};