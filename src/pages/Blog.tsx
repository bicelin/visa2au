import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Calendar, Clock, User, Tag } from 'lucide-react';
import Layout from '../components/Layout';
import { blogPosts, getAllCategories } from '../data/blogPosts';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', ...getAllCategories()];
  const filtered = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter(p => p.category === activeCategory);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 t-bg-body overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden="true" />
        <img src="/imgs/aboriginal-emu.png" alt="" className="absolute bottom-0 right-0 w-28 h-44 opacity-10 pointer-events-none" aria-hidden="true" loading="lazy" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
              <BookOpen className="w-4 h-4 text-visa-gold" aria-hidden="true" />
              <span className="t-text-primary text-sm font-medium">Immigration Insights</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">
              Australian Immigration <span className="text-gradient-gold">Blog</span>
            </h1>
            <p className="t-text-muted text-lg max-w-2xl mx-auto">
              Expert insights, visa guides, and the latest news on Australian immigration from our registered migration agents.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 t-bg-body border-b t-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  cat === activeCategory
                    ? 'bg-visa-gold text-visa-navy'
                    : 'glass-card t-text-muted hover:t-text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-padding t-bg-body relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden="true" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filtered.map((post, i) => (
              <article key={i} className="glass-card overflow-hidden group hover:border-visa-gold/30 transition-all">
                <Link to={`/blog/${post.slug}`} className="block">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      width="400"
                      height="192"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-visa-navy/80 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="glass-card px-2 py-0.5 text-xs text-visa-gold font-medium flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {post.category}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="p-5">
                  <div className="flex items-center gap-3 t-text-ghost text-xs mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                  </div>
                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="text-lg font-bold t-text-primary mb-2 group-hover:text-visa-gold transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="t-text-faint text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 t-text-ghost text-xs">
                      <User className="w-3 h-3" />{post.author}
                    </span>
                    <Link to={`/blog/${post.slug}`} className="text-visa-gold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                      Read <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
