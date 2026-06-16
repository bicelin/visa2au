import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Heart, Plane, Briefcase, Users, Award, FileCheck, ArrowRight } from 'lucide-react';

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
      description: 'Unite with your loved one in Australia',
      link: '/visas/partner-visa-820',
    },
    {
      icon: Plane,
      title: 'Visitor Visa 600',
      subclasses: 'Tourist & Business streams',
      description: 'Explore Australia for leisure or business',
      link: '/visas/visitor-visa-600',
    },
    {
      icon: Briefcase,
      title: 'Employer Sponsorship',
      subclasses: 'Subclasses 482, 186',
      description: 'Secure skilled workers for your business',
      link: '/visas/employer-nomination-186',
    },
    {
      icon: Users,
      title: 'Parent Visa 103',
      subclasses: 'Contributory & standard streams',
      description: 'Bring your parents to Australia',
      link: '/visas/parent-visa-103',
    },
    {
      icon: FileCheck,
      title: 'Skills Assessment',
      subclasses: 'For skilled migration applications',
      description: 'Get your qualifications recognized',
      link: '/services/skills-assessments',
    },
    {
      icon: Award,
      title: 'Australian Citizenship',
      subclasses: 'By conferral or descent',
      description: 'Become an Australian citizen',
      link: '/services/citizenship',
    },
  ];

  return (
    <section id="services" ref={sectionRef} className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-visa-navy mb-4">
            Popular Visa Services
          </h2>
          <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
            Comprehensive immigration services covering all major visa categories for Australia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visas.map((visa, index) => (
            <Link
              key={index}
              to={visa.link}
              className={`bg-gray-50 rounded-xl p-6 border border-gray-100 card-hover cursor-pointer transition-all duration-700 group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-visa-teal/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-visa-teal/20 transition-colors">
                <visa.icon className="w-6 h-6 text-visa-teal" />
              </div>
              <h3 className="text-lg font-bold text-visa-navy mb-1">{visa.title}</h3>
              <p className="text-visa-gold text-sm font-medium mb-2">{visa.subclasses}</p>
              <p className="text-visa-charcoal/60 text-sm mb-4">{visa.description}</p>
              <span className="inline-flex items-center gap-1 text-visa-teal font-medium text-sm group-hover:gap-2 transition-all">
                Learn More <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>

        {/* Additional Services Link */}
        <div className="text-center mt-10">
          <p className="text-visa-charcoal/70 mb-4">
            We also assist with Skilled, Student, Training, and Protection visas
          </p>
          <Link to="/visas" className="inline-flex items-center gap-2 text-visa-teal font-semibold hover:gap-3 transition-all">
            View All Services
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VisaGrid;