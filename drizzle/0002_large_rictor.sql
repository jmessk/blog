-- Custom SQL migration file, put your code below! --

-- example 2 --
INSERT INTO "posts" ("id", "title", "description", "thumbnail_uri", "content", "created_at") VALUES (
  '1',
  'Example Post 2',
  'This is a test post.',
  'https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg',
  '## Example Post 2
  
  This is a test post.
  ',
  '1999-12-31T23:59:59Z'
);
--> statement-breakpoint
INSERT INTO "tags" ("id", "name", "icon_uri") VALUES (
  'linux',
  'Linux',
  'https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg'
);
--> statement-breakpoint
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES ('1', 'linux');