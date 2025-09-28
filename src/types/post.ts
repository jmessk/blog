export type Tag = {
  id: string;
  name: string;
  icon_uri?: string;
}

export type PostMeta = {
  id: string;
  title: string;
  description?: string;
  thumbnail_uri?: string;
  category: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;

  tags?: Tag[];
};

// `content` is includeing the front-matter
export type Post = PostMeta & { content: string; };

export type FrontMatter = Omit<Partial<PostMeta>, "tags"> & { tags?: string[]; };
