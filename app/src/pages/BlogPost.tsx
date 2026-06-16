import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Tag, Share2 } from 'lucide-react';
import Layout from '../components/Layout';
import { getBlogPostBySlug, blogPosts } from '../data/blogPosts';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPostBySlug(slug || '');

  if (!post) return <Navigate to="/blog" replace />;

  // Get related posts (same category, different slug)
  const related = blogPosts
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  // Convert markdown-like content to HTML
  const formatContent = (content: string) => {
    return content
      .split('\n\n')
      .map((block, i) => {
        if (block.startsWith('## ')) {
          return <h2 key={i} className="text-xl font-bold t-text-primary mt-8 mb-4">{block.replace('## ', '')}</h2>;
        }
        if (block.startsWith('**') && block.endsWith('**')) {
          return <p key={i} className="t-text-primary font-semibold mb-4">{block.replace(/\*\*/g, '')}</p>;
        }
        if (block.startsWith('- ')) {
          const items = block.split('\n').filter(l => l.startsWith('- ')).map(l => l.replace('- ', ''));
          return (
            <ul key={i} className="space-y-2 mb-4">
              {items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 t-text-secondary">
                  <span className="text-visa-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-visa-gold shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        if (block.startsWith('1. ')) {
          const items = block.split('\n').filter(l => /^\d+\. /.test(l)).map(l => l.replace(/^\d+\. /, ''));
          return (
            <ol key={i} className="space-y-2 mb-4 list-decimal list-inside">
              {items.map((item, j) => <li key={j} className="t-text-secondary">{item}</li>)}
            </ol>
          );
        }
        return <p key={i} className="t-text-secondary leading-relaxed mb-4">{block}</p>;
      });
  };

  return (
    <Layout>
      {/* Article Header */}
      <section className="relative pt-32 pb-16 t-bg-body overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden="true" />
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/blog" className="inline-flex items-center gap-2 t-text-faint hover:text-visa-gold text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="glass-card px-3 py-1 text-xs text-visa-gold font-medium flex items-center gap-1">
                <Tag className="w-3 h-3" />{post.category}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold t-text-primary mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 t-text-ghost text-sm">
              <span className="flex items-center gap-1"><User className="w-4 h-4" />{post.author}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{post.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 t-bg-body relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden="true" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Main Content */}
            <article className="lg:col-span-2">
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" style={{ objectPosition: "center 30%" }} width="800" height="400" />
                <div className="absolute inset-0 bg-gradient-to-t from-visa-navy/40 to-transparent" />
              </div>

              <div className="glass-panel p-6 md:p-10">
                <div className="prose-custom">
                  {formatContent(post.content)}
                </div>

                {/* Share */}
                <div className="mt-10 pt-6 border-t t-border flex items-center gap-3">
                  <Share2 className="w-4 h-4 t-text-ghost" />
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: post.title, url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }
                    }}
                    className="text-visa-teal hover:text-visa-gold text-sm transition-colors"
                  >
                    Share this article
                  </button>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* CTA */}
              <div className="glass-panel p-6 border-visa-gold/30">
                <h3 className="text-lg font-bold t-text-primary mb-3">Need Help With This Visa?</h3>
                <p className="t-text-faint text-sm mb-4">Our MARN-registered agents can guide you through the entire process.</p>
                <Link to="/contact" className="btn-primary w-full text-center block text-sm">
                  Book a Consultation
                </Link>
                <p className="t-text-ghost text-xs text-center mt-2">$330 AUD/hour</p>
              </div>

              {/* Related Posts */}
              {related.length > 0 && (
                <div className="glass-card p-6">
                  <h3 className="font-bold t-text-primary mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {related.map((r, i) => (
                      <Link key={i} to={`/blog/${r.slug}`} className="block group">
                        <p className="t-text-secondary text-sm group-hover:text-visa-gold transition-colors line-clamp-2">{r.title}</p>
                        <span className="t-text-ghost text-xs mt-1 flex items-center gap-1"><Clock className="w-3 h-3" />{r.readTime}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="glass-card p-6">
                <h3 className="font-bold t-text-primary mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(blogPosts.map(p => p.category))].map((cat, i) => (
                    <Link key={i} to="/blog" className="glass-card px-3 py-1 text-xs t-text-muted hover:text-visa-gold transition-colors">
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;
