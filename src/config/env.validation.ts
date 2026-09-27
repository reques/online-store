type Environment = Record<string, string | undefined>;
type ValidatedEnvironment = Record<string, unknown>;

function requireValue(env: Environment, key: string): string {
  const value = env[key]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export function validateEnvironment(env: Environment): ValidatedEnvironment {
  const nodeEnv = env.NODE_ENV ?? 'development';
  const port = Number(env.PORT ?? 3000);
  const redisPort = Number(env.REDIS_PORT ?? 6379);
  const bcryptRounds = Number(env.BCRYPT_ROUNDS ?? 12);

  if (!['development', 'test', 'production'].includes(nodeEnv)) {
    throw new Error('NODE_ENV must be development, test, or production');
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be a valid TCP port');
  }
  if (!Number.isInteger(redisPort) || redisPort < 1 || redisPort > 65535) {
    throw new Error('REDIS_PORT must be a valid TCP port');
  }
  if (!Number.isInteger(bcryptRounds) || bcryptRounds < 10 || bcryptRounds > 15) {
    throw new Error('BCRYPT_ROUNDS must be an integer between 10 and 15');
  }

  requireValue(env, 'DATABASE_URL');
  requireValue(env, 'REDIS_HOST');
  const jwtSecret = requireValue(env, 'JWT_SECRET');
  if (jwtSecret.length < 32) throw new Error('JWT_SECRET must contain at least 32 characters');

  return {
    ...env,
    NODE_ENV: nodeEnv,
    PORT: port,
    REDIS_PORT: redisPort,
    BCRYPT_ROUNDS: bcryptRounds,
    JWT_EXPIRES_IN: env.JWT_EXPIRES_IN ?? '15m',
  };
}
