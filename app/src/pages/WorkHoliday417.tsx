import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { Plane, CheckCircle, Clock, FileText, AlertTriangle, XCircle, MapPin, Backpack, Globe , Briefcase} from 'lucide-react';

const eligibleCountries417 = [
  'United Kingdom', 'Canada', 'France', 'Germany', 'Ireland', 'Italy', 'Japan',
  'South Korea', 'Netherlands', 'Belgium', 'Denmark', 'Sweden', 'Norway',
  'Hong Kong', 'Taiwan', 'Finland', 'Cyprus', 'Estonia', 'Malta',
];

const eligibleCountries462 = [
  'United States', 'Argentina', 'Austria', 'Chile', 'China', 'Czech Republic',
  'Ecuador', 'Greece', 'Hungary', 'Indonesia', 'Israel', 'Luxembourg',
  'Malaysia', 'Peru', 'Poland', 'Portugal', 'San Marino', 'Singapore',
  'Slovak Republic', 'Slovenia', 'Spain', 'Thailand', 'Turkey', 'Uruguay',
  'Vietnam',
];

const requirements = [
  'Aged 18 to 30 years old (inclusive) at the time of application',
  'Hold a valid passport from an eligible country',
  'Not have a dependent child accompanying you to Australia',
  'Have sufficient funds for your initial stay (approx. $ 5,000 AUD) plus a return ticket',
  'Meet health and character requirements',
  'Not have previously entered Australia on a Working Holiday visa (for first-time applicants)',
  'For subclass 462: have functional English and meet education requirements (for some countries)',
];

const workRights = [
  'Work for any employer for up to 6 months',
  'Study for up to 4 months',
  'Travel freely in and out of Australia while the visa is valid',
  'Complete specified work in regional Australia to qualify for a second or third year visa',
];

const specifiedWork = [
  'Plant and animal cultivation (farming, fruit picking)',
  'Fishing and pearling',
  'Tree farming and felling',
  'Mining',
  'Construction',
  'Bushfire recovery work (in declared areas)',
  'COVID-19 healthcare and medical work',
  'Critical sectors including agriculture, food processing, health, aged and disability care, and childcare',
];

const services = [
  'Eligibility assessment based on your passport country',
  'Application preparation and lodgement',
  'Health insurance guidance (mandatory requirement)',
  'Regional work strategy for second/third year extension',
  'Tax file number and bank account setup advice',
  'Pathway to other visas (skilled, employer-sponsored)',
];

