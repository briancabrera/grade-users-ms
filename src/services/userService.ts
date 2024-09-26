interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'parent' | 'moderator' | 'admin';
}

const users: User[] = [];

export class UserService {
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