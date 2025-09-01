import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const postsTable = sqliteTable("posts", {
  post_id: text().notNull().primaryKey(), // UUIDv7
  title: text().notNull(),
  description: text(),
  thumbnail: text(),
  content: text().notNull(),
  created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  deleted_at: text()
});
