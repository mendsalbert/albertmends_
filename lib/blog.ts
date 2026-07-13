import { remark } from "remark";
import html from "remark-html";
import type { Database } from "@/types/database";
import type { BlogPost } from "@/types/blog";

type BlogRow = Database["public"]["Tables"]["blog_posts"]["Row"];

export async function markdownToHtml(markdown: string): Promise<string> {
  const processed = await remark().use(html).process(markdown);
  let contentHtml = processed.toString();

  contentHtml = contentHtml.replace(
    /<h2([^>]*)>(.*?)<\/h2>/gi,
    (_match, attrs: string, inner: string) => {
      if (/\sid=/i.test(attrs)) return `<h2${attrs}>${inner}</h2>`;
      const text = inner.replace(/<[^>]+>/g, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return `<h2${attrs} id="${id}">${inner}</h2>`;
    }
  );

  return contentHtml;
}

export function mapBlogRowToPost(
  row: BlogRow,
  contentHtml = ""
): BlogPost {
  return {
    id: row.slug,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    date: row.date,
    readTime: row.read_time,
    category: row.category,
    year: row.year,
    upvotes: row.upvotes,
    tags: row.tags ?? [],
    author: row.author ?? undefined,
    content: contentHtml,
  };
}
