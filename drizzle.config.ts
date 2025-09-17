import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { readdirSync } from "fs"

const isProduction = process.env.NODE_ENV === 'production';
const sqliteDirPath = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject';
const sqliteFilePath = readdirSync(sqliteDirPath).find(file => file.endsWith('.sqlite'));

export default isProduction ? defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CF_ACCOUNT_ID!,
    databaseId: process.env.CF_DATABASE_ID!,
    token: process.env.CF_D1_TOKEN!,
  },
}) : defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: `${sqliteDirPath}/${sqliteFilePath!}`,
  }
});;
