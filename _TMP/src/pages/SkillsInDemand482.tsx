import { Link } from 'react-router-dom';
import { Check, ArrowRight, Clock, DollarSign, FileText, Users, Briefcase, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import VisaRelatedBlog from '../components/VisaRelatedBlog';

const SkillsInDemand482 = () => {
  const eligibility = [
    'Have a sponsoring Australian employer',
    'Meet the skills and qualifications for the nominated occupation',
    'Hold relevant qualifications and/or work experience',
    'Meet English language requirements (unless exempt)',
    'Be of good character and meet health requirements',
    'Have the required skills and experience for the position',
  ];

  const documents = [
    'Valid passport',
    'Completed visa application forms',
    'Skills assessment (if required for occupation)',
    'Educational certificates and transcripts',
    'Employment references and CV/resume',
    'English language test results (IELTS, PTE, etc.)',
    'Police clearance certificates',
    'Medical examination results',
  ];

  const processSteps = [
    { step: 1, title: 'Employer Sponsorship', desc: 'We assist employer to become an approved sponsor' },
    { step: 2, title: 'Nomination', desc: 'We prepare and lodge the nomination for the position' },
    { step: 3, title: 'Visa Application', desc: 'We prepare and lodge your visa application' },
    { step: 4, title: 'Processing', desc: 'We monitor progress and respond to any requests' },
    { step: 5, title: 'Grant', desc: 'We inform you when visa is granted' },
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
                Employer Sponsored
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Skills in Demand Visa 482
            </h1>
            <p className="text-xl text-white/80 mb-6">
              The Temporary Skill Shortage (TSS) visa allows Australian employers to address labour shortages by bringing in skilled workers from overseas.
            </p>
            <div className="flex flex-wrap gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-visa-gold" />
                <span>From A$3,300 (indicative)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-visa-gold" />
                <span>Up to 4 years stay</span>
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
                The Skills in Demand (482) visa is designed for skilled workers who have been nominated by an approved Australian employer to fill positions that cannot be filled by Australian workers.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-visa-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-visa-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-visa-navy">For Employers</h3>
                    <p className="text-sm text-visa-charcoal/60">Access skilled workers from overseas to fill genuine skill shortages in your business.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-visa-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-visa-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-visa-navy">For Workers</h3>
                    <p className="text-sm text-visa-charcoal/60">Work in Australia for up to 4 years with your sponsoring employer and potentially transition to permanent residency.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-visa-navy mb-4">Key Features</h3>
              <ul className="space-y-3">
                {['Up to 4 years temporary stay', 'Pathway to permanent residency (186 ENS)', 'Access to Medicare (some streams)', 'Include family members in application', 'No age limit for most streams', 'Opportunity to change employers'].map((feature, i) => (
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

      {/* Streams */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Visa Streams</h2>
            <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
              The Skills in Demand visa has three streams to suit different circumstances:
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-visa-navy mb-3">Core Skills Stream</h3>
              <p className="text-visa-charcoal/60 text-sm mb-4">For skilled workers nominated for occupations on the Core Skills Occupation List.</p>
              <ul className="space-y-2 text-sm text-visa-charcoal/70">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-visa-teal" /> Most common stream</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-visa-teal" /> Wide range of occupations</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-visa-teal" /> 2-4 year initial validity</li>
              </ul>
            </div>
            <div className="bg-visa-navy rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-3">Labour Agreement Stream</h3>
              <p className="text-white/70 text-sm mb-4">For workers nominated under a labour agreement with the Australian government.</p>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-visa-gold" /> Negotiated terms</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-visa-gold" /> Employer-specific</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-visa-gold" /> Customized occupation list</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-visa-navy mb-3">Specialist Skills Stream</h3>
              <p className="text-visa-charcoal/60 text-sm mb-4">For highly specialized skilled workers not needing skills assessment.</p>
              <ul className="space-y-2 text-sm text-visa-charcoal/70">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-visa-teal" /> No skills assessment</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-visa-teal" /> Minimum salary requirement</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-visa-teal" /> Fast processing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-visa-navy mb-6">Am I Eligible?</h2>
              <p className="text-visa-charcoal/70 mb-6">
                To be eligible for the Skills in Demand visa, you must meet the following requirements:
              </p>
              <ul className="space-y-3">
                {eligibility.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-visa-teal flex-shrink-0 mt-0.5" />
                    <span className="text-visa-charcoal">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
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
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Our Process</h2>
            <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
              We guide both employers and employees through every step of the process.
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
          <div className="text-center mt-8">
            <div className="bg-visa-navy rounded-xl p-6 max-w-2xl mx-auto text-white">
              <p className="text-visa-gold font-semibold mb-2">Our Service For Employers</p>
              <p className="text-white/70 text-sm">We assist with sponsorship approval, nomination preparation, and compliance advice. Contact us to discuss your business needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles & News */}
      <VisaRelatedBlog
        title="Skills & Employer Visa Updates"
        subtitle="Latest news on occupation lists, sponsorship requirements, and skilled migration policy changes"
        filterTags={['482', 'Skills in Demand', 'Employer Sponsorship', 'Occupation List', '186', 'Employer Nomination', 'Skilled Worker', 'Direct Entry']}
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
            <Link to="/visas/employer-nomination-186" className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-white mb-2">Employer Nomination 186</h3>
              <p className="text-white/60 text-sm">Permanent residency pathway</p>
            </Link>
            <Link to="/employers" className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-white mb-2">Employer Services</h3>
              <p className="text-white/60 text-sm">Full sponsorship support</p>
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

export default SkillsInDemand482;