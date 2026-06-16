import { Link } from 'react-router-dom';
import { Check, ArrowRight, Clock, DollarSign, FileText, Heart, HeartHandshake } from 'lucide-react';
import Layout from '../components/Layout';
import VisaRelatedBlog from '../components/VisaRelatedBlog';

const ProspectiveMarriage300 = () => {
  const eligibility = [
    'Intend to marry your Australian partner',
    'Be sponsored by your Australian fiancé(e)',
    'Meet the health and character requirements',
    'Be outside Australia when the visa is granted',
    'Not have a substantial criminal record',
    'Have met your partner in person (at least once)',
    'Be genuinely committed to marrying your partner',
  ];

  const documents = [
    'Valid passport',
    'Birth certificates',
    'Passport-sized photographs',
    'Evidence of relationship (photos, correspondence, travel records)',
    'Evidence of meeting in person',
    'Statutory declarations from friends and family',
    'Police clearance certificates',
    'Medical examination results',
  ];

  const processSteps = [
    { step: 1, title: 'Initial Consultation', desc: 'We assess your relationship and eligibility' },
    { step: 2, title: 'Document Preparation', desc: 'We help gather evidence of genuine relationship' },
    { step: 3, title: 'Application Lodgement', desc: 'We prepare and lodge your prospective marriage visa' },
    { step: 4, title: 'Processing', desc: 'We manage all DHA correspondence and requests' },
    { step: 5, title: 'Marriage & Visa', desc: 'Marry in Australia and apply for partner visa' },
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
                Fiance Visa
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Prospective Marriage Visa 300
            </h1>
            <p className="text-xl text-white/80 mb-6">
              The Prospective Marriage visa allows you to travel to Australia to marry your partner and then apply for a permanent partner visa.
            </p>
            <div className="flex flex-wrap gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-visa-gold" />
                <span>From A$5,500 (indicative)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-visa-gold" />
                <span>Up to 9 months to marry</span>
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
              <h2 className="text-3xl font-bold text-visa-navy mb-6">What Is the 300 Visa?</h2>
              <p className="text-visa-charcoal/70 mb-6">
                The Prospective Marriage Visa (Subclass 300) is for people who want to travel to Australia to marry their partner. After marrying, you can apply for a permanent Partner visa to remain in Australia with your spouse.
              </p>
              <p className="text-visa-charcoal/70 mb-6">
                This visa allows you to enter Australia and spend up to 9 months with your partner before you must be married. It is designed for couples who have met and are planning to marry.
              </p>
              <div className="bg-visa-teal/10 rounded-xl p-5">
                <h3 className="font-semibold text-visa-navy mb-3">Journey to Permanent Residency</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-visa-teal text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                    <div>
                      <p className="font-medium text-visa-navy">Prospective Marriage (300)</p>
                      <p className="text-sm text-visa-charcoal/60">Travel to Australia to marry your partner</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-visa-gold text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                    <div>
                      <p className="font-medium text-visa-navy">Partner Visa (820/801 or 309/100)</p>
                      <p className="text-sm text-visa-charcoal/60">Apply for permanent residency after marriage</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-visa-navy mb-4">Key Benefits</h3>
              <ul className="space-y-3">
                {['Travel to Australia to marry your partner', 'Up to 9 months stay in Australia', 'Work and study while waiting to marry', 'Access to Medicare healthcare', 'Travel freely during visa validity', 'Pathway to permanent partner visa', 'Include dependent children'].map((feature, i) => (
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
              To be eligible for the Prospective Marriage Visa 300, you must meet the following criteria:
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
                We help you compile comprehensive evidence of your relationship:
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
                  We provide comprehensive support throughout your Prospective Marriage visa journey:
                </p>
                <ul className="space-y-4">
                  {['Complete eligibility assessment', 'Relationship evidence compilation', 'Application preparation and lodgement', 'Document review and organization', 'Interview preparation', 'Health and character compliance', 'Ongoing case management', 'Follow-up with DHA', 'Partner visa application assistance'].map((service, i) => (
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
        title="Prospective Marriage 300 News"
        subtitle="Latest updates on fiance visa requirements, processing times, and planning your wedding in Australia"
        filterTags={['300', 'Prospective Marriage', 'Fiance Visa', 'Wedding', 'Partner Visa', 'Spouse', 'Family']}
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
              <p className="text-white/60 text-sm">Onshore pathway after marriage</p>
            </Link>
            <Link to="/visas/partner-visa-309" className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-white mb-2">Partner Visa 309/100</h3>
              <p className="text-white/60 text-sm">Offshore pathway after marriage</p>
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

export default ProspectiveMarriage300;