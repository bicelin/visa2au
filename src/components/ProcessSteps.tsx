import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, FileSearch, FileCheck, Award, ArrowRight, Clock, Users, Shield } from 'lucide-react';

const ProcessSteps = () => {
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

  const steps = [
    {
      icon: Calendar,
      title: 'Book Consultation',
      description: 'Schedule your initial consultation online or by phone',
      color: 'visa-gold',
      details: ['1-hour consultation', 'Visa eligibility check', 'Fee: $330 AUD/hour'],
    },
    {
      icon: FileSearch,
      title: 'Get Assessment',
      description: 'We evaluate your eligibility and recommend the best visa pathway',
      color: 'visa-teal',
      details: ['Personalized assessment', 'Document checklist', 'Timeline estimate'],
    },
    {
      icon: FileCheck,
      title: 'Visa Application',
      description: 'We prepare, review and submit your application to Department of Home Affairs',
      color: 'visa-gold',
      details: ['Application preparation', 'Quality review', 'Lodgement & tracking'],
    },
    {
      icon: Award,
      title: 'Visa Approval',
      description: 'Celebrate your success as we guide you through the next steps',
      color: 'visa-teal',
      details: ['Visa grant notification', 'Compliance guidance', 'Ongoing support'],
    },
  ];

  return (
    <section id="process" ref={sectionRef} className="section-padding t-bg-body relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="absolute top-1/4 right-0 w-96 h-96 t-bg-gold-10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 t-bg-teal-10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4">
            <Clock className="w-4 h-4 text-visa-gold" />
            <span className="t-text-secondary text-sm font-medium">Simple 4-Step Process</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold t-text-primary mb-4">
            Our <span className="text-gradient-gold">Simple Process</span>
          </h2>
          <p className="t-text-muted max-w-2xl mx-auto">
            From initial consultation to visa approval, we guide you through every step of the migration journey with expert support.
          </p>
        </div>

        {/* Process Cards */}
        <div className="relative max-w-6xl mx-auto">
          {/* Connecting Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5">
            <div className="absolute inset-0 bg-gradient-to-r from-visa-gold/30 via-visa-teal/30 to-visa-gold/30 rounded-full" />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Card */}
                <div className="relative glass-card p-6 h-full hover:t-border-gold-20 transition-all">
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-visa-navy font-bold shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl t-bg-gold-10 border t-border-gold-20 flex items-center justify-center mb-5">
                    <step.icon className="w-8 h-8 text-visa-gold" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold t-text-primary mb-2">{step.title}</h3>
                  <p className="t-text-faint text-sm mb-4">{step.description}</p>

                  {/* Details */}
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs t-text-ghost">
                        <div className="w-1.5 h-1.5 rounded-full bg-visa-gold/50" />
                        {detail}
                      </li>
                    ))}
                  </ul>

                  {/* Connector Arrow - Desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 z-10">
                      <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-visa-gold" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl t-bg-gold-10 border t-border-gold-20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-visa-gold" />
            </div>
            <div>
              <p className="font-semibold t-text-primary">MARA Registered</p>
              <p className="text-sm t-text-faint">Licensed & Professional</p>
            </div>
          </div>

          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl t-bg-teal-10 border t-border-teal-20 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-visa-teal" />
            </div>
            <div>
              <p className="font-semibold t-text-primary">20+ Years Combined</p>
              <p className="text-sm t-text-faint">Expert Experience</p>
            </div>
          </div>

          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl t-bg-gold-10 border t-border-gold-20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-visa-gold" />
            </div>
            <div>
              <p className="font-semibold t-text-primary">Quick Response</p>
              <p className="text-sm t-text-faint">Within 24 Hours</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="t-text-faint mb-4">Ready to start your journey?</p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
            Book Consultation
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="t-text-ghost text-sm mt-3">$330 AUD per 1 hour (pro rata fees may apply)</p>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
