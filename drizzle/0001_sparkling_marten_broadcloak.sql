-- Custom SQL migration file, put your code below! --

-- example 1 --
INSERT INTO "posts" ("id", "title", "description", "thumbnail_uri", "content", "created_at") VALUES (
  '0',
  'Example Post 1',
  'This is a test post.',
  'https://rustacean.net/assets/rustacean-orig-noshadow.png',
  '## Example Post 1
  
  This is a test post.
  ',
  '2000-01-01T00:00:00Z'
);
--> statement-breakpoint
INSERT INTO "tags" ("id", "name", "icon_uri") VALUES (
  'rust',
  'Rust',
  'https://www.rust-lang.org/static/images/rust-logo-blk.svg'
);
--> statement-breakpoint
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES ('0', 'rust');