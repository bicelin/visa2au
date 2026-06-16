import { Link } from 'react-router-dom';
import { Check, ArrowRight, Shield, AlertCircle, FileText, Scale, Clock } from 'lucide-react';
import Layout from '../components/Layout';

const VisaRefusals = () => {
  const services = [
    {
      icon: Scale,
      title: 'ART Appeals',
      description: 'Administrative Review Tribunal appeals for visa refusals',
    },
    {
      icon: AlertCircle,
      title: 'Visa Cancellations',
      description: 'Assistance with visa cancellation reviews and appeals',
    },
    {
      icon: FileText,
      title: 'Re-application',
      description: 'Help with preparing stronger visa re-applications',
    },
    {
      icon: Shield,
      title: 'Compliance Issues',
      description: 'Support for immigration compliance and bridging visa issues',
    },
  ];

  const processSteps = [
    { step: 1, title: 'Review Decision', desc: 'We analyze the refusal or cancellation reasons' },
    { step: 2, title: 'Strategy Development', desc: 'We create a tailored appeal or re-application strategy' },
    { step: 3, title: 'Document Preparation', desc: 'We compile additional evidence and documentation' },
    { step: 4, title: 'Lodgement', desc: 'We submit the appeal or re-application' },
    { step: 5, title: 'Hearing & Outcome', desc: 'We represent you at hearings and follow up on decision' },
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
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-visa-gold/20 text-visa-gold px-3 py-1 rounded-full text-sm font-medium">
                ART & Appeals
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Visa Refusals & Appeals
            </h1>
            <p className="text-xl text-white/80 mb-6">
              Don't give up on your Australian visa dreams. We help clients navigate the appeals process and re-application strategies after visa refusals or cancellations.
            </p>
            <div className="mt-8">
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                Get Free Assessment
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">How We Can Help</h2>
            <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
              A visa refusal or cancellation doesn't have to be the end of your journey. We have extensive experience helping clients successfully appeal decisions and obtain visas on subsequent applications.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="w-12 h-12 bg-visa-teal/10 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-visa-teal" />
                </div>
                <h3 className="text-lg font-bold text-visa-navy mb-2">{service.title}</h3>
                <p className="text-visa-charcoal/60 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Our Approach</h2>
          </div>
          <div className="grid md:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {processSteps.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center h-full">
                  <div className="w-10 h-10 bg-visa-gold text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-visa-navy mb-2 text-sm">{item.title}</h3>
                  <p className="text-visa-charcoal/60 text-xs">{item.desc}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                    <ArrowRight className="w-4 h-4 text-visa-gold" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Time Limits Apply</h3>
                <p className="text-amber-800 text-sm mb-4">
                  It is crucial to act quickly after a visa refusal or cancellation. Strict time limits apply for lodging appeals with the Administrative Review Tribunal (ART). Contact us immediately to discuss your options.
                </p>
                <Link to="/contact" className="inline-flex items-center gap-2 text-amber-900 font-semibold hover:text-amber-700">
                  Contact Us Urgently <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="section-padding bg-visa-navy">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Related Services</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link to="/visas/partner-visa-820" className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-white mb-2">Partner Visas</h3>
              <p className="text-white/60 text-sm">Re-application support</p>
            </Link>
            <Link to="/visas/visitor-visa-600" className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-white mb-2">Visitor Visa 600</h3>
              <p className="text-white/60 text-sm">Re-application support</p>
            </Link>
            <Link to="/contact" className="bg-visa-gold rounded-xl p-5 hover:bg-visa-goldLight transition-colors">
              <h3 className="font-semibold text-white mb-2">Contact Us</h3>
              <p className="text-white/80 text-sm">Get urgent advice</p>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default VisaRefusals;