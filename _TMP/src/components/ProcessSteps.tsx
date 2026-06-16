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
      description: 'Schedule your free initial assessment online or by phone',
      color: 'visa-navy',
      details: ['30-minute consultation', 'Visa eligibility check', 'No obligation quote'],
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
      details: ['Application preparation', 'Quality review', 'Lodgement &跟踪'],
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
    <section id="process" ref={sectionRef} className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-visa-gold/10 text-visa-gold px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Clock className="w-4 h-4" />
            Simple 4-Step Process
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-visa-navy mb-4">
            Our Simple Process
          </h2>
          <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
            From initial consultation to visa approval, we guide you through every step of the migration journey with expert support.
          </p>
        </div>

        {/* Process Cards */}
        <div className="relative max-w-6xl mx-auto">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-20 left-[12.5%] right-[12.5%] h-1">
            <div className="absolute inset-0 bg-gradient-to-r from-visa-navy via-visa-teal to-visa-gold rounded-full opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-visa-navy via-visa-teal to-visa-gold rounded-full animate-pulse" style={{ width: '100%' }} />
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
                <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow h-full">
                  {/* Step Number Badge */}
                  <div className={`absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg bg-visa-${step.color}`}>
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-visa-${step.color}/10`}>
                    <step.icon className={`w-8 h-8 text-visa-${step.color}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-visa-navy mb-2">{step.title}</h3>
                  <p className="text-visa-charcoal/60 text-sm mb-4">{step.description}</p>

                  {/* Details */}
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-visa-charcoal/60">
                        <div className={`w-1.5 h-1.5 rounded-full bg-visa-${step.color}`} />
                        {detail}
                      </li>
                    ))}
                  </ul>

                  {/* Connector Arrow - Desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 z-10">
                      <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
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
          <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-visa-navy/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-visa-navy" />
            </div>
            <div>
              <p className="font-semibold text-visa-navy">MARA Registered</p>
              <p className="text-sm text-visa-charcoal/60">Licensed & Professional</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-visa-teal/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-visa-teal" />
            </div>
            <div>
              <p className="font-semibold text-visa-navy">20+ Years Combined</p>
              <p className="text-sm text-visa-charcoal/60">Expert Experience</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-visa-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-visa-gold" />
            </div>
            <div>
              <p className="font-semibold text-visa-navy">Quick Response</p>
              <p className="text-sm text-visa-charcoal/60">Within 24 Hours</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-visa-charcoal/60 mb-4">Ready to start your journey?</p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
            Book Free Consultation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
