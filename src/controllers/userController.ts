import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserPayload } from '../types/types';
import { userService } from '../services/userService';

export const getCurrentUser = (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user as UserPayload;
    
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const fullUser = userService.getUserById(user.id);

    if (!fullUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: fullUser.id,
        username: fullUser.username,
        email: fullUser.email,
        role: fullUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { username, email } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const updatedUser = await userService.updateUser(userId, username, email);

    res.json({
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
  
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
  
      await userService.deleteUser(userId);
  
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: 'Server error' });
    }
};