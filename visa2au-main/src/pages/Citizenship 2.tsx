import { Link } from 'react-router-dom';
import { Check, ArrowRight, Clock, DollarSign, FileText, Award, Flag, Heart } from 'lucide-react';
import Layout from '../components/Layout';

const Citizenship = () => {
  const eligibility = [
    'Be a permanent resident of Australia',
    'Meet the residence requirement (usually 4 years)',
    'Be of good character',
    'Pass the citizenship test',
    'Meet English language requirements',
    'Intend to live in Australia or maintain a close association',
  ];

  const documents = [
    'Valid passport',
    'Birth certificate',
    'Permanent residency evidence',
    'Travel records (passports with stamps)',
    'Character documents (police clearances)',
    'Passport-sized photographs',
    'Citizenship application forms',
  ];

  const processSteps = [
    { step: 1, title: 'Initial Consultation', desc: 'We assess your eligibility and residency' },
    { step: 2, title: 'Document Preparation', desc: 'We help gather all required documents' },
    { step: 3, title: 'Application Lodgement', desc: 'We prepare and lodge your citizenship application' },
    { step: 4, title: 'Test & Interview', desc: 'We prepare you for citizenship test and interview' },
    { step: 5, title: 'Citizenship Grant', desc: 'You attend ceremony and become a citizen' },
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
                Australian Citizenship
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Australian Citizenship
            </h1>
            <p className="text-xl text-white/80 mb-6">
              Become an Australian citizen and enjoy the full rights and benefits of citizenship. We guide you through the entire citizenship process.
            </p>
            <div className="flex flex-wrap gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-visa-gold" />
                <span>Full citizenship rights</span>
              </div>
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-visa-gold" />
                <span>Australian passport</span>
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
              <h2 className="text-3xl font-bold text-visa-navy mb-6">Become an Australian Citizen</h2>
              <p className="text-visa-charcoal/70 mb-6">
                Australian citizenship is the final step in your migration journey. It grants you full rights as an Australian, including the right to vote, hold an Australian passport, and seek government positions.
              </p>
              <p className="text-visa-charcoal/70 mb-6">
                There are different pathways to citizenship, including by conferral (for permanent residents) and by descent (for those born overseas to Australian parents).
              </p>
              <div className="bg-visa-teal/10 rounded-xl p-5">
                <h3 className="font-semibold text-visa-navy mb-3">Pathways to Citizenship</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-visa-teal flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-visa-navy">By Conferral</p>
                      <p className="text-sm text-visa-charcoal/60">For permanent residents who meet residence requirements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-visa-teal flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-visa-navy">By Descent</p>
                      <p className="text-sm text-visa-charcoal/60">For those born overseas to Australian citizen parents</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-visa-navy mb-4">Benefits of Citizenship</h3>
              <ul className="space-y-3">
                {['Right to vote in federal elections', 'Australian passport for visa-free travel', 'Access to government benefits and services', 'Run for public office', 'Serve in the Australian Defence Force', 'Full protection under Australian law', 'No restrictions on travel or stay', 'Right to seek Australian government jobs'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-visa-teal flex-shrink-0" />
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
              To be eligible for Australian citizenship by conferral, you must:
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
                  We provide comprehensive support for your citizenship journey:
                </p>
                <ul className="space-y-4">
                  {['Eligibility assessment', 'Residency calculation', 'Document preparation and review', 'Application preparation and lodgement', 'Citizenship test preparation', 'Interview preparation', 'Follow-up with DHA', 'Ceremony attendance guidance'].map((service, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-visa-gold" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <Link to="/contact" className="text-visa-gold font-semibold hover:text-visa-goldLight">
                    Contact for pricing information
                  </Link>
                </div>
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
              <p className="text-white/60 text-sm">Pathway to permanent residency</p>
            </Link>
            <Link to="/services/visa-refusals" className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-white mb-2">ART & Refusals</h3>
              <p className="text-white/60 text-sm">Appeals and refusals</p>
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

export default Citizenship;