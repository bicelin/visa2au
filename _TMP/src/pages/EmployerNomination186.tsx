import { Link } from 'react-router-dom';
import { Check, ArrowRight, Clock, DollarSign, FileText, Users, Briefcase } from 'lucide-react';
import Layout from '../components/Layout';
import VisaRelatedBlog from '../components/VisaRelatedBlog';

const EmployerNomination186 = () => {
  const eligibility = [
    'Have a sponsoring Australian employer',
    'Meet the skills and qualifications for the nominated occupation',
    'Hold relevant qualifications (typically a relevant qualification or equivalent)',
    'Meet English language requirements (at least competent English)',
    'Be of good character and meet health requirements',
    'Be under 45 years of age (unless exempt)',
    'Have at least 3 years relevant work experience',
  ];

  const documents = [
    'Valid passport',
    'Completed visa application forms',
    'Skills assessment (for certain occupations)',
    'Educational certificates and transcripts',
    'Employment references and detailed CV',
    'English language test results (IELTS, PTE, etc.)',
    'Police clearance certificates',
    'Medical examination results',
  ];

  const processSteps = [
    { step: 1, title: 'Eligibility Check', desc: 'We assess employer and nominee eligibility' },
    { step: 2, title: 'Sponsorship', desc: 'Employer becomes an approved sponsor' },
    { step: 3, title: 'Nomination', desc: 'We prepare and lodge the nomination' },
    { step: 4, title: 'Visa Application', desc: 'We prepare and lodge your permanent visa' },
    { step: 5, title: 'Grant', desc: 'You receive permanent residency in Australia' },
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
                Permanent Residency
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Employer Nomination Scheme 186
            </h1>
            <p className="text-xl text-white/80 mb-6">
              The ENS 186 provides a direct pathway to permanent residency in Australia for skilled workers sponsored by an Australian employer.
            </p>
            <div className="flex flex-wrap gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-visa-gold" />
                <span>From A$3,300 (indicative)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-visa-gold" />
                <span>Permanent residency</span>
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
              <h2 className="text-3xl font-bold text-visa-navy mb-6">What Is the ENS 186?</h2>
              <p className="text-visa-charcoal/70 mb-6">
                The Employer Nomination Scheme (ENS) visa is a permanent residency visa that allows Australian employers to nominate skilled workers from overseas or temporary residents already in Australia for permanent positions.
              </p>
              <p className="text-visa-charcoal/70 mb-6">
                This visa is ideal for skilled workers who have been working for their sponsoring employer on a temporary visa (such as the 482) and wish to obtain permanent residency in Australia.
              </p>
              <div className="bg-visa-teal/10 rounded-xl p-5">
                <h3 className="font-semibold text-visa-navy mb-3">Three Streams Available</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-visa-teal flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-visa-navy">Direct Entry Stream</p>
                      <p className="text-sm text-visa-charcoal/60">For applicants with skills assessment and relevant qualifications</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-visa-teal flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-visa-navy">Temporary Residence Transition Stream</p>
                      <p className="text-sm text-visa-charcoal/60">For 482 visa holders with 3+ years with sponsoring employer</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-visa-teal flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-visa-navy">Labour Agreement Stream</p>
                      <p className="text-sm text-visa-charcoal/60">For workers under a labour agreement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-visa-navy mb-4">Key Benefits</h3>
              <ul className="space-y-3">
                {['Permanent residency in Australia', 'Unlimited work and study rights', 'Access to Medicare healthcare', 'Sponsor family members for permanent residency', 'Pathway to Australian citizenship', 'No restrictions on travel in/out of Australia', 'Eligibility for Australian government benefits'].map((feature, i) => (
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
              To be eligible for the ENS 186 visa, you must meet the following criteria:
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
                We assist you in preparing and organizing all required documentation:
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
                  We provide comprehensive support throughout your ENS 186 application:
                </p>
                <ul className="space-y-4">
                  {['Eligibility assessment for both employer and nominee', 'Sponsorship application assistance', 'Nomination preparation and lodgement', 'Visa application preparation', 'Skills and qualification verification', 'English language requirements guidance', 'Health and character compliance', 'Lodgement and follow-up with DHA', 'Updates and decision notification'].map((service, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-visa-gold" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-visa-gold font-semibold">From A$3,300 (AUD) - indicative</p>
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
        title="ENS 186 & Permanent Residency News"
        subtitle="Expert insights on employer nomination schemes and pathways to Australian permanent residency"
        filterTags={['186', 'Employer Nomination', 'Direct Entry', 'Skilled Worker', '482', 'Employer Sponsorship', 'Permanent Residency']}
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
            <Link to="/visas/skills-in-demand-482" className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-white mb-2">Skills in Demand 482</h3>
              <p className="text-white/60 text-sm">Temporary pathway to ENS</p>
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

export default EmployerNomination186;