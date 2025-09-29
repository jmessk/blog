import { sqliteTable, text } from "drizzle-orm/sqlite-core";


export const postsTable = sqliteTable("posts", {
  id: text().notNull().primaryKey(), // UUIDv7
  title: text().notNull(),
  description: text(),
  thumbnail_uri: text(),
  category: text().notNull(),
  content: text().notNull(),
  created_at: text().notNull(),
  updated_at: text(),
  deleted_at: text()
});

export const tagsTable = sqliteTable("tags", {
  id: text().notNull().primaryKey(), // e.g. javascript
  name: text().notNull().unique(),   // e.g. JavaScript
  icon_uri: text(),
  category: text().notNull(),
});

export const postTagsTable = sqliteTable("post_tags", {
  post_id: text().notNull().references(() => postsTable.id, { onDelete: "cascade" }),
  tag_id: text().notNull().references(() => tagsTable.id, { onDelete: "cascade" }),
});
