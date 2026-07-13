export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  year: string;
  upvotes: number;
  content: string;
  tags: string[];
  slug: string;
  author?: string;
  relatedPosts?: RelatedPost[];
}

export interface RelatedPost {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
}

export interface BlogListResponse {
  blogs: BlogPost[];
}

export interface BlogPostResponse {
  blogPost: BlogPost;
}




