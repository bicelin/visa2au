import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowLeft, Mail, Phone, ClipboardList, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';

const Questionnaire = () => {
  useEffect(() => {
    window.location.href = 'https://visa2au.mmportal.cloud/assessment';
  }, []);

  return (
    <Layout>
      <section className="relative bg-visa-navy py-24 lg:py-32">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ExternalLink className="w-4 h-4" />
              <span className="text-white">Visa Questionnaire</span>
            </nav>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Visa Eligibility Questionnaire</h1>
            <p className="text-xl text-white/80">Complete our comprehensive questionnaire to assess your visa options...</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-visa-navy/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <ClipboardList className="w-10 h-10 text-visa-navy" />
              </div>
              <h2 className="text-2xl font-bold text-visa-navy mb-4">Redirecting to Questionnaire...</h2>
              <p className="text-visa-charcoal/70 mb-4">If you're not automatically redirected, please click below.</p>
            </div>

            <a href="https://visa2au.mmportal.cloud/assessment" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 mb-12">
              Open Visa Questionnaire <ExternalLink className="w-5 h-5" />
            </a>

            <div className="border-t border-gray-200 pt-12 text-left">
              <h3 className="text-xl font-bold text-visa-navy mb-6 text-center">What to Expect</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-visa-gold/10 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-visa-gold font-bold text-sm">1</span></div>
                  <div><h4 className="font-semibold text-visa-navy mb-1">Personal Information</h4><p className="text-visa-charcoal/60 text-sm">Basic details about you</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-visa-gold/10 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-visa-gold font-bold text-sm">2</span></div>
                  <div><h4 className="font-semibold text-visa-navy mb-1">Current Visa Status</h4><p className="text-visa-charcoal/60 text-sm">Your immigration situation</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-visa-gold/10 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-visa-gold font-bold text-sm">3</span></div>
                  <div><h4 className="font-semibold text-visa-navy mb-1">Qualifications</h4><p className="text-visa-charcoal/60 text-sm">Education and skills</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-visa-gold/10 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-visa-gold font-bold text-sm">4</span></div>
                  <div><h4 className="font-semibold text-visa-navy mb-1">Family Situation</h4><p className="text-visa-charcoal/60 text-sm">Partner and family details</p></div>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-gray-50 rounded-2xl p-8 text-left">
              <h3 className="text-xl font-bold text-visa-navy mb-6 text-center">Why Complete This?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-visa-teal flex-shrink-0" /><p className="text-visa-charcoal/70 text-sm">Personalized visa recommendations</p></div>
                <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-visa-teal flex-shrink-0" /><p className="text-visa-charcoal/70 text-sm">Understand eligibility requirements</p></div>
                <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-visa-teal flex-shrink-0" /><p className="text-visa-charcoal/70 text-sm">Estimated processing timeline</p></div>
                <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-visa-teal flex-shrink-0" /><p className="text-visa-charcoal/70 text-sm">Documentation checklist</p></div>
              </div>
            </div>

            <div className="mt-12">
              <p className="text-visa-charcoal/70 mb-4">Need assistance?</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="tel:+61291362462" className="inline-flex items-center gap-2 text-visa-teal font-medium"><Phone className="w-5 h-5" />+61 2 9136 2462</a>
                <span className="text-visa-charcoal/30">|</span>
                <a href="mailto:info@visa2.au" className="inline-flex items-center gap-2 text-visa-teal font-medium"><Mail className="w-5 h-5" />info@visa2.au</a>
              </div>
            </div>

            <div className="mt-8">
              <Link to="/" className="inline-flex items-center gap-2 text-visa-charcoal hover:text-visa-navy transition-colors">
                <ArrowLeft className="w-5 h-5" /> Return to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Questionnaire;
