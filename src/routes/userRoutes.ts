// src/routes/userRoutes.ts

import express from 'express';
import { Request, Response, NextFunction } from 'express';
import {
  createUser,
  getCurrentUser,
  updateUser,
  deleteUser
} from '../controllers/userController';
import { checkAuth } from '../middlewares/checkAuth';
import { AuthenticatedRequest } from '../types/types';

const userRouter = express.Router();

userRouter.post('/create', checkAuth, (req: Request, res: Response, next: NextFunction) => {
  createUser(req as AuthenticatedRequest, res).catch(next);
});

userRouter.get('/me', checkAuth, (req: Request, res: Response, next: NextFunction) => {
  getCurrentUser(req as AuthenticatedRequest, res);
});

userRouter.put('/update', checkAuth, (req: Request, res: Response, next: NextFunction) => {
  updateUser(req as AuthenticatedRequest, res, next).catch(next);
});

userRouter.delete('/delete', checkAuth, (req: Request, res: Response, next: NextFunction) => {
  deleteUser(req as AuthenticatedRequest, res).catch(next);
});

export default userRouter;