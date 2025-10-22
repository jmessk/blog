export type Tag = {
  id: string;
  category: string;
  name: string;
  iconUri?: string;
}

export type PostMeta = {
  id: string;
  title: string;
  description?: string;
  category: string;
  tags?: Tag[];
  thumbnailUri?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
};

// `content` is includeing the front-matter
export type Post = PostMeta & { content: string; };

export type FrontMatter = Omit<Partial<PostMeta>, "tags"> & { tags?: string[]; };
