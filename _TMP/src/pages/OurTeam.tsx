import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Check, ArrowRight, Award, Users, MapPin, Phone, Mail, Clock, Star, Target, Building2, Globe, Shield, Heart, ChevronDown } from 'lucide-react';
import Layout from '../components/Layout';

// Figma Design System Tokens - These enable Figma plugin integration
export const designTokens = {
  colors: {
    navy: '#1e3a5f',
    navyDark: '#152a45',
    gold: '#c9a227',
    goldLight: '#d4b13a',
    teal: '#2d8a8a',
    tealLight: '#3da8a8',
    charcoal: '#333333',
    success: '#059669',
  },
  spacing: {
    sectionPadding: 'py-16 md:py-20 lg:py-24',
    containerPadding: 'px-4',
  },
  typography: {
    heading1: 'text-4xl lg:text-5xl font-bold',
    heading2: 'text-3xl font-bold',
    heading3: 'text-xl font-bold',
  },
};

// Section IDs for navigation
const sectionIds = {
  ourStory: 'our-story',
  whyChooseUs: 'why-choose-us',
  ourTeam: 'our-team',
  nationalCoverage: 'national-coverage',
  ourExpertise: 'our-expertise',
  registeredAgents: 'registered-agents',
  contact: 'contact',
};

const OurTeam = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const team = [
    {
      name: 'Natasha Arens',
      title: 'Principal Migration Agent',
      marn: '0534230',
      bio: 'Natasha has over 20 years of experience in Australian migration law. She specializes in partner visas, employer sponsorship, and complex case management. Based in Sydney with regular consultations in Brisbane and Cairns.',
      expertise: ['Partner Visas', 'Employer Sponsorship', 'Complex Cases', 'ART Appeals'],
      locations: ['Sydney', 'Brisbane', 'Cairns'],
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    },
    {
      name: 'Sergey Vinnichenko',
      title: 'Senior Migration Agent',
      marn: '2418663',
      bio: 'Sergey brings 10+ years of migration experience with expertise in skilled migration, visitor visas, and citizenship applications. Available for consultations in Melbourne and Sydney.',
      expertise: ['Skilled Migration', 'Visitor Visas', 'Citizenship', 'Skills Assessments'],
      locations: ['Melbourne', 'Sydney'],
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    },
  ];

  const cities = [
    { name: 'Sydney', description: 'Head office and primary consultation location', services: 'Full range of visa services' },
    { name: 'Melbourne', description: 'Victoria hub for skilled migrations', services: 'Skilled assessments & nominations' },
    { name: 'Brisbane', description: 'Queensland partner and family visas', services: 'Partner visas & parent applications' },
    { name: 'Cairns', description: 'Regional Queensland consultations', services: 'Regional sponsorship options' },
  ];

  const expertiseAreas = [
    { icon: Users, title: 'Partner & Family Visas', description: '820/801, 309/100, 300 Prospective Marriage, and Parent visas for family reunification.' },
    { icon: Target, title: 'Skilled Migration', description: 'Skills in Demand (482), Employer Nomination (186), and points-tested visas.' },
    { icon: Building2, title: 'Employer Services', description: 'Business sponsorship, labour market testing, and standard business sponsorship.' },
    { icon: Globe, title: 'Visitor Visas', description: 'Tourist and business visitor visas for short-term stays in Australia.' },
  ];

  const values = [
    { icon: Award, title: 'Expertise', description: 'Over 20 years of combined experience in Australian migration law' },
    { icon: Heart, title: 'Client Focus', description: 'Personalized service tailored to your unique circumstances' },
    { icon: Clock, title: 'Responsiveness', description: 'Quick turnaround times and proactive communication' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-visa-navy py-24 lg:py-32" data-figma-section="hero">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-visa-navy via-visa-navyDark to-visa-navy"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Our Team
            </h1>
            <p className="text-xl text-white/80 mb-6">
              Your trusted Australian immigration experts. Meet our team of registered migration agents committed to helping you achieve your Australian dreams.
            </p>
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              Get in Touch
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="bg-visa-navyDark sticky top-16 z-40 shadow-lg" data-figma-section="navigation">
        <div className="container mx-auto px-4">
          <nav className="flex flex-wrap justify-center gap-1 py-3" aria-label="Page sections">
            {[
              { id: sectionIds.ourStory, label: 'Our Story' },
              { id: sectionIds.whyChooseUs, label: 'Why Choose Us' },
              { id: sectionIds.ourTeam, label: 'Our Team' },
              { id: sectionIds.nationalCoverage, label: 'Coverage' },
              { id: sectionIds.ourExpertise, label: 'Expertise' },
              { id: sectionIds.registeredAgents, label: 'MARA' },
              { id: sectionIds.contact, label: 'Contact' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-white/80 hover:text-white text-sm px-3 py-1 rounded transition-colors hover:bg-white/10"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Our Story Section */}
      <section id={sectionIds.ourStory} className="section-padding bg-white" data-figma-section="our-story" data-figma-category="content">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-visa-navy mb-6">Our Story</h2>
              <p className="text-visa-charcoal/70 mb-4">
                Visa2AU was founded with a simple mission: to make Australian immigration accessible and understandable. We believe that everyone deserves the opportunity to build their future in Australia, whether they're coming for work, family, or a new beginning.
              </p>
              <p className="text-visa-charcoal/70 mb-4">
                Our team of registered migration agents brings decades of combined experience in all areas of Australian migration law. We've helped thousands of clients successfully obtain visas and build new lives in Australia.
              </p>
              <p className="text-visa-charcoal/70">
                Registered with the Migration Agents Registration Authority (MARA), we adhere to the highest professional standards and are committed to providing ethical, honest, and effective immigration services.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8" data-figma-element="values-card">
              <h3 className="text-xl font-bold text-visa-navy mb-6">Our Values</h3>
              <div className="space-y-6">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-visa-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-6 h-6 text-visa-teal" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-visa-navy mb-1">{value.title}</h4>
                      <p className="text-visa-charcoal/60 text-sm">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id={sectionIds.whyChooseUs} className="section-padding bg-gray-50" data-figma-section="why-choose-us" data-figma-category="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Why Choose Visa2AU?</h2>
            <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
              We're committed to providing exceptional immigration services backed by years of experience and a dedication to client success.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'MARA Registered', desc: 'All agents are registered with the Migration Agents Registration Authority', icon: Shield },
              { title: '20+ Years Experience', desc: 'Combined experience in Australian migration law', icon: Award },
              { title: 'Thousands Served', desc: 'Successfully helped thousands of clients obtain visas', icon: Users },
              { title: 'Personal Service', desc: 'Dedicated case managers for each client', icon: Heart },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center" data-figma-element="feature-card">
                <div className="w-14 h-14 bg-visa-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-visa-gold" />
                </div>
                <h3 className="font-semibold text-visa-navy mb-2">{item.title}</h3>
                <p className="text-visa-charcoal/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section id={sectionIds.ourTeam} className="section-padding bg-white" data-figma-section="team" data-figma-category="people">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Meet Our Team</h2>
            <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
              Our experienced team of registered migration agents is here to guide you through every step of your immigration journey.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg" data-figma-element="team-member">
                <div className="aspect-square bg-gray-200 relative">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" loading="lazy" width="400" height="400" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-visa-gold" />
                    <span className="text-sm text-visa-charcoal/60">MARN: {member.marn}</span>
                  </div>
                  <h3 className="text-xl font-bold text-visa-navy mb-1">{member.name}</h3>
                  <p className="text-visa-gold font-medium mb-4">{member.title}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-visa-teal" />
                    <div className="flex flex-wrap gap-2">
                      {member.locations.map((loc, i) => (
                        <span key={i} className="text-xs bg-visa-teal/10 text-visa-teal px-2 py-1 rounded-full">{loc}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-visa-charcoal/70 text-sm mb-4">{member.bio}</p>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs font-semibold text-visa-charcoal/60 uppercase tracking-wider mb-2">Areas of Expertise</p>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((exp, i) => (
                        <span key={i} className="text-xs bg-visa-navy/5 text-visa-navy px-2 py-1 rounded">{exp}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* National Coverage Section */}
      <section id={sectionIds.nationalCoverage} className="section-padding bg-gray-50" data-figma-section="coverage" data-figma-category="locations">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Nationwide Coverage</h2>
            <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
              We serve clients across Australia with consultations available in multiple cities. Remote services available nationwide.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {cities.map((city, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow" data-figma-element="city-card">
                <div className="w-12 h-12 bg-visa-navy/5 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-visa-navy" />
                </div>
                <h3 className="text-lg font-bold text-visa-navy mb-2">{city.name}</h3>
                <p className="text-sm text-visa-charcoal/70 mb-2">{city.description}</p>
                <p className="text-xs text-visa-gold font-medium">{city.services}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas of Expertise Section */}
      <section id={sectionIds.ourExpertise} className="section-padding bg-white" data-figma-section="expertise" data-figma-category="services">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Our Expertise</h2>
            <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
              Comprehensive immigration services backed by years of experience and in-depth knowledge of Australian migration law.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {expertiseAreas.map((area, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-visa-navy/5 transition-colors" data-figma-element="expertise-card">
                <div className="w-14 h-14 bg-visa-gold/10 rounded-xl flex items-center justify-center mb-4 text-visa-gold">
                  <area.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-visa-navy mb-3">{area.title}</h3>
                <p className="text-visa-charcoal/70 text-sm">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registered Migration Agents Section */}
      <section id={sectionIds.registeredAgents} className="section-padding bg-gray-50" data-figma-section="mara" data-figma-category="credentials">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Registered Migration Agents</h2>
            <p className="text-visa-charcoal/70 mb-6">
              All Visa2AU migration agents are registered with the Migration Agents Registration Authority (MARA). This registration ensures we adhere to the highest professional and ethical standards in immigration services.
            </p>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100" data-figma-element="mara-info">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Shield className="w-12 h-12 text-visa-teal" />
                <div className="text-left">
                  <p className="font-bold text-visa-navy">Migration Agents Registration Authority</p>
                  <p className="text-sm text-visa-charcoal/60">Official Australian Government Body</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                {['Professional indemnity insurance', 'Code of conduct compliance', 'Ongoing professional development'].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-visa-teal" />
                    <span className="text-visa-charcoal text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id={sectionIds.contact} className="section-padding bg-white" data-figma-section="contact" data-figma-category="contact">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-visa-navy mb-6">Contact Us</h2>
              <p className="text-visa-charcoal/70 mb-6">
                We're here to help. Contact our team for a free initial consultation about your immigration needs.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-visa-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-visa-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-visa-navy">Address</h3>
                    <p className="text-visa-charcoal/60 text-sm">Level 17, 1 Denison Street<br />North Sydney NSW 2060</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-visa-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-visa-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-visa-navy">Phone (Voicemail)</h3>
                    <p className="text-visa-charcoal/60 text-sm">+61 2 9136 2462</p>
                    <p className="text-xs text-visa-gold mt-1">Note: This is a voicemail service. For immediate assistance, please email us.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-visa-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-visa-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-visa-navy">Email</h3>
                    <a href="mailto:info@visa2.au" className="text-visa-teal hover:text-visa-navy transition-colors">info@visa2.au</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-visa-navy rounded-2xl p-8 text-white" data-figma-element="contact-form-placeholder">
              <h3 className="text-xl font-bold mb-6">Office Hours</h3>
              <div className="space-y-3 text-white/80">
                <p>Monday - Friday: 9:00 AM - 5:30 PM</p>
                <p>Saturday: By appointment</p>
                <p>Sunday: Closed</p>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-white/60 text-sm mb-4">
                  All consultations are by appointment only. Contact us to schedule your free initial consultation.
                </p>
                <Link to="/contact" className="btn-primary inline-flex items-center gap-2 w-full justify-center">
                  Book Consultation
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="section-padding bg-gray-50" data-figma-section="quick-links">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-visa-navy mb-8 text-center">Explore Our Services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { title: 'Partner Visas', href: '/visas/partner-visa-820', desc: '820/801, 309/100 pathways' },
              { title: 'Work Visas', href: '/visas/skills-in-demand-482', desc: '482, 186 employer sponsored' },
              { title: 'Visitor Visas', href: '/visas/visitor-visa-600', desc: 'Tourist and business streams' },
              { title: 'Citizenship', href: '/services/citizenship', desc: 'Become an Australian citizen' },
            ].map((link, index) => (
              <Link key={index} to={link.href} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-visa-gold hover:shadow-md transition-all group" data-figma-element="quick-link">
                <h3 className="font-semibold text-visa-navy group-hover:text-visa-gold transition-colors">{link.title}</h3>
                <p className="text-sm text-visa-charcoal/60">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-visa-navy" data-figma-section="cta">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Contact us today for a free initial assessment of your immigration needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              Book Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/visas" className="btn-outline border-white text-white hover:bg-white hover:text-visa-navy inline-flex items-center gap-2">
              View All Visas
              <ChevronDown className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OurTeam;
