import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@/generated/prisma';
import { getRequiredEnv } from '@/lib/env';

declare global {
  var prismaClientSingleton: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const connectionString = getRequiredEnv('DATABASE_URL');
  const adapter = new PrismaNeon({ connectionString });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export function getPrismaClient(): PrismaClient {
  if (globalThis.prismaClientSingleton) {
    return globalThis.prismaClientSingleton;
  }

  const client = createPrismaClient();

  if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaClientSingleton = client;
  }

  return client;
}
