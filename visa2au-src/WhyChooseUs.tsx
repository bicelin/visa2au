import { useEffect, useRef, useState } from 'react';
import { CheckCircle, Shield, Users, Lightbulb, BookOpen } from 'lucide-react';

const WhyChooseUs = () => {
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

  const features = [
    {
      icon: Shield,
      title: 'Proven Track Record',
      description: 'Thousands of successful visa applications and satisfied clients over 20+ years.',
    },
    {
      icon: Users,
      title: 'Qualified Professionals',
      description: 'MARN registered migration agents with extensive experience in Australian immigration law.',
    },
    {
      icon: Lightbulb,
      title: 'Personal Attention',
      description: 'Dedicated case management tailored to your unique situation and migration goals.',
    },
    {
      icon: BookOpen,
      title: 'Deep Expertise',
      description: 'Comprehensive knowledge of Australian migration law, regulations, and immigration policies.',
    },
  ];

  return (
    <section id="why-choose-us" ref={sectionRef} className="section-padding bg-visa-navy">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Collage */}
          <div
            className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="/imgs/uluru.jpg"
                  alt="Uluru Australian Outback at sunrise - Iconic Australian landmark"
                  className="rounded-2xl shadow-2xl w-full h-48 object-cover"
                  width="600"
                  height="192"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="/imgs/australian-beach.jpg"
                  alt="Australian Beach with turquoise waters and golden sand"
                  className="rounded-2xl shadow-2xl w-full h-64 object-cover"
                  width="600"
                  height="256"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img
                  src="/imgs/melbourne.jpg"
                  alt="Melbourne city skyline - Modern Australian city"
                  className="rounded-2xl shadow-2xl w-full h-64 object-cover"
                  width="600"
                  height="256"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="/imgs/kangaroo.jpg"
                  alt="Australian wildlife kangaroo in natural habitat"
                  className="rounded-2xl shadow-2xl w-full h-48 object-cover"
                  width="600"
                  height="192"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            {/* Overlay Badge */}
            <div className="absolute -bottom-6 -right-6 bg-visa-gold text-white p-6 rounded-2xl shadow-xl">
              <div className="text-3xl font-bold">20+</div>
              <div className="text-sm">Years of Excellence</div>
            </div>
          </div>

          {/* Content */}
          <div
            className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Why Choose Visa2AU?
            </h2>
            <p className="text-white/70 mb-8">
              We combine deep expertise with personalized service to guide you through Australia's complex migration system.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-visa-gold/20 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-visa-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-white/60 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-visa-teal/30 border-2 border-visa-navy flex items-center justify-center"
                  >
                    <Users className="w-5 h-5 text-white" />
                  </div>
                ))}
              </div>
              <p className="text-white/70 text-sm">
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
