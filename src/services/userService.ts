// src/services/userService.ts

import bcrypt from 'bcrypt';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'parent' | 'moderator' | 'admin';
}

const users: User[] = [];

export class UserService {
  async createUser(username: string, email: string, password: string, role: User['role']): Promise<User> {
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      role
    };
    users.push(newUser);

    return newUser;
  }

  getUserById(id: number): User | undefined {
    return users.find(user => user.id === id);
  }

  async updateUser(userId: number, username?: string, email?: string): Promise<User> {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    if (username) users[userIndex].username = username;
    if (email) users[userIndex].email = email;

    return users[userIndex];
  }

  async deleteUser(userId: number): Promise<void> {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users.splice(userIndex, 1);
  }
}

export const userService = new UserService();