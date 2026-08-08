import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const getTursoUrl = (): string => {
  const env = process.env;
  const candidates = [
    env.TURSO_DATABASE_URL,
    env.DATABASE_URL,
    env.DATABASE_TURSO_DATABASE_URL,
    env.DATABASE_DATABASE_URL,
    env.TURSO_URL,
    env.LIBSQL_URL,
  ];

  for (const c of candidates) {
    if (c && typeof c === 'string') {
      const trimmed = c.trim();
      if (trimmed.startsWith('libsql://') || trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
        // Convert libsql:// to https:// scheme for Vercel Serverless HTTP compatibility
        return trimmed.replace(/^libsql:\/\//, 'https://');
      }
    }
  }
  return '';
};

const getTursoAuthToken = (): string => {
  const env = process.env;
  const candidates = [
    env.TURSO_AUTH_TOKEN,
    env.DATABASE_AUTH_TOKEN,
    env.DATABASE_TURSO_AUTH_TOKEN,
    env.DATABASE_DATABASE_AUTH_TOKEN,
    env.TURSO_TOKEN,
    env.LIBSQL_AUTH_TOKEN,
  ];

  for (const c of candidates) {
    if (c && typeof c === 'string' && c.trim().length > 0) {
      return c.trim();
    }
  }
  return '';
};

const createPrismaClient = (): PrismaClient => {
  const isVercel = Boolean(process.env.VERCEL);
  const remoteUrl = getTursoUrl();
  const authToken = getTursoAuthToken();

  // Use LibSQL adapter ONLY on Vercel deployment when valid remote URL is present
  if (isVercel && remoteUrl && remoteUrl.startsWith('https://')) {
    try {
      const libsql = createClient({
        url: remoteUrl,
        authToken: authToken || undefined,
      });
      const adapter = new PrismaLibSQL(libsql as any);
      return new PrismaClient({
        adapter,
        log: ['error'],
      });
    } catch (e) {
      console.warn('LibSQL client initialization failed, falling back to standard Prisma:', e);
    }
  }

  // Local development & local build fallback to local SQLite (file:./dev.db)
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
