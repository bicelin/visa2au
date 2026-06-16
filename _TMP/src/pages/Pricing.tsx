import { Link } from 'react-router-dom';
import { Check, AlertCircle, ArrowRight, DollarSign, Users, Globe, Heart, Briefcase, Shield, GraduationCap } from 'lucide-react';
import Layout from '../components/Layout';

const Pricing = () => {
  const services = [
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
    },
    {
      icon: Heart,
      title: 'Partner Visas (820/801, 309/100)',
      price: 'from A$5,500',
      period: 'indicative',
      description: 'Onshore and offshore partner migration',
      features: [
        'Complete case management',
        'Relationship documentation',
        'Immigration interviews',
        'Permanent residency pathway',
      ],
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
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-visa-navy py-24 lg:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-visa-navy via-visa-navyDark to-visa-navy"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Transparent Pricing
            </h1>
            <p className="text-xl text-white/80 mb-6">
              Clear, upfront fees in Australian Dollars (AUD) with no hidden costs. Contact us for a detailed quote tailored to your specific circumstances.
            </p>
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              Get a Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Our Services</h2>
            <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
              All fees are quoted in Australian Dollars (AUD). Final costs may vary based on individual circumstances and government fees.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className={`rounded-2xl p-6 transition-all duration-300 ${
                  service.highlight
                    ? 'bg-visa-navy text-white shadow-2xl ring-2 ring-visa-gold'
                    : 'bg-gray-50 border border-gray-100 shadow-sm hover:shadow-lg'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  service.highlight ? 'bg-visa-gold/20' : 'bg-visa-navy/10'
                }`}>
                  <service.icon className={`w-6 h-6 ${service.highlight ? 'text-visa-gold' : 'text-visa-navy'}`} />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${service.highlight ? 'text-white' : 'text-visa-navy'}`}>
                  {service.title}
                </h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-3xl font-bold ${service.highlight ? 'text-visa-gold' : 'text-visa-navy'}`}>
                    {service.price}
                  </span>
                  <span className={`text-xs ${service.highlight ? 'text-white/60' : 'text-visa-charcoal/60'}`}>
                    {service.period}
                  </span>
                </div>
                <p className={`text-sm mb-4 ${service.highlight ? 'text-white/70' : 'text-visa-charcoal/60'}`}>
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${service.highlight ? 'text-visa-gold' : 'text-visa-teal'}`} />
                      <span className={`text-sm ${service.highlight ? 'text-white/90' : 'text-visa-charcoal/80'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`block text-center py-3 rounded-xl font-semibold transition-all text-sm ${
                    service.highlight
                      ? 'bg-visa-gold text-white hover:bg-visa-goldLight'
                      : 'bg-visa-navy text-white hover:bg-visa-navyDark'
                  }`}
                >
                  Get Quote
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Additional Services</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: 'Citizenship Applications', desc: 'Contact for pricing' },
              { title: 'ART Appeals & Refusals', desc: 'Contact for pricing' },
              { title: 'Complex Migration Matters', desc: 'Contact for pricing' },
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <h3 className="font-semibold text-visa-navy mb-2">{service.title}</h3>
                <p className="text-visa-charcoal/60 text-sm mb-4">{service.desc}</p>
                <Link to="/contact" className="text-visa-teal font-medium inline-flex items-center gap-1 hover:text-visa-navy">
                  Enquire <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-start gap-3 p-6 bg-amber-50 rounded-xl border border-amber-200">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-amber-800 font-semibold mb-2">Important Information</p>
              <ul className="text-amber-800 text-sm space-y-1">
                <li>All fees are quoted in Australian Dollars (AUD) and are indicative only</li>
                <li>Government fees are not included in our service fees</li>
                <li>Final costs may vary based on individual circumstances and visa complexity</li>
                <li>Contact us for a detailed quote tailored to your specific case</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-visa-navy">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Contact us today for a free initial consultation and detailed quote.
          </p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
            Book Consultation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;