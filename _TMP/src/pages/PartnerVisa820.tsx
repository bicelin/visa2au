import { Link } from 'react-router-dom';
import { Check, ArrowRight, Clock, DollarSign, FileText, Users, Heart, Home } from 'lucide-react';
import Layout from '../components/Layout';
import VisaRelatedBlog from '../components/VisaRelatedBlog';

const PartnerVisa820 = () => {
  const eligibility = [
    'Be in a genuine and continuing relationship with an Australian citizen or permanent resident',
    'Be legally married or in a de facto relationship',
    'Meet the health and character requirements',
    'Not have a substantial criminal record',
    'Be present in Australia at the time of application',
    'Meet the financial requirements (if applicable)',
    'Be sponsored by your Australian partner',
  ];

  const documents = [
    'Valid passport',
    'Birth certificates',
    'Marriage certificate (if applicable)',
    'Evidence of genuine relationship (photos, joint accounts, correspondence)',
    'Proof of cohabitation (lease agreements, utility bills)',
    'Statutory declarations from friends and family',
    'Police clearance certificates',
    'Medical examination results',
  ];

  const processSteps = [
    { step: 1, title: 'Initial Consultation', desc: 'We assess your relationship and eligibility' },
    { step: 2, title: 'Document Preparation', desc: 'We help gather comprehensive relationship evidence' },
    { step: 3, title: 'Application Lodgement', desc: 'We prepare and lodge your temporary partner visa' },
    { step: 4, title: 'Processing', desc: 'We manage all DHA correspondence and requests' },
    { step: 5, title: 'Permanent Visa', desc: 'We assist with the 801 permanent visa after 2 years' },
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
                Onshore Pathway
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Partner Visa 820/801
            </h1>
            <p className="text-xl text-white/80 mb-6">
              The onshore partner visa pathway allows you to live and work in Australia while your permanent residency application is processed.
            </p>
            <div className="flex flex-wrap gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-visa-gold" />
                <span>From A$5,500 (indicative)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-visa-gold" />
                <span> pathway to permanent residency</span>
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

      {/* Overview */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-visa-navy mb-6">What Is the 820/801 Visa?</h2>
              <p className="text-visa-charcoal/70 mb-6">
                The Partner Visa (Subclass 820) is a temporary visa that allows the partner or spouse of an Australian citizen or permanent resident to live in Australia. After holding the 820 visa for 2 years, you may be eligible to apply for the permanent Partner Visa (Subclass 801).
              </p>
              <p className="text-visa-charcoal/70 mb-6">
                This visa is ideal for those who are already in Australia or can travel to Australia and wish to build their life with their Australian partner.
              </p>
              <div className="bg-visa-teal/10 rounded-xl p-5">
                <h3 className="font-semibold text-visa-navy mb-3">Two-Stage Process</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-visa-teal text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                    <div>
                      <p className="font-medium text-visa-navy">Temporary Visa (820)</p>
                      <p className="text-sm text-visa-charcoal/60">Allows you to live and work in Australia temporarily</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-visa-gold text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                    <div>
                      <p className="font-medium text-visa-navy">Permanent Visa (801)</p>
                      <p className="text-sm text-visa-charcoal/60">Grants you permanent residency after 2 years</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-visa-navy mb-4">Key Benefits</h3>
              <ul className="space-y-3">
                {['Live and work in Australia during processing', 'Access to Medicare healthcare', 'Study without restrictions', 'Travel freely in and out of Australia', 'Pathway to permanent residency', 'Include dependent children in application', 'No requirement to depart for visa grant'].map((feature, i) => (
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
              To be eligible for the Partner Visa 820, you must meet the following criteria:
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
                Relationship documentation is key to a successful partner visa application:
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
                  We provide comprehensive support throughout your partner visa journey:
                </p>
                <ul className="space-y-4">
                  {['Complete eligibility assessment', 'Relationship evidence compilation', 'Application preparation and lodgement', 'Document review and organization', 'Interview preparation', 'Health and character compliance', 'Ongoing case management', 'Follow-up with DHA', '801 permanent visa assistance'].map((service, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-visa-gold" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-visa-gold font-semibold">From A$5,500 (AUD) - indicative</p>
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

      {/* Related Articles & News */}
      <VisaRelatedBlog
        title="Partner Visa Insights & News"
        subtitle="Expert articles and the latest updates on Australian partner visa regulations and requirements"
        filterTags={['Partner Visa', '820', '801', 'Spouse', 'Offshore', '300', 'Prospective Marriage', 'Family']}
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
            <Link to="/visas/partner-visa-309" className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-white mb-2">Partner Visa 309/100</h3>
              <p className="text-white/60 text-sm">Offshore partner visa pathway</p>
            </Link>
            <Link to="/visas/prospective-marriage-300" className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-white mb-2">Prospective Marriage 300</h3>
              <p className="text-white/60 text-sm">Fiance visa pathway</p>
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

export default PartnerVisa820;