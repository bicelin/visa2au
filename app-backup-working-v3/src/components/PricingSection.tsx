import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, ArrowRight, Phone } from 'lucide-react';

const PricingSection = () => {
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

  const plans = [
    {
      name: 'Initial Consultation',
      price: '$330',
      period: 'AUD/hour',
      description: 'Get started with a professional assessment of your visa options.',
      features: [
        '1-hour consultation',
        'Visa eligibility assessment',
        'Migration pathway advice',
        'Document checklist',
        'Fee quote for services',
      ],
      cta: 'Book Now',
      link: '/contact',
      highlighted: false,
    },
    {
      name: 'Partner Visa',
      price: 'From $3,300',
      period: 'AUD',
      description: 'Comprehensive support for partner visa applications (820/801, 309/100).',
      features: [
        'Full application preparation',
        'Document review & organization',
        'Relationship evidence guidance',
        'Department correspondence',
        'Ongoing case management',
      ],
      cta: 'Learn More',
      link: '/visas/partner-visa-820',
      highlighted: true,
    },
    {
      name: 'Employer Sponsorship',
      price: 'From $4,400',
      period: 'AUD',
      description: 'End-to-end employer sponsorship services (482, 186 visas).',
      features: [
        'Sponsorship application',
        'Nomination preparation',
        'Visa application lodgement',
        'Compliance guidance',
        'Business consultation',
      ],
      cta: 'Learn More',
      link: '/visas/employer-nomination-186',
      highlighted: false,
    },
  ];

  return (
    <section ref={sectionRef} className="section-padding t-bg-body relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-visa-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-visa-teal/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-visa-gold" />
            <span className="t-text-primary text-sm font-medium">Transparent Pricing</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold t-text-primary mb-4">
            Simple, <span className="text-gradient-gold">Transparent Pricing</span>
          </h2>
          <p className="t-text-muted max-w-2xl mx-auto">
            No hidden fees. Get a clear understanding of costs upfront with our transparent pricing structure.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1 rounded-full bg-gradient-gold text-visa-navy text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <div className={`glass-card p-8 h-full flex flex-col ${plan.highlighted ? 'border-visa-gold/40' : ''}`}>
                <div className="mb-6">
                  <h3 className="text-xl font-bold t-text-primary mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-bold text-gradient-gold`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="t-text-faint text-sm">{plan.period}</span>
                    )}
                  </div>
                  <p className="t-text-faint text-sm mt-3">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 t-text-secondary text-sm">
                      <div className="w-5 h-5 rounded-full bg-visa-gold/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-visa-gold" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.link}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-center flex items-center justify-center gap-2 transition-all ${
                    plan.highlighted
                      ? 'btn-primary'
                      : 'border t-border-hover t-text-primary hover:t-bg-input'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="text-center mt-12">
          <p className="t-text-ghost text-sm max-w-2xl mx-auto">
            Prices exclude Department of Home Affairs visa application charges and other government fees.
            Contact us for a detailed quote tailored to your specific situation.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/pricing" className="text-visa-gold hover:text-visa-goldLight font-medium flex items-center gap-2">
              View Full Pricing
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="t-text-ghost hidden sm:block">|</span>
            <a href="tel:+61291362462" className="t-text-muted hover:text-visa-gold flex items-center gap-2 transition-colors">
              <Phone className="w-4 h-4" />
              Call for Custom Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
