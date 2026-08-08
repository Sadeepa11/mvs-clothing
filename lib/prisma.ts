import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = (): PrismaClient => {
  const tursoUrl = process.env.TURSO_DATABASE_URL || '';
  const databaseUrl = process.env.DATABASE_URL || '';

  // Detect remote Turso/LibSQL URL
  const remoteUrl = tursoUrl.startsWith('libsql://') || tursoUrl.startsWith('https://')
    ? tursoUrl
    : (databaseUrl.startsWith('libsql://') || databaseUrl.startsWith('https://'))
    ? databaseUrl
    : '';

  const authToken = process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN || '';

  // Use LibSQL adapter for Vercel production or explicit remote Turso URLs
  if (remoteUrl && (process.env.VERCEL || remoteUrl.startsWith('https://'))) {
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
      console.warn('LibSQL client fallback to standard Prisma:', e);
    }
  }

  // Local SQLite fallback (dev.db)
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
