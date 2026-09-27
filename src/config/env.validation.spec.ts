import { validateEnvironment } from './env.validation';

const valid = {
  DATABASE_URL: 'mysql://localhost/store', REDIS_HOST: 'localhost',
  JWT_SECRET: 'a-secure-secret-with-more-than-32-characters',
};

describe('validateEnvironment', () => {
  it('applies safe defaults', () => {
    expect(validateEnvironment(valid)).toMatchObject({ PORT: 3000, REDIS_PORT: 6379, BCRYPT_ROUNDS: 12 });
  });

  it('rejects short JWT secrets', () => {
    expect(() => validateEnvironment({ ...valid, JWT_SECRET: 'short' })).toThrow('at least 32');
  });
});
