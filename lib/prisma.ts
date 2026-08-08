import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const getTursoUrl = (): string => {
  const url =
    process.env.TURSO_DATABASE_URL ||
    process.env.DATABASE_URL ||
    process.env.DATABASE_TURSO_DATABASE_URL ||
    process.env.DATABASE_DATABASE_URL ||
    '';

  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (
    trimmed.startsWith('libsql://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://')
  ) {
    return trimmed.replace(/^libsql:\/\//, 'https://');
  }
  return '';
};

const getTursoAuthToken = (): string => {
  const token =
    process.env.TURSO_AUTH_TOKEN ||
    process.env.DATABASE_AUTH_TOKEN ||
    process.env.DATABASE_TURSO_AUTH_TOKEN ||
    process.env.DATABASE_DATABASE_AUTH_TOKEN ||
    '';

  if (!token || typeof token !== 'string') return '';
  return token.trim();
};

const createPrismaClient = (): PrismaClient => {
  const remoteUrl = getTursoUrl();
  const authToken = getTursoAuthToken();

  // ONLY use LibSQL adapter when running on Vercel deployment environment
  if (process.env.VERCEL && remoteUrl && remoteUrl.startsWith('https://')) {
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
      console.warn('LibSQL adapter initialization error, fallback:', e);
    }
  }

  // Local SQLite development & local build fallback (file:./dev.db)
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
