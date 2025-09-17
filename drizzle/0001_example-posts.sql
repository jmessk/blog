-- Custom SQL migration file, put your code below! --
INSERT INTO "posts" ("id", "title", "description", "content") VALUES (
  '0',
  'test-post',
  'This is a test post.',
  '# Test Post\n\nThis is a test post.'
);