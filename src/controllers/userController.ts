// src/controllers/userController.ts

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserPayload } from '../types/types';
import { userService } from '../services/userService';

export const createUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if the authenticated user has admin privileges
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create new users' });
    }

    // Validate input
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newUser = await userService.createUser(username, email, password, role);

    res.status(201).json({
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'User already exists') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCurrentUser = (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user as UserPayload;
    
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

    if (userId === undefined) {
      return res.status(401).json({ message: 'User ID is missing' });
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

    if (userId === undefined) {
      return res.status(401).json({ message: 'User ID is missing' });
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