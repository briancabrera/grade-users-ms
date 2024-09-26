import request from 'supertest';
import express from 'express';
import userRouter from '../routes/userRoutes';
import { userService } from '../services/userService';

const app = express();
app.use(express.json());
app.use('/users', userRouter);

jest.mock('../services/userService');

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /users/create', () => {
    it('should create a new user successfully', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'student'
      };

      (userService.createUser as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/users/create')
        .set('user', JSON.stringify({ id: 1, role: 'admin' }))
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          role: 'student'
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ user: mockUser });
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/users/create')
        .set('user', JSON.stringify({ id: 1, role: 'admin' }))
        .send({
          username: 'testuser',
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'All fields are required' });
    });

    it('should return 403 if non-admin tries to create a user', async () => {
      const response = await request(app)
        .post('/users/create')
        .set('user', JSON.stringify({ id: 1, role: 'student' }))
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          role: 'student'
        });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ message: 'Only admins can create new users' });
    });

    it('should return 400 if user already exists', async () => {
      (userService.createUser as jest.Mock).mockRejectedValue(new Error('User already exists'));

      const response = await request(app)
        .post('/users/create')
        .set('user', JSON.stringify({ id: 1, role: 'admin' }))
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          role: 'student'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'User already exists' });
    });
  });

  describe('GET /users/me', () => {
    it('should return current user information', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'student'
      };

      (userService.getUserById as jest.Mock).mockReturnValue(mockUser);

      const response = await request(app)
        .get('/users/me')
        .set('user', JSON.stringify({ id: 1, role: 'student' }));

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: mockUser });
    });

    it('should return 404 if user not found', async () => {
      (userService.getUserById as jest.Mock).mockReturnValue(undefined);

      const response = await request(app)
        .get('/users/me')
        .set('user', JSON.stringify({ id: 1, role: 'student' }));

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'User not found' });
    });
  });

  describe('PUT /users/update', () => {
    it('should update user information successfully', async () => {
      const mockUser = {
        id: 1,
        username: 'updateduser',
        email: 'updated@example.com',
        role: 'student'
      };

      (userService.updateUser as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .put('/users/update')
        .set('user', JSON.stringify({ id: 1, role: 'student' }))
        .send({
          username: 'updateduser',
          email: 'updated@example.com'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: mockUser });
    });

    it('should return 404 if user not found', async () => {
      (userService.updateUser as jest.Mock).mockRejectedValue(new Error('User not found'));

      const response = await request(app)
        .put('/users/update')
        .set('user', JSON.stringify({ id: 1, role: 'student' }))
        .send({
          username: 'updateduser',
          email: 'updated@example.com'
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'User not found' });
    });
  });

  describe('DELETE /users/delete', () => {
    it('should delete user successfully', async () => {
      (userService.deleteUser as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app)
        .delete('/users/delete')
        .set('user', JSON.stringify({ id: 1, role: 'student' }));

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User deleted successfully' });
    });

    it('should return 404 if user not found', async () => {
      (userService.deleteUser as jest.Mock).mockRejectedValue(new Error('User not found'));

      const response = await request(app)
        .delete('/users/delete')
        .set('user', JSON.stringify({ id: 1, role: 'student' }));

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'User not found' });
    });
  });
});