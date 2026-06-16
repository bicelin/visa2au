import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Heart, Briefcase, Building2, ArrowRight } from 'lucide-react';

const AudienceCards = () => {
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

  const audiences = [
    {
      icon: User,
      title: 'Individuals',
      description: 'Skilled migration, student visas, working holiday visas, and visitor visas for those seeking opportunities in Australia.',
      link: '/visas/skilled-independent-189',
      color: 'visa-teal',
    },
    {
      icon: Heart,
      title: 'Families',
      description: 'Partner visas, parent visas, prospective marriage visas, and family reunification services to bring your loved ones together.',
      link: '/visas/partner-visa-820',
      color: 'visa-gold',
    },
    {
      icon: Building2,
      title: 'Employers',
      description: 'Employer sponsorship, DAMA arrangements, labour agreements, and skilled nominations for Australian businesses.',
      link: '/employers',
      color: 'visa-teal',
    },
    {
      icon: Briefcase,
      title: 'Skilled Workers',
      description: 'Skills assessments, points-tested visas (189/190), employer-sponsored pathways (482/494/186), and permanent residency options.',
      link: '/visas/skills-in-demand-482',
      color: 'visa-gold',
    },
  ];

  return (
    <section ref={sectionRef} className="section-padding t-bg-body relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-96 h-96 t-bg-gold-10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 t-bg-teal-10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold t-text-primary mb-4">
            Who We <span className="text-gradient-gold">Help</span>
          </h2>
          <p className="t-text-muted max-w-2xl mx-auto">
            Tailored immigration solutions for every situation. Whether you are an individual, family, employer, or skilled worker, we have the expertise to guide you.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {audiences.map((audience, index) => (
            <Link
              key={index}
              to={audience.link}
              className={`glass-card p-8 group transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-${audience.color}/10 border border-${audience.color}/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <audience.icon className={`w-7 h-7 text-${audience.color}`} />
              </div>
              <h3 className="text-xl font-bold t-text-primary mb-3">{audience.title}</h3>
              <p className="t-text-muted text-sm mb-6 leading-relaxed">{audience.description}</p>
              <span className="inline-flex items-center gap-2 text-visa-gold font-medium text-sm group-hover:gap-3 transition-all">
                Learn More <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceCards;
