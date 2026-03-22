import { Link } from 'react-router-dom';
import { Check, ArrowRight, Clock, DollarSign, FileText, GraduationCap, Award } from 'lucide-react';
import Layout from '../components/Layout';

const SkillsAssessment = () => {
  const eligibility = [
    'Have relevant qualifications for your nominated occupation',
    'Meet the minimum work experience requirements',
    'Have qualifications that are recognized in Australia',
    'Provide evidence of employment history',
    'Meet English language requirements (if required)',
  ];

  const documents = [
    'Educational certificates and transcripts',
    'Employment references and testimonials',
    'Curriculum vitae (CV) or resume',
    'Identity documents (passport, birth certificate)',
    'English language test results',
    'Skills assessment application forms',
    'Evidence of professional registrations (if applicable)',
  ];

  const processSteps = [
    { step: 1, title: 'Initial Consultation', desc: 'We assess your qualifications and experience' },
    { step: 2, title: 'Document Preparation', desc: 'We help gather and organize required documents' },
    { step: 3, title: 'Application Review', desc: 'We review your application for accuracy' },
    { step: 4, title: 'Lodgement', desc: 'We submit your skills assessment application' },
    { step: 5, title: 'Outcome', desc: 'You receive your skills assessment result' },
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
                Skills Migration
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Skills Assessments
            </h1>
            <p className="text-xl text-white/80 mb-6">
              Get your qualifications and skills recognized for Australian migration. We assist with skills assessments from various assessing authorities.
            </p>
            <div className="flex flex-wrap gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-visa-gold" />
                <span>From A$3,300 (indicative)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-visa-gold" />
                <span>Varying processing times</span>
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
              <h2 className="text-3xl font-bold text-visa-navy mb-6">What Is a Skills Assessment?</h2>
              <p className="text-visa-charcoal/70 mb-6">
                A skills assessment is a mandatory requirement for most skilled migration visas to Australia. It verifies that your qualifications and work experience meet Australian standards for your nominated occupation.
              </p>
              <p className="text-visa-charcoal/70 mb-6">
                Different occupations are assessed by different authorities (such as Trades Recognition Australia, VETASSESS, Engineers Australia, etc.). We help you navigate the appropriate assessing authority for your profession.
              </p>
              <div className="bg-visa-teal/10 rounded-xl p-5">
                <h3 className="font-semibold text-visa-navy mb-3">Common Assessing Authorities</h3>
                <ul className="space-y-2 text-sm text-visa-charcoal/70">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-visa-teal" /> Trades Recognition Australia (TRA)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-visa-teal" /> VETASSESS</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-visa-teal" /> Engineers Australia</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-visa-teal" /> Australian Nursing Federation</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-visa-teal" /> CPA Australia / Chartered Accountants</li>
                </ul>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-visa-navy mb-4">Why Is It Important?</h3>
              <ul className="space-y-3">
                {['Required for skilled migration visas (189, 190, 491)', 'Verifies your qualifications are Australian-recognised', 'Demonstrates your work experience', 'Essential for employer-sponsored visas', 'Strengthens your visa application', 'May be required for registration/licenses'].map((feature, i) => (
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
              Skills assessment requirements vary by occupation and assessing authority:
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
                  We provide comprehensive support for your skills assessment:
                </p>
                <ul className="space-y-4">
                  {['Identifying the correct assessing authority', 'Eligibility assessment for your occupation', 'Document preparation and review', 'Application lodgement', 'Liaising with assessing authorities', 'Tracking application progress', 'Result notification and guidance'].map((service, i) => (
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

      {/* Related Services */}
      <section className="section-padding bg-visa-navy">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Related Services</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link to="/visas/skills-in-demand-482" className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-white mb-2">Skills in Demand 482</h3>
              <p className="text-white/60 text-sm">Employer sponsored pathway</p>
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

export default SkillsAssessment;