import { useEffect, useRef, useState } from 'react';
import { Shield, Users, Lightbulb, BookOpen, CheckCircle } from 'lucide-react';

const WhyChooseUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: Shield, title: 'Proven Track Record', description: 'Thousands of successful visa applications and satisfied clients over 20+ years.' },
    { icon: Users, title: 'Qualified Professionals', description: 'MARN registered migration agents with extensive experience in Australian immigration law.' },
    { icon: Lightbulb, title: 'Personal Attention', description: 'Dedicated case management tailored to your unique situation and migration goals.' },
    { icon: BookOpen, title: 'Deep Expertise', description: 'Comprehensive knowledge of Australian migration law, regulations, and immigration policies.' },
  ];

  return (
    <section ref={sectionRef} className="section-padding t-bg-body relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden="true" />
      <div className="absolute top-1/4 left-0 w-96 h-96 t-bg-gold-10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 t-bg-teal-10 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Photo Collage */}
          <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
                <div className="relative overflow-hidden rounded-2xl group">
                  <img
                    src="/imgs/hero-coast.jpg"
                    alt="Australian coastline at golden hour with Aboriginal rock art"
                    className="w-full h-44 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-700"
                    width="400"
                    height="208"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-visa-navy/60 to-transparent" />
                </div>
                <div className="relative overflow-hidden rounded-2xl group">
                  <img
                    src="/imgs/hero-rainforest.jpg"
                    alt="Daintree Rainforest with Aboriginal hand stencil paintings"
                    className="w-full h-56 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-700"
                    width="400"
                    height="288"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-visa-navy/60 to-transparent" />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8">
                <div className="relative overflow-hidden rounded-2xl group">
                  <img
                    src="/imgs/hero-sydney.jpg"
                    alt="Sydney Opera House and Harbour Bridge at twilight"
                    className="w-full h-56 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-700"
                    width="400"
                    height="288"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-visa-navy/60 to-transparent" />
                </div>
                <div className="relative overflow-hidden rounded-2xl group">
                  <img
                    src="/imgs/hero-reef.jpg"
                    alt="Great Barrier Reef with Aboriginal dot-art turtle"
                    className="w-full h-44 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-700"
                    width="400"
                    height="208"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-visa-navy/60 to-transparent" />
                </div>
              </div>
            </div>
            {/* Badge overlay */}
            <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-6 glass-panel p-4 sm:p-6 t-border-gold-20">
              <div className="text-3xl sm:text-4xl font-bold text-gradient-gold">20+</div>
              <div className="t-text-muted text-sm">Years of Excellence</div>
            </div>
          </div>

          {/* Content */}
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4">
              <CheckCircle className="w-4 h-4 text-visa-gold" aria-hidden="true" />
              <span className="t-text-secondary text-sm font-medium">Why Visa2AU</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold t-text-primary mb-4">
              Why Choose <span className="text-gradient-gold">Visa2AU?</span>
            </h2>
            <p className="t-text-muted mb-8 leading-relaxed">
              We combine deep expertise with personalised service to guide you through Australia&apos;s complex migration system. Our team of registered professionals ensures every case receives the attention it deserves.
            </p>

            <div className="space-y-5">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="shrink-0 w-11 h-11 rounded-xl t-bg-gold-10 border t-border-gold-20 flex items-center justify-center group-hover:t-bg-gold-20 transition-colors">
                    <feature.icon className="w-5 h-5 text-visa-gold" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold t-text-primary mb-1">{feature.title}</h3>
                    <p className="t-text-faint text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                <img src="/imgs/natasha.jpg" alt="Natasha Arens" className="w-9 h-9 rounded-full border-2 t-border object-cover" loading="lazy" />
                <img src="/imgs/sergey.jpg" alt="Sergey Vinnichenko" className="w-9 h-9 rounded-full border-2 t-border object-cover" loading="lazy" />
                <div className="w-9 h-9 rounded-full t-bg-teal-20 border-2 t-border flex items-center justify-center">
                  <span className="text-visa-teal text-xs font-bold">DK</span>
                </div>
                <div className="w-9 h-9 rounded-full t-bg-gold-20 border-2 t-border flex items-center justify-center">
                  <span className="text-visa-gold text-xs font-bold">F</span>
                </div>
              </div>
              <p className="t-text-muted text-sm">
                Join <span className="text-visa-gold font-semibold">2,000+</span> satisfied clients
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