const WorkHoliday417 = () => (
  <Layout>
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/imgs/hero-work-holiday.jpg" alt="Young backpacker at Australian outback lookout" className="w-full h-full object-cover" style={{ objectPosition: "center 30%" }} width="1920" height="1080" loading="eager" />
        <div className="absolute inset-0 hero-gradient" />
      </div>
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Backpack className="w-4 h-4 text-visa-gold" />
            <span className="t-text-primary text-sm font-medium">Work & Holiday Visa</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">Work & Holiday Visa <span className="text-gradient-gold">417 & 462</span></h1>
          <p className="t-text-muted text-lg leading-relaxed mb-8">Experience Australia while earning money. The Working Holiday visa lets young adults from eligible countries travel and work in Australia for up to 12 months, with options to extend for a second or third year.</p>
          <p className="t-text-ghost text-sm mt-4">Professional fee from $ 2,200 AUD | Government charges apply separately</p>
        </div>
      </div>
    </section>

    <section className="py-10 t-bg-body border-b t-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-5 text-center"><Clock className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Processing Time</p><p className="t-text-primary font-semibold">14-90 days</p></div>
          <div className="glass-card p-5 text-center"><Briefcase className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Our Fee (from)</p><p className="t-text-primary font-semibold">$ 2,200 AUD</p></div>
          <div className="glass-card p-5 text-center"><FileText className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Duration</p><p className="t-text-primary font-semibold">12 months</p></div>
          <div className="glass-card p-5 text-center"><Globe className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Eligible Ages</p><p className="t-text-primary font-semibold">18-30 years</p></div>
        </div>
      </div>
    </section>

    <section className="section-padding t-bg-body relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4">What is the Working Holiday Visa?</h2>
              <p className="t-text-muted leading-relaxed mb-4">The Working Holiday Maker program allows young people to have an extended holiday in Australia while supplementing their funds with short-term work. It is a fantastic way to experience Australian culture, travel, and gain international work experience.</p>
              <p className="t-text-muted leading-relaxed">There are two subclasses: the 417 (Working Holiday) for specific countries, and the 462 (Work and Holiday) for a broader range of countries with additional requirements. Both allow you to stay for 12 months and can potentially be extended to a second or third year.</p>
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
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-visa-gold" />Eligible Countries</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="glass-card p-5">
                  <h3 className="t-text-primary font-semibold mb-3">Subclass 417</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {eligibleCountries417.map((c, i) => <span key={i} className="t-bg-input t-text-faint text-xs px-2 py-1 rounded-full border t-border">{c}</span>)}
                  </div>
                </div>
                <div className="glass-card p-5">
                  <h3 className="t-text-primary font-semibold mb-3">Subclass 462</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {eligibleCountries462.map((c, i) => <span key={i} className="t-bg-input t-text-faint text-xs px-2 py-1 rounded-full border t-border">{c}</span>)}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Plane className="w-5 h-5 text-visa-gold" />Work and Study Rights</h2>
              <div className="glass-card p-6">
                <ul className="space-y-3">
                  {workRights.map((right, index) => (
                    <li key={index} className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{right}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-visa-gold" />Specified Work for Second/Third Year</h2>
              <div className="glass-card p-6 border-visa-gold/20">
                <p className="t-text-muted text-sm mb-4">To qualify for a second or third Working Holiday visa, you must complete 3 months (88 days) of specified work in regional Australia:</p>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {specifiedWork.map((work, index) => (
                    <li key={index} className="flex items-start gap-2"><span className="text-visa-gold mt-1">&#8226;</span><span className="t-text-muted text-sm">{work}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Backpack className="w-5 h-5 text-visa-gold" />How We Can Help</h2>
              <div className="glass-card p-6">
                <ul className="grid sm:grid-cols-2 gap-3">
                  {services.map((service, index) => (
                    <li key={index} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{service}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-400" />Common Issues</h2>
              <div className="glass-card p-6 border-red-500/20">
                <ul className="space-y-3">
                  {[
                    'Applying too close to your 31st birthday (must be 30 or under at time of application)',
                    'Insufficient funds evidence (need approx. $ 5,000 AUD + return ticket)',
                    'Working for the same employer for more than 6 months (not allowed)',
                    'Not maintaining adequate health insurance',
                    'Overstaying the visa expiry date',
                  ].map((reason, index) => (
                    <li key={index} className="flex items-start gap-3"><AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{reason}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 border-visa-gold/30">
              <h3 className="text-lg font-bold t-text-primary mb-3">Ready to Apply?</h3>
              <p className="t-text-faint text-sm mb-4">Start your Australian adventure with expert guidance.</p>
              <Link to="/contact" className="btn-primary w-full text-center block mb-2">Book Consultation</Link>
              <p className="t-text-ghost text-xs text-center">$ 330 AUD/hour (pro rata)</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Government Fees</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="t-text-faint">Base application charge</span><span className="t-text-primary font-medium">$ 670 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">Second year extension</span><span className="t-text-primary font-medium">$ 670 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">Third year extension</span><span className="t-text-primary font-medium">$ 670 AUD</span></div>
              </div>
              <p className="t-text-ghost text-xs mt-3">Subject to change by Department of Home Affairs</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Related Visas</h3>
              <ul className="space-y-3">
                <li><Link to="/visas/skills-in-demand-482" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Skills in Demand 482 (skilled work)</Link></li>
                <li><Link to="/visas/visitor-visa-600" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Visitor Visa 600</Link></li>
                <li><Link to="/services/skills-assessments" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Skills Assessment</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default WorkHoliday417;
