-- Custom SQL migration file, put your code below! --
INSERT INTO "posts" ("id", "title", "description", "thumbnail_url", "content", "created_at") VALUES (
  '0',
  'Test Post',
  'This is a test post.',
  'https://rustacean.net/assets/rustacean-orig-noshadow.png',
  '## Test Post
  
  This is a test post.
  ',
  '2000-01-01T00:00:00Z'
);

INSERT INTO "tags" ("id", "name", "icon_url") VALUES (
  'rust',
  'Rust',
  'https://www.rust-lang.org/static/images/rust-logo-blk.svg'
);

INSERT INTO "post_tags" ("post_id", "tag_id") VALUES ('0', 'rust');
