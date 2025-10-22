-- Custom SQL migration file, put your code below! --

-- example 1 --
INSERT INTO "posts" ("id", "title", "description", "category", "thumbnail_uri", "content", "created_at") VALUES (
  '0',
  'Example Post 0',
  'This is a test post.',
  'example',
  'https://rustacean.net/assets/rustacean-orig-noshadow.png',
  '## Example Post 0
  
  This is a test post.
  ',
  '2000-01-01T00:00:00Z'
);
--> statement-breakpoint
INSERT INTO "tags" ("id", "category", "name", "icon_uri") VALUES (
  'rust',
  'tech',
  'Rust',
  'https://www.rust-lang.org/static/images/rust-logo-blk.svg'
);
--> statement-breakpoint
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (
    '0',
    'rust'
);

--> statement-breakpoint
-- example 2 --
INSERT INTO "posts" ("id", "title", "description", "category", "thumbnail_uri", "content", "created_at") VALUES (
  '1',
  'Example Post 1',
  'This is a test post.',
  'example',
  NULL,
  '## Example Post 1
  
  This is a test post.
  ',
  '1999-12-31T23:59:59Z'
);
--> statement-breakpoint
INSERT INTO "tags" ("id", "category", "name") VALUES (
  'linux',
  'tech',
  'Linux'
);
--> statement-breakpoint
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (
    '1',
    'linux'
);