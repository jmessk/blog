export type Tag = {
  id: string;
  name: string;
  icon_uri?: string;
}

export type PostMeta = {
  id: string;
  title: string;
  description?: string;
  category: string;
  tags?: Tag[];
  thumbnail_uri?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
};

// `content` is includeing the front-matter
export type Post = PostMeta & { content: string; };

export type FrontMatter = Omit<Partial<PostMeta>, "tags"> & { tags?: string[]; };
