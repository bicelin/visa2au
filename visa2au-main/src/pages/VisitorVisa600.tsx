import { Link } from 'react-router-dom';
import { Check, ArrowRight, Clock, DollarSign, FileText, Users, Building, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import VisaRelatedBlog from '../components/VisaRelatedBlog';

const VisitorVisa600 = () => {
  const eligibility = [
    'Genuine intention to visit Australia temporarily',
    'Sufficient funds to cover your stay',
    'Good character and no significant immigration violations',
    'Healthy and willing to undergo medical examinations',
    'No outstanding Australian government debts',
    'Not at risk of being refused entry to Australia',
  ];

  const documents = [
    'Valid passport with at least 6 months validity',
    'Completed visa application form (Form 1419)',
    'Passport-sized photographs',
    'Evidence of financial capacity (bank statements, pay slips)',
    'Proof of employment or business ownership',
    'Travel itinerary or accommodation bookings',
    'Invitation letter (if visiting family or friends)',
    'Evidence of ties to home country (property, employment, family)',
  ];

  const processSteps = [
    { step: 1, title: 'Initial Consultation', desc: 'We assess your circumstances and determine the most suitable stream' },
    { step: 2, title: 'Document Preparation', desc: 'We help you gather and organize all required documentation' },
    { step: 3, title: 'Application Review', desc: 'Thorough review of your application to maximize approval chances' },
    { step: 4, title: 'Lodgement', desc: 'We submit your application to the Department of Home Affairs' },
    { step: 5, title: 'Follow-up & Decision', desc: 'We monitor your application and provide updates until decision' },
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
                Tourist & Business Streams
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Visitor Visa 600
            </h1>
            <p className="text-xl text-white/80 mb-6">
              Tourist and Business Visitor Visas for Australia. Explore our beautiful country or conduct business activities with this flexible visa option.
            </p>
            <div className="flex flex-wrap gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-visa-gold" />
                <span>From A$880 (indicative)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-visa-gold" />
                <span>Up to 12 months stay</span>
              </div>
            </div>
            <div className="mt-8">
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                Get Free Assessment
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who It Suits */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-visa-navy mb-6">Who Is This Visa For?</h2>
              <p className="text-visa-charcoal/70 mb-6">
                The Visitor Visa 600 is ideal for individuals who want to visit Australia for tourism or business purposes. It offers flexibility with multiple streams to suit different circumstances.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-visa-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-visa-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-visa-navy">Tourism Stream</h3>
                    <p className="text-sm text-visa-charcoal/60">For holidaymakers, family visits, and general tourism activities in Australia.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-visa-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building className="w-5 h-5 text-visa-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-visa-navy">Business Stream</h3>
                    <p className="text-sm text-visa-charcoal/60">For business visitors attending conferences, negotiations, or exploring business opportunities.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-visa-navy mb-4">Key Features</h3>
              <ul className="space-y-3">
                {['Stay up to 12 months in Australia', 'Multiple entry or single entry options', 'Travel for tourism or business activities', 'Include family members in your application', 'No sponsorship required for tourist stream', 'Fast processing times available'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-visa-teal flex-shrink-0" />
                    <span className="text-visa-charcoal">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Am I Eligible?</h2>
            <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
              To be eligible for the Visitor Visa 600, you must meet the following criteria:
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {eligibility.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-3">
                <Check className="w-5 h-5 text-visa-teal flex-shrink-0 mt-0.5" />
                <span className="text-visa-charcoal text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-visa-navy mb-6">Typical Documents Needed</h2>
              <p className="text-visa-charcoal/70 mb-6">
                We assist you in preparing and organizing all required documentation to support your application.
              </p>
              <ul className="space-y-3">
                {documents.map((doc, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-visa-gold flex-shrink-0 mt-0.5" />
                    <span className="text-visa-charcoal">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-visa-navy mb-6">Our Service Includes</h2>
              <div className="bg-visa-navy rounded-2xl p-6 text-white">
                <p className="text-white/70 mb-6">
                  We provide comprehensive support throughout your Visitor Visa application process:
                </p>
                <ul className="space-y-4">
                  {['Complete eligibility assessment', 'Application preparation and lodgement', 'Document review and organization', 'Cover letter preparation', 'Lodgement and follow-up with DHA', 'Updates and decision notification'].map((service, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-visa-gold" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-visa-gold font-semibold">From A$880 (AUD) - indicative</p>
                  <p className="text-white/60 text-sm">Government fees not included</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Our Process</h2>
            <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
              We handle every step of your application with expertise and care.
            </p>
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

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-visa-navy mb-2">How long can I stay on a Visitor Visa 600?</h3>
              <p className="text-visa-charcoal/70 text-sm">The visa can be granted for stay periods of up to 12 months, depending on your circumstances and which stream you apply for. The actual stay period granted is at the discretion of the case officer.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-visa-navy mb-2">Can I work on a Visitor Visa 600?</h3>
              <p className="text-visa-charcoal/70 text-sm">No, the Visitor Visa 600 does not permit work. If you intend to work in Australia, you will need to apply for an appropriate work visa. Business visitors may only undertake business-related activities, not general employment.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-visa-navy mb-2">How long does processing take?</h3>
              <p className="text-visa-charcoal/70 text-sm">Processing times vary depending on the stream, time of year, and individual circumstances. Tourist stream applications typically take 20-30 days, while business stream applications may take longer. We provide estimated timelines during your consultation.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-visa-navy mb-2">Can I extend my visa while in Australia?</h3>
              <p className="text-visa-charcoal/70 text-sm">In most cases, you cannot extend a Visitor Visa 600 while in Australia. You would need to apply for a new visa from outside Australia if you wish to return. There are limited circumstances where a subsequent visa may be granted in Australia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles & News */}
      <VisaRelatedBlog
        title="Visitor Visa Updates & Travel Tips"
        subtitle="Stay informed with the latest visitor visa changes, travel requirements, and expert advice for your Australian trip"
        filterTags={['Visitor Visa', '600', 'Tourism', 'ETA']}
        maxPosts={3}
        showFeatured={true}
      />

      {/* Related Services */}
      <section className="section-padding bg-visa-navy">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Related Services</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link to="/visas/partner-visa-820" className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-white mb-2">Partner Visa 820/801</h3>
              <p className="text-white/60 text-sm">Onshore partner migration pathway</p>
            </Link>
            <Link to="/visas/skills-in-demand-482" className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-white mb-2">Skills in Demand 482</h3>
              <p className="text-white/60 text-sm">Temporary skilled worker visa</p>
            </Link>
            <Link to="/contact" className="bg-visa-gold rounded-xl p-5 hover:bg-visa-goldLight transition-colors">
              <h3 className="font-semibold text-white mb-2">Contact Us</h3>
              <p className="text-white/80 text-sm">Get personalized advice</p>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default VisitorVisa600;