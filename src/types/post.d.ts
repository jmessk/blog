export type PostMetadata = {
  title: string;
  description?: string;
  tags?: string[];
  post?: string;
  update?: string;
  thumbnail?: string;
};

export type Post = {
  id: string;
  metadata: PostMetadata;
  content: JSX.Element;
}
