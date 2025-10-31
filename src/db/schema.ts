import { sqliteTable, text } from "drizzle-orm/sqlite-core";


export const postsTable = sqliteTable("posts", {
  id: text("id").notNull().primaryKey(), // UUIDv7
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  thumbnailUri: text("thumbnail_uri"),
  // content: text("content").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
  deletedAt: text("deleted_at")
});

export const tagsTable = sqliteTable("tags", {
  id: text("id").notNull().primaryKey(), // e.g. javascript
  category: text("category").notNull(),
  name: text("name").notNull(),   // e.g. JavaScript
  iconUri: text("icon_uri"),
});

export const postTagsTable = sqliteTable("post_tags", {
  postId: text("post_id").notNull().references(() => postsTable.id, { onDelete: "cascade" }),
  tagId: text("tag_id").notNull().references(() => tagsTable.id, { onDelete: "cascade" }),
});

export const postObjectsTable = sqliteTable("post_objects", {
  postId: text("post_id").notNull().references(() => postsTable.id, { onDelete: "cascade" }),
  objectName: text("object_name").notNull(),
});
