import { Link } from 'react-router-dom';
import { Check, ArrowRight, Clock, DollarSign, FileText, Users, Heart, Home } from 'lucide-react';
import Layout from '../components/Layout';
import VisaRelatedBlog from '../components/VisaRelatedBlog';

const ParentVisa103 = () => {
  const eligibility = [
    'Have a child who is an Australian citizen, permanent resident, or eligible New Zealand citizen',
    'Meet the balance of family test (at least half of your children must live in Australia)',
    'Meet the health and character requirements',
    'Not have outstanding Australian government debts',
    'Be of good character',
    'Meet the sponsorship requirements',
  ];

  const documents = [
    'Valid passport',
    'Birth certificates of all children',
    'Proof of parent-child relationship',
    'Evidence of children living in Australia',
    'Police clearance certificates',
    'Medical examination results',
    'Proof of financial capacity (if required)',
    'Documents supporting balance of family test',
  ];

  const processSteps = [
    { step: 1, title: 'Initial Consultation', desc: 'We assess your eligibility and queue position' },
    { step: 2, title: 'Document Preparation', desc: 'We help gather all required documentation' },
    { step: 3, title: 'Application Lodgement', desc: 'We prepare and lodge your parent visa application' },
    { step: 4, title: 'Queue Management', desc: 'We monitor your place in the visa queue' },
    { step: 5, title: 'Final Processing', desc: 'We assist with final requirements and grant' },
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
                Family Migration
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Parent Visa 103
            </h1>
            <p className="text-xl text-white/80 mb-6">
              Reunite with your children in Australia through the Parent Visa pathway. This visa allows parents of Australian residents to live in Australia permanently.
            </p>
            <div className="flex flex-wrap gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-visa-gold" />
                <span>From A$5,500 (indicative)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-visa-gold" />
                <span>Long-term queue pathway</span>
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
              <h2 className="text-3xl font-bold text-visa-navy mb-6">What Is the Parent Visa 103?</h2>
              <p className="text-visa-charcoal/70 mb-6">
                The Parent Visa (Subclass 103) allows parents of Australian citizens, permanent residents, or eligible New Zealand citizens to migrate to Australia. This visa provides permanent residency and allows parents to live with their children in Australia.
              </p>
              <p className="text-visa-charcoal/70 mb-6">
                While there is a long queue for this visa, it is a cost-effective pathway compared to the contributory parent visas. The visa allows you to eventually sponsor other family members as well.
              </p>
              <div className="bg-visa-teal/10 rounded-xl p-5">
                <h3 className="font-semibold text-visa-navy mb-3">Parent Visa Options</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-visa-teal flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-visa-navy">Parent Visa 103</p>
                      <p className="text-sm text-visa-charcoal/60">Standard queue, longer waiting times, lower costs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-visa-teal flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-visa-navy">Contributory Parent 143</p>
                      <p className="text-sm text-visa-charcoal/60">Higher upfront cost, faster processing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-visa-navy mb-4">Key Benefits</h3>
              <ul className="space-y-3">
                {['Permanent residency in Australia', 'Live with your children in Australia', 'Work and study without restrictions', 'Access to Medicare healthcare', 'Travel freely in and out of Australia', 'Pathway to Australian citizenship', 'Sponsor other family members'].map((feature, i) => (
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
              To be eligible for the Parent Visa 103, you must meet the following criteria:
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
          <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200 max-w-3xl mx-auto">
            <p className="text-amber-800 text-sm">
              <strong>Note:</strong> The Parent Visa 103 has a long processing queue (potentially 30+ years). For faster processing, consider the Contributory Parent Visa (Subclass 143). Contact us to discuss your options.
            </p>
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
                We help you compile comprehensive documentation:
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
                  We provide comprehensive support throughout your parent visa journey:
                </p>
                <ul className="space-y-4">
                  {['Complete eligibility assessment', 'Balance of family test analysis', 'Document preparation and review', 'Application preparation and lodgement', 'Queue position monitoring', 'DHA correspondence management', 'Health and character compliance', 'Updates on processing changes', 'Final grant assistance'].map((service, i) => (
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

      {/* Related Articles & News */}
      <VisaRelatedBlog
        title="Family & Parent Visa Insights"
        subtitle="Stay updated on parent visa policies, queue updates, and family migration news"
        filterTags={['Parent Visa', '103', 'Family', 'Migration', 'Partner Visa']}
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
              <h3 className="font-semibold text-white mb-2">Partner Visas</h3>
              <p className="text-white/60 text-sm">Family reunion options</p>
            </Link>
            <Link to="/services/citizenship" className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-white mb-2">Citizenship</h3>
              <p className="text-white/60 text-sm">After obtaining permanent residency</p>
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

export default ParentVisa103;