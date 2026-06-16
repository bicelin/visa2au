import { useEffect, useRef, useState } from 'react';
import { FileText, Building2, LifeBuoy } from 'lucide-react';

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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const cards = [
    {
      icon: FileText,
      title: 'I Need a Visa',
      description: 'From partner visas to skilled migration, we guide you through every step of your journey to Australia.',
      link: '#services',
      linkText: 'Explore Visa Options',
    },
    {
      icon: Building2,
      title: 'I Need to Sponsor Staff',
      description: 'Employer-sponsored visas for businesses of all sizes. Help your team get the skilled workers they need.',
      link: '#services',
      linkText: 'View Sponsorship Options',
    },
    {
      icon: LifeBuoy,
      title: 'I Need Help with a Complex Matter',
      description: 'Refusals, appeals, and complicated cases welcome. We have the expertise to handle challenging situations.',
      link: '#contact',
      linkText: 'Get Expert Help',
    },
  ];

  return (
    <section ref={sectionRef} className="section-padding bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-visa-navy mb-4">
            How Can We Help You?
          </h2>
          <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
            Whether you're an individual, family, or employer, we have the expertise to guide you through Australia's migration system.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 shadow-lg card-hover cursor-pointer group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="w-16 h-16 bg-visa-teal/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-visa-teal/20 transition-colors">
                <card.icon className="w-8 h-8 text-visa-teal" />
              </div>
              <h3 className="text-xl font-bold text-visa-navy mb-3">{card.title}</h3>
              <p className="text-visa-charcoal/70 mb-6">{card.description}</p>
              <a
                href={card.link}
                className="inline-flex items-center gap-2 text-visa-teal font-semibold hover:gap-3 transition-all"
              >
                {card.linkText}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceCards;
