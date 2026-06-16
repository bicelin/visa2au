import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, Clock, Tag, ArrowRight, Search } from 'lucide-react';
import Layout from '../components/Layout';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Visitor Visa 600: What You Need to Know in 2025',
      excerpt: 'Stay updated on the latest changes to Australia\'s Visitor Visa 600, including new processing times and requirements.',
      category: 'Visitor Visa',
      tags: ['Visitor Visa', '600', 'Tourism', 'ETA'],
      date: 'March 15, 2025',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&h=400&fit=crop',
      featured: true,
    },
    {
      id: 2,
      title: 'Partner Visa 820/801: Complete Processing Guide',
      excerpt: 'A comprehensive guide to the Australian Partner Visa pathway, from application to permanent residency.',
      category: 'Partner Visa',
      tags: ['Partner Visa', '820', '801', 'Spouse'],
      date: 'March 10, 2025',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&h=400&fit=crop',
      featured: true,
    },
    {
      id: 3,
      title: 'Skills in Demand 482 Visa: Latest Occupation Lists',
      excerpt: 'Check if your occupation is on the latest skills in demand list for employer-sponsored visas.',
      category: 'Work Visa',
      tags: ['482', 'Skills in Demand', 'Employer Sponsorship', 'Occupation List'],
      date: 'March 5, 2025',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
      featured: false,
    },
    {
      id: 4,
      title: 'Parent Visa 103: How to Bring Your Parents to Australia',
      excerpt: 'Understanding the Parent Visa 103 pathway and alternatives for family reunification.',
      category: 'Family Visa',
      tags: ['Parent Visa', '103', 'Family', 'Migration'],
      date: 'February 28, 2025',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=600&h=400&fit=crop',
      featured: false,
    },
    {
      id: 5,
      title: 'Australian Citizenship: Requirements and Benefits',
      excerpt: 'Everything you need to know about becoming an Australian citizen, including eligibility and the test.',
      category: 'Citizenship',
      tags: ['Citizenship', 'Naturalization', 'Australian Citizen', 'Test'],
      date: 'February 20, 2025',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1529528744093-6f8abeee511d?w=600&h=400&fit=crop',
      featured: false,
    },
    {
      id: 6,
      title: 'Prospective Marriage (300) Visa: Planning Your Wedding in Australia',
      excerpt: 'A guide to the Prospective Marriage visa for those planning to marry an Australian citizen or permanent resident.',
      category: 'Partner Visa',
      tags: ['300', 'Prospective Marriage', 'Fiance Visa', 'Wedding'],
      date: 'February 15, 2025',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
      featured: false,
    },
  ];

  const categories = ['All', 'Visitor Visa', 'Partner Visa', 'Work Visa', 'Family Visa', 'Citizenship'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory);

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-visa-navy py-24 lg:py-32">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-4" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Blog</span>
            </nav>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Immigration Insights
            </h1>
            <p className="text-xl text-white/80">
              Expert analysis and updates on Australian immigration law, visa policies, and migration news.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-visa-navy mb-8">Featured Articles</h2>
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {featuredPosts.map((post) => (
              <article key={post.id} className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width="600"
                    height="400"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-visa-gold text-visa-navy text-sm font-semibold px-3 py-1 rounded-full">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-visa-charcoal/60 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <time dateTime="2025-03-15">{post.date}</time>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <span className="inline-block bg-visa-teal/10 text-visa-teal text-sm px-3 py-1 rounded-full mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-bold text-visa-navy mb-3">{post.title}</h3>
                  <p className="text-visa-charcoal/70 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="flex items-center gap-1 text-xs text-visa-charcoal/60">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="text-visa-teal font-medium hover:text-visa-navy transition-colors inline-flex items-center gap-1">
                      Read More <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-visa-navy">All Articles</h2>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? 'bg-visa-navy text-white'
                      : 'bg-white text-visa-charcoal hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width="600"
                    height="400"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-visa-charcoal/60 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <time dateTime="2025-03-10">{post.date}</time>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <span className="inline-block bg-visa-teal/10 text-visa-teal text-sm px-3 py-1 rounded-full mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-bold text-visa-navy mb-3">{post.title}</h3>
                  <p className="text-visa-charcoal/70 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-xs text-visa-charcoal/60 bg-gray-50 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="text-visa-teal font-medium hover:text-visa-navy transition-colors text-sm inline-flex items-center gap-1">
                      Read <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="mt-16 bg-visa-navy rounded-2xl p-8 lg:p-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest immigration updates, visa changes, and expert advice delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-visa-gold"
                aria-label="Email address"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
