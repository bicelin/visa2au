import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { Heart, CheckCircle, Clock, ArrowRight, FileText, HelpCircle, AlertTriangle, XCircle, Plane, MapPin, Users , Briefcase} from 'lucide-react';

const requirements = [
  'Be in a genuine relationship with an Australian citizen, permanent resident, or eligible New Zealand citizen',
  'Meet health and character requirements for both applicant and sponsor',
  'Provide evidence of your relationship (financial, social, household, commitment)',
  'Be outside Australia when applying (offshore application)',
  'Meet the relationship duration requirements (usually 12 months de facto, or married)',
  'The Australian partner must meet sponsorship eligibility (not previously sponsored within 5 years in certain cases)',
];

const stages = [
  { name: 'Provisional Visa (Subclass 309)', description: 'Allows you to travel to and live in Australia while your permanent visa is processed. You can work, study, and access Medicare.', duration: 'Usually granted within 12-18 months' },
  { name: 'Permanent Visa (Subclass 100)', description: 'Granted approximately 2 years after the provisional visa if your relationship is still genuine and continuing. You must be in or outside Australia.', duration: 'Usually 2 years after 309 grant' },
];

const evidenceCategories = [
  { name: 'Financial', items: ['Joint bank accounts', 'Shared financial responsibilities', 'Joint loans or assets', 'Bills in both names'] },
  { name: 'Domestic', items: ['Living together (lease, utilities)', 'Shared household responsibilities', 'Correspondence to same address', 'Joint ownership or rental of property'] },
  { name: 'Social', items: ['Photos together with family and friends', 'Joint travel documents', 'Social media evidence', 'Statements from friends and family'] },
  { name: 'Commitment', items: ['Statutory declarations', 'Wills or insurance naming partner', 'Joint plans for the future', 'Long-term relationship evidence'] },
];

const services = [
  'Complete eligibility assessment for both partners',
  'Document checklist tailored to your relationship',
  'Relationship evidence compilation strategy',
  'Sponsor eligibility review',
  'Application preparation and lodgement',
  'Health and character requirement guidance',
  'Communication with Department of Home Affairs',
  'Permanent stage (subclass 100) application assistance',
];

