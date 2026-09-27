import { Role, User } from '@prisma/client';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('converts BCRYPT_ROUNDS from environment text before hashing', async () => {
    const user: User = {
      id: 7,
      email: 'new@example.com',
      name: 'New User',
      passwordHash: 'stored-hash',
      role: Role.CUSTOMER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const prisma = { user: { create: jest.fn().mockResolvedValue(user) } };
    const jwt = { signAsync: jest.fn().mockResolvedValue('signed-token') };
    const config = { get: jest.fn().mockReturnValue('10') };
    const service = new AuthService(prisma as never, jwt as never, config as never);

    await expect(
      service.register({ name: 'New User', email: 'new@example.com', password: 'ValidPass123' }),
    ).resolves.toMatchObject({ accessToken: 'signed-token', user: { email: 'new@example.com' } });
    expect(prisma.user.create).toHaveBeenCalledTimes(1);
  });
});
