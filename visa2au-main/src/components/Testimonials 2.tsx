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
    <section ref={sectionRef} className="section-padding bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-visa-navy mb-4">
            What Our Clients Say
          </h2>
          <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
            Read about the experiences of clients who successfully obtained their Australian visas with our help.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 shadow-lg card-hover transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Quote Icon */}
              <div className="w-10 h-10 bg-visa-gold/10 rounded-full flex items-center justify-center mb-4">
                <Quote className="w-5 h-5 text-visa-gold" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-visa-gold fill-visa-gold" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-visa-charcoal/80 mb-6 leading-relaxed">{testimonial.quote}</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 bg-visa-navy/10 rounded-full flex items-center justify-center">
                  <span className="text-visa-navy font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-visa-navy">{testimonial.name}</p>
                  <div className="flex items-center gap-2 text-xs text-visa-charcoal/60">
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
        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-visa-gold fill-visa-gold" />
              ))}
            </div>
            <span className="text-visa-charcoal font-medium">5.0 on Google Reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
