import express from 'express';
import { Request, Response, NextFunction } from 'express';
import {
  getCurrentUser,
  updateUser,
  deleteUser
} from '../controllers/userController';
import { AuthenticatedRequest } from '../types/types';

const userRouter = express.Router();

userRouter.get('/me', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      getCurrentUser(req, res);
    } catch (error) {
      next(error);
    }
});

userRouter.put('/update', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        await updateUser(req, res, next);
    } catch (error) {
        next(error);
    }
});

userRouter.delete('/delete', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await deleteUser(req, res);
    } catch (error) {
      next(error);
    }
});

export default userRouter;