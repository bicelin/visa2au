import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { Users, CheckCircle, Clock, FileText, Heart, MapPin , Briefcase} from 'lucide-react';

const requirements = [
  'Be the parent of an Australian citizen, permanent resident, or eligible New Zealand citizen',
  'Meet the balance of family test (at least half of your children live permanently in Australia)',
  'Have an eligible sponsor who is settled in Australia',
  'Meet health and character requirements',
  'Meet Assurance of Support requirements (financial bond)',
  'Be outside Australia when applying (unless applying for the Contributory Aged Parent onshore pathway)',
];

const visaOptions = [
  { name: 'Subclass 103 - Parent Visa', desc: 'Permanent parent visa with standard processing queue. Lower cost but very long waiting period.', fee: '$ 5,500 AUD', time: '30+ years', pros: 'Lowest cost option', cons: 'Extremely long queue' },
  { name: 'Subclass 143 - Contributory Parent Visa', desc: 'Fast-tracked permanent parent visa with a higher contribution to the Australian government.', fee: '$ 5,500 AUD', time: '6-12 years', pros: 'Faster than standard', cons: 'Higher government contribution (~$43,600)' },
  { name: 'Subclass 173 - Contributory Parent (Temp)', desc: 'Temporary pathway that splits the contribution into two payments over time.', fee: '$ 4,400 AUD', time: '6-12 years', pros: 'Staged payment option', cons: 'Higher total cost over time' },
  { name: 'Subclass 864 - Contributory Aged Parent', desc: 'For aged parents (pension age) applying onshore. Allows bridging visa during processing.', fee: '$ 5,500 AUD', time: '6-12 years', pros: 'Can apply onshore', cons: 'Must meet pension age' },
  { name: 'Subclass 870 - Sponsored Parent (Temp)', desc: 'Temporary visa allowing parents to stay 3-5 years. Faster processing, no balance of family test.', fee: '$ 2,200 AUD', time: '3-6 months', pros: 'Fast processing', cons: 'Temporary only, no work rights' },
];

const balanceFamilyTest = [
  'At least half of your children must live permanently in Australia',
  'More of your children must live in Australia than in any other single country',
  'Includes biological, adoptive, and step-children',
  'Children who are Australian citizens or permanent residents count toward the test',
];

const services = [
  'Eligibility assessment including balance of family test',
  'Sponsorship application preparation',
  'Document compilation and review',
  'Assurance of Support guidance',
  'Application lodgement and tracking',
  'Health and character requirement guidance',
  'Communication with Department of Home Affairs',
  'Alternative pathway advice (e.g., subclass 870 temporary option)',
];

const ParentVisa103 = () => (
  <Layout>
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/imgs/hero-parent-visa.jpg" alt="Family reunion - parent visa Australia" className="w-full h-full object-cover" style={{ objectPosition: "center 30%" }} width="1920" height="1080" loading="eager" />
        <div className="absolute inset-0 hero-gradient" />
      </div>
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Users className="w-4 h-4 text-visa-gold" />
            <span className="t-text-primary text-sm font-medium">Parent Visa</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">Parent Visa <span className="text-gradient-gold">Subclass 103</span></h1>
          <p className="t-text-muted text-lg leading-relaxed mb-8">Reunite with your children in Australia. The Parent Visa allows parents of Australian citizens and permanent residents to live permanently in Australia, with several pathways available to suit different circumstances.</p>
          <p className="t-text-ghost text-sm mt-4">Professional fee from $ 5,500 AUD | Government charges apply separately</p>
        </div>
      </div>
    </section>

    <section className="py-10 t-bg-body border-b t-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-5 text-center"><Clock className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Processing Time</p><p className="t-text-primary font-semibold">30+ years</p></div>
          <div className="glass-card p-5 text-center"><Briefcase className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Our Fee (from)</p><p className="t-text-primary font-semibold">$ 5,500 AUD</p></div>
          <div className="glass-card p-5 text-center"><FileText className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Visa Type</p><p className="t-text-primary font-semibold">Permanent</p></div>
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
              <h2 className="text-2xl font-bold t-text-primary mb-4">What is the Parent Visa?</h2>
              <p className="t-text-muted leading-relaxed mb-4">The Parent Visa (subclass 103) is a permanent residence visa that allows parents to join their children who are living in Australia as citizens or permanent residents. It is a non-contributory visa, meaning the government charge is lower than contributory options, but the processing queue is extremely long.</p>
              <p className="t-text-muted leading-relaxed">Because of the lengthy processing times (currently 30+ years for the standard parent visa), most families consider the Contributory Parent Visa options or the temporary Sponsored Parent Visa (subclass 870) as faster alternatives.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-visa-gold" />All Parent Visa Options</h2>
              <div className="space-y-4">
                {visaOptions.map((option, index) => (
                  <div key={index} className="glass-card p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h3 className="text-lg font-semibold t-text-primary">{option.name}</h3>
                      <span className="text-visa-gold text-sm">{option.fee}</span>
                    </div>
                    <p className="t-text-faint text-sm mb-3">{option.desc}</p>
                    <div className="flex flex-wrap gap-4 text-xs">
                      <span className="text-visa-teal">Queue: {option.time}</span>
                      <span className="t-text-ghost">Pros: {option.pros}</span>
                      <span className="t-text-ghost">Cons: {option.cons}</span>
                    </div>
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
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-visa-gold" />Balance of Family Test</h2>
              <div className="glass-card p-6 border-visa-gold/20">
                <p className="t-text-muted text-sm mb-4">This is the most critical requirement. You must meet one of the following:</p>
                <ul className="space-y-3">
                  {balanceFamilyTest.map((item, index) => (
                    <li key={index} className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{item}</span></li>
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
              <p className="t-text-faint text-sm mb-4">We will help you choose the right parent visa pathway.</p>
              <Link to="/contact" className="btn-primary w-full text-center block mb-2">Book Consultation</Link>
              <p className="t-text-ghost text-xs text-center">$ 330 AUD/hour (pro rata)</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Government Fees</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="t-text-faint">First instalment (lodgement)</span><span className="t-text-primary font-medium">$ 4,355 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">Second instalment (grant)</span><span className="t-text-primary font-medium">$ 43,600 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">Additional applicant (18+)</span><span className="t-text-primary font-medium">$ 2,205 AUD</span></div>
              </div>
              <p className="t-text-ghost text-xs mt-3">Subject to change by Department of Home Affairs</p>
            </div>
            <div className="glass-card p-6 border-visa-gold/20">
              <h3 className="font-bold t-text-primary mb-3">Important Note</h3>
              <p className="t-text-faint text-sm">The standard Parent Visa (103) has a processing queue of 30+ years. Most families opt for the Contributory Parent Visa (143) or the temporary Sponsored Parent Visa (870) for faster family reunification.</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Related Visas</h3>
              <ul className="space-y-3">
                <li><Link to="/visas/visitor-visa-600" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Visitor Visa 600 (for short visits)</Link></li>
                <li><Link to="/visas/partner-visa-820" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Partner Visa 820/801</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default ParentVisa103;