const PartnerVisa309 = () => (
  <Layout>
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/imgs/hero-partner-offshore.jpg" alt="Couple at airport - offshore partner visa journey" className="w-full h-full object-cover" style={{ objectPosition: "center 30%" }} width="1920" height="1080" loading="eager" />
        <div className="absolute inset-0 hero-gradient" />
      </div>
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Plane className="w-4 h-4 text-visa-gold" />
            <span className="t-text-primary text-sm font-medium">Offshore Partner Visa</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">Partner Visa <span className="text-gradient-gold">309/100</span></h1>
          <p className="t-text-muted text-lg leading-relaxed mb-8">For partners of Australian citizens or permanent residents applying from outside Australia. This two-stage visa lets you travel to Australia and later obtain permanent residency.</p>
          <p className="t-text-ghost text-sm mt-4">Professional fee from $ 5,500 AUD | Government charges apply separately</p>
        </div>
      </div>
    </section>

    <section className="py-10 t-bg-body border-b t-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-5 text-center"><Clock className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Processing Time</p><p className="t-text-primary font-semibold">12-18 months</p></div>
          <div className="glass-card p-5 text-center"><Briefcase className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Our Fee (from)</p><p className="t-text-primary font-semibold">$ 5,500 AUD</p></div>
          <div className="glass-card p-5 text-center"><FileText className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Pathway</p><p className="t-text-primary font-semibold">Provisional to Permanent</p></div>
          <div className="glass-card p-5 text-center"><MapPin className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Apply From</p><p className="t-text-primary font-semibold">Outside Australia</p></div>
        </div>
      </div>
    </section>

    <section className="section-padding t-bg-body relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4">What is the Partner Visa (Subclass 309/100)?</h2>
              <p className="t-text-muted leading-relaxed mb-4">The Partner Visa (subclass 309/100) is a two-stage offshore partner visa for people who are in a genuine relationship with an Australian citizen, permanent resident, or eligible New Zealand citizen, and are applying from outside Australia.</p>
              <p className="t-text-muted leading-relaxed">Unlike the onshore Partner Visa (820/801), this pathway is designed for applicants who are not currently in Australia. Once granted, the subclass 309 allows you to enter Australia, and after approximately two years of maintaining the relationship, you become eligible for the permanent subclass 100 visa.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-visa-gold" />Two-Stage Process</h2>
              <div className="space-y-4">
                {stages.map((stage, index) => (
                  <div key={index} className="glass-card p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                      <h3 className="text-lg font-semibold t-text-primary">{stage.name}</h3>
                      <span className="text-visa-gold text-sm">{stage.duration}</span>
                    </div>
                    <p className="t-text-faint">{stage.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-visa-gold" />Requirements</h2>
              <div className="glass-card p-6">
                <ul className="space-y-3">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-gold shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{req}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Heart className="w-5 h-5 text-visa-gold" />Relationship Evidence Categories</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {evidenceCategories.map((cat, i) => (
                  <div key={i} className="glass-card p-5">
                    <h3 className="t-text-primary font-semibold mb-3">{cat.name}</h3>
                    <ul className="space-y-1.5">
                      {cat.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2"><span className="text-visa-teal mt-1.5 w-1 h-1 rounded-full bg-visa-teal shrink-0" /><span className="t-text-faint text-sm">{item}</span></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-400" />Common Refusal Reasons</h2>
              <div className="glass-card p-6 border-red-500/20">
                <ul className="space-y-3">
                  {[
                    'Insufficient evidence of a genuine and continuing relationship',
                    'Relationship duration does not meet the required threshold',
                    'Sponsor does not meet eligibility requirements',
                    'Failure to meet health or character requirements',
                    'Inconsistent information across application documents',
                  ].map((reason, index) => (
                    <li key={index} className="flex items-start gap-3"><AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{reason}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Heart className="w-5 h-5 text-visa-gold" />How We Can Help</h2>
              <div className="glass-card p-6">
                <ul className="grid sm:grid-cols-2 gap-3">
                  {services.map((service, index) => (
                    <li key={index} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{service}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 border-visa-gold/30">
              <h3 className="text-lg font-bold t-text-primary mb-3">Ready to Apply?</h3>
              <p className="t-text-faint text-sm mb-4">Get expert assistance with your offshore Partner Visa.</p>
              <Link to="/contact" className="btn-primary w-full text-center block mb-2">Book Consultation</Link>
              <p className="t-text-ghost text-xs text-center">$ 330 AUD/hour (pro rata)</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Government Fees</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="t-text-faint">Base application charge</span><span className="t-text-primary font-medium">$ 9,365 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">Additional applicant (18+)</span><span className="t-text-primary font-medium">$ 4,690 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">Additional applicant (under 18)</span><span className="t-text-primary font-medium">$ 2,345 AUD</span></div>
              </div>
              <p className="t-text-ghost text-xs mt-3">Subject to change by Department of Home Affairs</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Related Visas</h3>
              <ul className="space-y-3">
                <li><Link to="/visas/partner-visa-820" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Partner Visa 820/801 (Onshore)</Link></li>
                <li><Link to="/visas/prospective-marriage-300" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Prospective Marriage 300</Link></li>
                <li><Link to="/visas/parent-visa-103" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Parent Visa 103</Link></li>
              </ul>
            </div>
            <div className="glass-card p-6 border-red-500/20">
              <div className="flex items-center gap-3 mb-3"><HelpCircle className="w-5 h-5 text-red-400" /><h3 className="font-semibold t-text-primary">Visa Refused?</h3></div>
              <p className="t-text-faint text-sm mb-3">We can help with appeals and ART representation.</p>
              <Link to="/services/visa-refusals" className="text-red-400 text-sm hover:text-red-300 flex items-center gap-1">Learn about appeals <ArrowRight className="w-3 h-3" /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default PartnerVisa309;
