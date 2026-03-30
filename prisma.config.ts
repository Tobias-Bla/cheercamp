import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const directUrl = process.env.DIRECT_URL;

if (!directUrl) {
  throw new Error('Missing DIRECT_URL. Copy .env.example to .env and set your Neon direct connection string before running Prisma migrations.');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: directUrl,
  },
});
