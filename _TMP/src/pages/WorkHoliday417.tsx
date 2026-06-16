import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Check, ArrowRight, Clock, DollarSign, FileText, Users, Briefcase, Globe, Shield, CreditCard, Apple, AlertCircle, ChevronDown, ChevronUp, Mail } from 'lucide-react';
import Layout from '../components/Layout';
import VisaRelatedBlog from '../components/VisaRelatedBlog';

// Design tokens for Figma plugin integration
export const designTokens417 = {
  colors: {
    navy: '#1e3a5f',
    gold: '#c9a227',
    teal: '#2d8a8a',
  },
};

const WorkHoliday417 = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const eligibility = [
    'Be between 18 and 30 years old (35 for some countries)',
    'Hold a valid passport from an eligible country',
    'Have not previously entered Australia on a Working Holiday visa (for first visa)',
    'Meet health and character requirements',
    'Have sufficient funds for your stay (approximately $5,000 AUD)',
    'Not be accompanied by dependent children',
  ];

  const firstVisaDocs = [
    'Valid passport with at least 6 months validity',
    'Proof of funds (bank statements)',
    'Passport-sized photographs',
    'Completed application form',
    'Health examination results',
    'Character documents (police clearance)',
    'English language evidence (if required)',
  ];

  const extensionDocs = [
    'All first visa documents',
    'Proof of 88 days (or 6 months) of specified work',
    'Payslips and employment records',
    'Employer details and ABN verification',
    'Tax File Number declarations',
    'Payslip audit documentation',
  ];

  const firstVisaProcess = [
    { step: 1, title: 'Quick Eligibility Check', desc: 'Tell us your age and citizenship. We\'ll instantly confirm if you qualify.' },
    { step: 2, title: 'Document Preparation', desc: 'We help you gather all required documents and complete the application.' },
    { step: 3, title: 'Application Lodgement', desc: 'Our MARA agents lodge your application legally.' },
    { step: 4, title: 'Visa Grant', desc: 'We monitor your application until you receive your grant letter!' },
  ];

  const extensionProcess = [
    { step: 1, title: 'Payslip Audit', desc: 'We audit your 88 days of specified work and verify employer details.' },
    { step: 2, title: 'Document Review', desc: 'Complete review of payslips, ABNs, and regional postcode compliance.' },
    { step: 3, title: 'Application Preparation', desc: 'We prepare and lodge your second/third year visa application.' },
    { step: 4, title: 'Grant & Strategy', desc: 'Visa granted! We also discuss your pathway to permanent residency.' },
  ];

  const whyUs = [
    {
      icon: Clock,
      title: 'Fast-Track Processing',
      desc: 'Complete your part in under 5 minutes. We handle the rest.',
    },
    {
      icon: Shield,
      title: 'Expert MARA Review',
      desc: 'Registered agents review every document before submission.',
    },
    {
      icon: Globe,
      title: 'Pathway to PR',
      desc: 'We help you build a strategy to transition to permanent residency.',
    },
  ];

  const firstVisaFeatures = [
    'Earn in AUD and fund your travels',
    'Pay only 15% tax on your first $37,000',
    'Unlimited travel in and out of Australia',
    'Work for any employer for up to 6 months',
  ];

  const extensionFeatures = [
    'Full audit of your payslips and employer details',
    'Transition smoothly without leaving Australia',
    'UK Citizens: New "No Farm Work" exemptions may apply!',
    'Peace of mind with professional compliance check',
  ];

  const faqs = [
    {
      q: 'What is the age limit for the 417 visa?',
      a: 'Generally, you must be between 18 and 30 years old. However, citizens of Canada, France, Ireland, Italy, Denmark, and the UK can apply up to the age of 35.',
    },
    {
      q: 'I am from the UK. Do I still need to do 88 days of farm work?',
      a: 'No! Under new rules, UK passport holders are exempt from the specified work requirements for their 2nd and 3rd-year visas. Contact us to process your extension immediately.',
    },
    {
      q: 'How long does the visa take to process?',
      a: 'While government processing times vary, 50% of our perfectly prepared applications are processed in just 1 day, and 90% within 61 days.',
    },
    {
      q: 'Can I bring my partner or children?',
      a: 'No. The 417 visa is an individual visa. You cannot include dependent family members. Your partner must apply for their own Working Holiday visa.',
    },
    {
      q: 'What counts as "specified work"?',
      a: 'Specified work includes plant and animal cultivation, fishing and pearling, tree farming and felling, mining and construction. The work must be done in regional Australia.',
    },
    {
      q: 'Can I study on a 417 visa?',
      a: 'Yes, you can study for up to 4 months on a Working Holiday visa. If you want to study longer, you would need a student visa.',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-visa-navy py-24 lg:py-32" data-figma-section="hero">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-visa-navy via-visa-navyDark to-visa-navy"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-visa-gold/20 text-visa-gold px-3 py-1 rounded-full text-sm font-medium">
                Work & Holiday
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Working Holiday Visa (Subclass 417)
            </h1>
            <p className="text-xl text-white/80 mb-6">
              Your Australian Dream, Minus the Bureaucracy. Fast, secure, and error-free Working Holiday Visa applications and extensions.
            </p>
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="flex items-center gap-2 text-white/80 text-sm">
                <Check className="w-4 h-4 text-visa-gold" /> 2,000+ Visas Granted
              </span>
              <span className="flex items-center gap-2 text-white/80 text-sm">
                <Check className="w-4 h-4 text-visa-gold" /> 99.8% Success Rate
              </span>
              <span className="flex items-center gap-2 text-white/80 text-sm">
                <Check className="w-4 h-4 text-visa-gold" /> Registered MARA Agents
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                Apply for 1st Visa
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="bg-visa-gold hover:bg-visa-goldLight text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2">
                Extend for 2nd/3rd Year
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="section-padding bg-white" data-figma-section="why-us">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Why Waste Days on Paperwork?</h2>
            <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
              Let our expert team handle the complexity while you focus on planning your Australian adventure.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {whyUs.map((item, index) => (
              <div key={index} className="text-center" data-figma-element="feature">
                <div className="w-16 h-16 bg-visa-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-visa-gold" />
                </div>
                <h3 className="text-lg font-bold text-visa-navy mb-2">{item.title}</h3>
                <p className="text-visa-charcoal/70 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - First Visa */}
      <section className="section-padding bg-gray-50" data-figma-section="process-first">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">3 Steps to Australia - First Visa</h2>
            <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
              We handle the rest while you focus on packing.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {firstVisaProcess.map((item, index) => (
              <div key={index} className="relative" data-figma-element="process-step">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center h-full">
                  <div className="w-12 h-12 bg-visa-gold text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-visa-navy mb-2">{item.title}</h3>
                  <p className="text-visa-charcoal/60 text-sm">{item.desc}</p>
                </div>
                {index < firstVisaProcess.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-visa-gold" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* First Time Applicants */}
      <section className="section-padding bg-white" data-figma-section="first-applicants">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-visa-navy mb-6">Start Your Australian Adventure the Right Way</h2>
              <p className="text-visa-charcoal/70 mb-6">
                Planning your move is stressful enough. From proving your $5,000 AUD funds to passing health requirements, we make sure your first application is flawless.
              </p>
              <ul className="space-y-3 mb-6">
                {firstVisaFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-visa-teal flex-shrink-0" />
                    <span className="text-visa-charcoal">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                Get My 1st Visa
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-visa-navy mb-6">Required Documents</h3>
              <ul className="space-y-3">
                {firstVisaDocs.map((doc, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-visa-gold flex-shrink-0 mt-0.5" />
                    <span className="text-visa-charcoal text-sm">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Extension */}
      <section className="section-padding bg-gray-50" data-figma-section="process-extension">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">3 Steps to Extend - 2nd & 3rd Year</h2>
            <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
              Don't let a wrong postcode ruin your extension. Thousands are rejected every year due to incorrect ABNs or invalid regional postcodes.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {extensionProcess.map((item, index) => (
              <div key={index} className="relative" data-figma-element="process-step">
                <div className="bg-visa-navy rounded-xl p-6 shadow-sm text-center h-full">
                  <div className="w-12 h-12 bg-visa-gold text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/70 text-sm">{item.desc}</p>
                </div>
                {index < extensionProcess.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-visa-gold" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visa Extensions */}
      <section className="section-padding bg-white" data-figma-section="extensions">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-visa-navy mb-6">Payslip & Compliance Audit</h3>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-800 text-sm">
                    <strong>Did you know?</strong> Thousands of extensions are rejected every year because of incorrect ABNs or invalid regional postcodes.
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                {extensionDocs.map((doc, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-visa-gold flex-shrink-0 mt-0.5" />
                    <span className="text-visa-charcoal text-sm">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-visa-navy mb-6">Extend for 2nd & 3rd Year</h2>
              <p className="text-visa-charcoal/70 mb-6">
                We audit your 88 days (or 6 months) of specified work to guarantee compliance. Don't let a small mistake cost you your extension.
              </p>
              <ul className="space-y-3 mb-6">
                {extensionFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-visa-teal flex-shrink-0" />
                    <span className="text-visa-charcoal">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-visa-navy/5 border border-visa-navy/20 rounded-xl p-4 mb-6">
                <p className="text-visa-navy font-medium">
                  <strong>UK Citizens:</strong> Ask us about the new "No Farm Work" exemptions!
                </p>
              </div>
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                Check My Payslips & Extend
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="section-padding bg-gray-50" data-figma-section="eligibility">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Am I Eligible?</h2>
            <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
              Check if you meet the basic requirements for the Working Holiday visa.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {eligibility.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-3" data-figma-element="eligibility-item">
                <Check className="w-5 h-5 text-visa-teal flex-shrink-0 mt-0.5" />
                <span className="text-visa-charcoal text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding bg-white" data-figma-section="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Transparent, Flat-Fee Pricing</h2>
            <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
              No hidden fees. Professional service with complete transparency.
            </p>
          </div>
          <div className="max-w-lg mx-auto">
            <div className="bg-visa-navy rounded-2xl p-8 text-white" data-figma-element="pricing-card">
              <h3 className="text-xl font-bold mb-2">Complete 417 Visa Package</h3>
              <p className="text-white/70 mb-4">1st, 2nd, or 3rd Year</p>
              <div className="text-4xl font-bold text-visa-gold mb-6">$1,660 AUD</div>
              <div className="border-t border-white/20 pt-6 mb-6">
                <p className="text-sm text-white/60 mb-2">Price Breakdown:</p>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/80">Government Visa Fee</span>
                  <span className="text-white">$670 AUD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Professional Agency Fee</span>
                  <span className="text-white">$990 AUD</span>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <p className="text-sm font-semibold text-visa-gold">What's Included:</p>
                {['Full document review and error-checking', 'Payslip & 88-day compliance audit (extensions)', 'Direct lodging by a Registered MARA Agent', 'Priority communication with DHA', 'Strategy consultation for future PR/Work visas'].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-visa-gold" />
                    <span className="text-white/80">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/contact" className="w-full bg-visa-gold hover:bg-visa-goldLight text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <CreditCard className="w-5 h-5" />
                Apply Now
              </Link>
              <p className="text-center text-white/50 text-xs mt-4">
                Secure payment via Stripe, Apple Pay, or Google Pay available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-gray-50" data-figma-section="faq">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100" data-figma-element="faq-item">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-semibold text-visa-navy pr-4">{faq.q}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-visa-gold flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-visa-gold flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-visa-charcoal/70">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <VisaRelatedBlog
        title="Working Holiday 417 Updates"
        subtitle="Latest news on 417 visa changes, specified work requirements, and extension tips"
        filterTags={['Work Visa', '417', 'Working Holiday', 'Skilled Migration']}
        maxPosts={3}
        showFeatured={true}
      />

      {/* Trust Section */}
      <section className="section-padding bg-white" data-figma-section="trust">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-visa-navy mb-6">Backed by Leading Immigration Experts</h2>
            <p className="text-visa-charcoal/70 mb-8">
              You aren't just using a service; you're hiring top-tier legal representatives. All agents are registered with the Migration Agents Registration Authority (MARA).
            </p>
            <div className="flex items-center justify-center gap-4">
              <Shield className="w-12 h-12 text-visa-teal" />
              <div className="text-left">
                <p className="font-bold text-visa-navy">MARA Registered</p>
                <p className="text-sm text-visa-charcoal/60">Registration: 0534230 & 2418663</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-visa-navy" data-figma-section="cta">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Australian Adventure?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Contact us today for a free assessment of your Working Holiday visa eligibility.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              Apply Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="mailto:info@visa2.au" className="bg-white/10 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition-colors inline-flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Us
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WorkHoliday417;
