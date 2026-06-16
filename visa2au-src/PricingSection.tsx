import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, AlertCircle, Users, Briefcase, Heart, Globe, GraduationCap, Shield } from 'lucide-react';

const PricingSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const sectionRef = useRef(null);
  const carouselRef = useRef<HTMLDivElement>(null);

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

  const pricingCards = [
    {
      icon: Users,
      title: 'Consultation',
      price: 'A$330',
      period: '1 hour',
      description: 'Comprehensive visa assessment',
      features: [
        'Eligibility assessment',
        'Visa options discussion',
        'Document checklist',
        'Strategy recommendation',
      ],
      highlight: false,
      badge: null,
      link: '/contact',
    },
    {
      icon: Globe,
      title: 'Visitor Visa 600',
      price: 'from A$880',
      period: 'indicative',
      description: 'Tourist and business visitor visas',
      features: [
        'Application preparation',
        'Document review',
        'Lodgement service',
        'Updates & follow-up',
      ],
      highlight: true,
      badge: 'POPULAR',
      link: '/visas/visitor-visa-600',
    },
    {
      icon: Heart,
      title: 'Partner Visas',
      price: 'from A$5,500',
      period: 'indicative',
      description: 'Onshore (820/801) & offshore (309/100)',
      features: [
        'Complete case management',
        'Relationship documentation',
        'Immigration interviews',
        'Permanent residency pathway',
      ],
      highlight: false,
      badge: null,
      link: '/visas/partner-visa-820',
    },
    {
      icon: Briefcase,
      title: 'Employer 482/186',
      price: 'from A$3,300',
      period: 'indicative',
      description: 'Employer sponsorship & nomination',
      features: [
        'Sponsorship application',
        'Nomination support',
        'Visa lodgement',
        'Compliance advice',
      ],
      highlight: false,
      badge: 'EMPLOYER',
      link: '/visas/employer-nomination-186',
    },
    {
      icon: Shield,
      title: 'Parent Visa 103',
      price: 'from A$5,500',
      period: 'indicative',
      description: 'Parent migration pathway',
      features: [
        'Eligibility assessment',
        'Application preparation',
        'Document review',
        'Lodgement support',
      ],
      highlight: false,
      badge: null,
      link: '/visas/parent-visa-103',
    },
    {
      icon: GraduationCap,
      title: 'Skills Assessment',
      price: 'from A$3,300',
      period: 'indicative',
      description: 'Professional migration assessment',
      features: [
        'Skills evaluation',
        'Qualification verification',
        'Experience documentation',
        'Assessment submission',
      ],
      highlight: false,
      badge: null,
      link: '/services/skills-assessments',
    },
  ];

  const checkScrollPosition = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      return () => {
        carousel.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 340;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="pricing" ref={sectionRef} className="section-padding bg-gray-50" aria-labelledby="pricing-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 id="pricing-heading" className="text-3xl lg:text-4xl font-bold text-visa-navy mb-4">
            Transparent Pricing
          </h2>
          <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
            Clear, upfront fees in Australian Dollars (AUD) with no hidden costs. Scroll to explore all our services or contact us for a detailed quote.
          </p>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="hidden md:flex justify-end gap-2 mb-4 pr-4">
          <button
            onClick={() => scroll('left')}
            className={`p-3 rounded-full transition-all ${
              canScrollLeft
                ? 'bg-visa-navy text-white hover:bg-visa-navyDark shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Scroll left"
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className={`p-3 rounded-full transition-all ${
              canScrollRight
                ? 'bg-visa-navy text-white hover:bg-visa-navyDark shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Scroll right"
            disabled={!canScrollRight}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="md:hidden text-center mb-4">
          <p className="text-sm text-visa-charcoal/60 flex items-center justify-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Scroll to explore
            <ChevronRight className="w-4 h-4" />
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Carousel */}
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* Left padding spacer for centering first card */}
            <div className="flex-shrink-0 w-[calc((100vw-1200px)/2)] min-[320px]:w-4 min-[640px]:w-8 hidden lg:block" />

            {pricingCards.map((card, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-[300px] snap-center rounded-2xl p-6 transition-all duration-700 ${
                  card.highlight
                    ? 'bg-visa-navy text-white shadow-2xl ring-2 ring-visa-gold'
                    : 'bg-white text-visa-charcoal shadow-lg card-hover'
                } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Badge */}
                {card.badge && (
                  <div className={`text-xs font-bold px-3 py-1 rounded-full inline-block mb-3 ${
                    card.highlight
                      ? 'bg-visa-gold text-white'
                      : 'bg-visa-teal/10 text-visa-teal'
                  }`}>
                    {card.badge}
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  card.highlight
                    ? 'bg-visa-gold/20'
                    : 'bg-visa-navy/10'
                }`}>
                  <card.icon className={`w-6 h-6 ${card.highlight ? 'text-visa-gold' : 'text-visa-navy'}`} />
                </div>

                {/* Title */}
                <h3 className={`text-lg font-bold mb-2 ${card.highlight ? 'text-white' : 'text-visa-navy'}`}>
                  {card.title}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-3xl font-bold ${card.highlight ? 'text-visa-gold' : 'text-visa-navy'}`}>
                    {card.price}
                  </span>
                  <span className={`text-xs ${card.highlight ? 'text-white/60' : 'text-visa-charcoal/60'}`}>
                    {card.period}
                  </span>
                </div>

                {/* AUD Indicator */}
                <div className={`text-xs mb-3 ${card.highlight ? 'text-white/50' : 'text-visa-charcoal/50'}`}>
                  (AUD)
                </div>

                {/* Description */}
                <p className={`text-sm mb-4 ${card.highlight ? 'text-white/70' : 'text-visa-charcoal/60'}`}>
                  {card.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {card.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${card.highlight ? 'text-visa-gold' : 'text-visa-teal'}`} />
                      <span className={`text-sm ${card.highlight ? 'text-white/90' : 'text-visa-charcoal/80'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  to={card.link}
                  className={`block text-center py-3 rounded-xl font-semibold transition-all text-sm ${
                    card.highlight
                      ? 'bg-visa-gold text-white hover:bg-visa-goldLight'
                      : 'bg-visa-navy text-white hover:bg-visa-navyDark'
                  }`}
                >
                  Learn More
                </Link>
              </div>
            ))}

            {/* Right padding spacer for symmetry */}
            <div className="flex-shrink-0 w-[calc((100vw-1200px)/2)] min-[320px]:w-4 min-[640px]:w-8 hidden lg:block" />
          </div>

          {/* Gradient fade indicators for scroll */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none hidden md:block" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none hidden md:block" />
        </div>

        {/* Mobile Scroll Dots */}
        <div className="flex justify-center gap-2 mt-6 md:hidden">
          {pricingCards.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === 0 ? 'bg-visa-navy w-4' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 max-w-3xl mx-auto mt-12 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> All fees are quoted in Australian Dollars (AUD) and are indicative. Final costs may vary based on individual circumstances, visa complexity, and government fees. Contact us for an accurate quote for your specific case.
          </p>
        </div>

        {/* Additional Services Note */}
        <div className="text-center mt-8">
          <p className="text-visa-charcoal/70 mb-2">
            Also available: Citizenship applications, ART/Refusal appeals, and complex migration matters.
          </p>
          <Link to="/services/visa-refusals" className="inline-flex items-center gap-2 text-visa-teal font-semibold hover:text-visa-navy transition-colors">
            View All Services
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default PricingSection;