-- Custom SQL migration file, put your code below! --
INSERT INTO "posts" ("id", "title", "description", "content", "created_at") VALUES (
  '0',
  'test-post',
  'This is a test post.',
  '# Test Post
  
  This is a test post.',
  '2000-01-01T00:00:00Z'
);
