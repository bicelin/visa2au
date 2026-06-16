import { useEffect, useRef, useState } from 'react';
import { Star, Quote, Flag } from 'lucide-react';

const Testimonials = () => {
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

  const testimonials = [
    {
      name: 'Michael T.',
      location: 'United Kingdom',
      visaType: 'Partner Visa 820',
      rating: 5,
      quote:
        'Visa2AU made the entire process stress-free. Natasha was incredibly knowledgeable and always available to answer our questions. We received our permanent residency after just 14 months.',
    },
    {
      name: 'Priya S.',
      location: 'India',
      visaType: 'Employer Nomination 186',
      rating: 5,
      quote:
        'Sergey and his team handled our employer-sponsored visa with professionalism. The process was smooth and we are now living our Australian dream. Highly recommended!',
    },
    {
      name: 'James and Lin W.',
      location: 'China',
      visaType: 'Visitor Visa 600',
      rating: 5,
      quote:
        'We were initially worried about our visitor visa application due to previous refusals. Visa2AU addressed all concerns and we finally got approved. Thank you!',
    },
  ];

  return (
    <section ref={sectionRef} className="section-padding t-bg-body relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="absolute top-0 left-1/3 w-96 h-96 t-bg-gold-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 t-bg-teal-10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4">
            <Star className="w-4 h-4 text-visa-gold fill-visa-gold" />
            <span className="t-text-secondary text-sm font-medium">Client Reviews</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold t-text-primary mb-4">
            What Our <span className="text-gradient-gold">Clients Say</span>
          </h2>
          <p className="t-text-muted max-w-2xl mx-auto">
            Read about the experiences of clients who successfully obtained their Australian visas with our help.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`glass-card p-8 transition-all duration-700 hover:t-border-gold-20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Quote Icon */}
              <div className="w-12 h-12 rounded-xl t-bg-gold-10 border t-border-gold-20 flex items-center justify-center mb-6">
                <Quote className="w-6 h-6 text-visa-gold" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-visa-gold fill-visa-gold" />
                ))}
              </div>

              {/* Quote */}
              <p className="t-text-muted mb-6 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-6 border-t t-border">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-visa-gold/20 to-visa-teal/20 border t-border-gold-20 flex items-center justify-center">
                  <span className="t-text-primary font-semibold text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold t-text-primary">{testimonial.name}</p>
                  <div className="flex items-center gap-2 text-xs t-text-faint">
                    <Flag className="w-3 h-3" />
                    {testimonial.location}
                    <span className="mx-1">|</span>
                    <span className="text-visa-teal">{testimonial.visaType}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Google Reviews Badge */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 glass-card px-6 py-3">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-visa-gold fill-visa-gold" />
              ))}
            </div>
            <span className="t-text-primary font-medium">5.0 on Google Reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
