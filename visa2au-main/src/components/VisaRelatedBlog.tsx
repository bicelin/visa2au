import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, BookOpen, Star } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

interface VisaRelatedBlogProps {
  title?: string;
  subtitle?: string;
  filterTags: string[];
  maxPosts?: number;
  showFeatured?: boolean;
}

const blogPosts: BlogPost[] = [
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
  {
    id: 7,
    title: 'Employer Nomination 186: Direct Entry Stream Explained',
    excerpt: 'Learn about the Employer Nomination Scheme visa for skilled workers nominated by Australian employers.',
    category: 'Work Visa',
    tags: ['186', 'Employer Nomination', 'Direct Entry', 'Skilled Worker'],
    date: 'February 10, 2025',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop',
    featured: false,
  },
  {
    id: 8,
    title: 'Partner Visa 309/100: Offshore Pathway to Australian Residency',
    excerpt: 'Complete guide to the offshore partner visa process for those applying from outside Australia.',
    category: 'Partner Visa',
    tags: ['Partner Visa', '309', '100', 'Offshore'],
    date: 'January 25, 2025',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=400&fit=crop',
    featured: false,
  },
];

const VisaRelatedBlog = ({
  title = 'Related Articles & News',
  subtitle = 'Stay informed with the latest updates and expert insights on Australian immigration',
  filterTags,
  maxPosts = 3,
  showFeatured = false,
}: VisaRelatedBlogProps) => {
  // Filter posts by matching tags
  const filteredPosts = blogPosts.filter((post) =>
    post.tags.some((tag) => filterTags.includes(tag))
  );

  // Get featured posts first if enabled
  const postsToShow = showFeatured
    ? [...filteredPosts.filter((p) => p.featured), ...filteredPosts.filter((p) => !p.featured)].slice(0, maxPosts)
    : filteredPosts.slice(0, maxPosts);

  // If no matching posts, show general posts
  const displayPosts = postsToShow.length > 0 ? postsToShow : blogPosts.slice(0, maxPosts);

  if (displayPosts.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-visa-gold" />
            <span className="text-visa-gold font-semibold text-sm uppercase tracking-wider">Knowledge Hub</span>
          </div>
          <h2 className="text-3xl font-bold text-visa-navy mb-4">{title}</h2>
          <p className="text-visa-charcoal/70 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Blog Posts Grid */}
        <div className={`grid ${displayPosts.length === 1 ? 'md:grid-cols-1 max-w-2xl mx-auto' : displayPosts.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
          {displayPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  width="600"
                  height="400"
                />
                {post.featured && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-visa-gold text-visa-navy text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </span>
                  </div>
                )}
                <div className="absolute bottom-3 right-3">
                  <span className="bg-visa-navy/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-visa-charcoal/60 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-visa-navy mb-3 line-clamp-2 group-hover:text-visa-teal transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-visa-charcoal/70 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-xs text-visa-charcoal/60 bg-gray-50 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-visa-teal font-medium text-sm hover:text-visa-navy transition-colors"
                >
                  Read Article
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-visa-navy text-white px-6 py-3 rounded-xl font-medium hover:bg-visa-navyDark transition-colors"
          >
            View All Articles
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VisaRelatedBlog;
