import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Heart, Plane, Briefcase, Users, Award, FileCheck, ArrowRight, Sparkles } from 'lucide-react';

const VisaGrid = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const visas = [
    {
      icon: Heart,
      title: 'Partner Visas',
      subclasses: 'Subclasses 820/801, 309/100',
      description: 'Unite with your loved one in Australia through our comprehensive partner visa services.',
      link: '/visas/partner-visa-820',
      featured: true,
    },
    {
      icon: Plane,
      title: 'Visitor Visa 600',
      subclasses: 'Tourist & Business streams',
      description: 'Explore Australia for leisure or business with our visitor visa assistance.',
      link: '/visas/visitor-visa-600',
      featured: false,
    },
    {
      icon: Briefcase,
      title: 'Employer Sponsorship',
      subclasses: 'Subclasses 482, 186',
      description: 'Secure skilled workers for your business or find employer-sponsored opportunities.',
      link: '/visas/employer-nomination-186',
      featured: false,
    },
    {
      icon: Users,
      title: 'Parent Visa 103',
      subclasses: 'Contributory & standard streams',
      description: 'Bring your parents to Australia and reunite your family.',
      link: '/visas/parent-visa-103',
      featured: false,
    },
    {
      icon: FileCheck,
      title: 'Skills Assessment',
      subclasses: 'For skilled migration applications',
      description: 'Get your qualifications recognized for Australian skilled migration.',
      link: '/services/skills-assessments',
      featured: false,
    },
    {
      icon: Award,
      title: 'Australian Citizenship',
      subclasses: 'By conferral or descent',
      description: 'Take the final step in your migration journey and become an Australian citizen.',
      link: '/services/citizenship',
      featured: true,
    },
  ];

  return (
    <section id="services" ref={sectionRef} className="section-padding t-bg-body relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="absolute top-0 right-0 w-96 h-96 t-bg-gold-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 t-bg-teal-10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-visa-gold" />
            <span className="t-text-secondary text-sm font-medium">Comprehensive Services</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold t-text-primary mb-4">
            Popular <span className="text-gradient-gold">Visa Services</span>
          </h2>
          <p className="t-text-muted max-w-2xl mx-auto">
            Comprehensive immigration services covering all major visa categories for Australia.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {visas.map((visa, index) => (
            <Link
              key={index}
              to={visa.link}
              className={`glass-card p-6 cursor-pointer transition-all duration-700 group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } ${visa.featured ? 'md:col-span-2 lg:col-span-1 t-border-gold-20' : ''}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl t-bg-teal-10 border t-border-teal-20 flex items-center justify-center group-hover:t-bg-teal-20 transition-colors">
                  <visa.icon className="w-6 h-6 text-visa-teal" />
                </div>
                {visa.featured && (
                  <span className="px-3 py-1 rounded-full t-bg-gold-20 text-visa-gold text-xs font-medium">
                    Popular
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold t-text-primary mb-1">{visa.title}</h3>
              <p className="text-visa-gold text-sm font-medium mb-3">{visa.subclasses}</p>
              <p className="t-text-muted text-sm mb-4 leading-relaxed">{visa.description}</p>
              <span className="inline-flex items-center gap-1 text-visa-teal font-medium text-sm group-hover:gap-2 transition-all">
                Learn More <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>

        {/* Additional Services Link */}
        <div className="text-center mt-12">
          <p className="t-text-faint mb-4">
            We also assist with Skilled, Student, Training, and Protection visas
          </p>
          <Link to="/visas" className="inline-flex items-center gap-2 text-visa-gold font-semibold hover:gap-3 transition-all group">
            View All Services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VisaGrid;
