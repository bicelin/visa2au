export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  image: string;
  metaDescription: string;
}

// Simple frontmatter parser that works in browser without Buffer (Node.js dependency)
function simpleMatter(raw: string): { data: Record<string, string>; content: string } {
  if (!raw.startsWith('---')) {
    return { data: {}, content: raw };
  }

  // Find end of frontmatter: --- followed by newline
  const endMatch = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!endMatch) {
    return { data: {}, content: raw };
  }

  const frontmatter = endMatch[1];
  const content = raw.slice(endMatch[0].length);

  const data: Record<string, string> = {};
  for (const line of frontmatter.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    let value = trimmed.slice(colonIdx + 1).trim();

    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    data[key] = value;
  }

  return { data, content };
}

// Vite's import.meta.glob to load all markdown files as raw text
const markdownFiles = import.meta.glob('/content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function parseMarkdownFile(path: string, raw: string): BlogPost {
  const parsed = simpleMatter(raw);
  const slug = path.replace('/content/blog/', '').replace('.md', '');

  return {
    slug,
    title: parsed.data.title || '',
    excerpt: parsed.data.excerpt || '',
    content: parsed.content.trim(),
    date: parsed.data.date || '',
    author: parsed.data.author || '',
    category: parsed.data.category || '',
    readTime: parsed.data.readTime || '',
    image: parsed.data.image || '',
    metaDescription: parsed.data.metaDescription || '',
  };
}

export const blogPosts: BlogPost[] = Object.entries(markdownFiles)
  .map(([path, raw]) => parseMarkdownFile(path, raw as string))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const getBlogPostBySlug = (slug: string): BlogPost | undefined =>
  blogPosts.find(p => p.slug === slug);

export const getBlogPostsByCategory = (category: string): BlogPost[] =>
  blogPosts.filter(p => p.category === category);

export const getAllCategories = (): string[] =>
  [...new Set(blogPosts.map(p => p.category))];
