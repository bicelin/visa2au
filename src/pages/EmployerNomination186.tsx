import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { Award, CheckCircle, Clock, FileText, MapPin, Building2 , Briefcase} from 'lucide-react';

const streams = [
  { name: 'Temporary Residence Transition', desc: 'For workers who have held a TSS visa (subclass 482) for at least 3 years with the same employer. This is the most common pathway.', requirements: ['3 years on TSS visa', 'Under 45 (exceptions)', 'Competent English'], who: 'Current TSS visa holders' },
  { name: 'Direct Entry', desc: 'For applicants who have never worked in Australia or have only worked briefly. Requires a positive skills assessment.', requirements: ['Skills assessment', '3+ years experience', 'Under 45', 'Competent English'], who: 'Overseas skilled workers' },
  { name: 'Labour Agreement', desc: 'For workers sponsored under a labour agreement between the employer and the Australian Government.', requirements: ['As per agreement terms', 'Under 45', 'English requirements vary'], who: 'Agreement-specific workers' },
];

const requirements = [
  'Have an Australian employer willing to nominate you for a permanent position',
  'Be under 45 years of age at the time of application (some exemptions apply)',
  'Have a positive skills assessment in your nominated occupation (Direct Entry stream)',
  'Have at least 3 years of relevant work experience (Direct Entry stream)',
  'Meet the English language requirement (Competent English)',
  'Meet health and character requirements',
  'The employer must pay the Skilling Australia Fund (SAF) levy',
];

const benefits = [
  'Permanent residency from day one',
  'Live and work in Australia indefinitely',
  'Access to Medicare (Australia\'s public health system)',
  'Sponsor eligible family members',
  'Travel to and from Australia for 5 years',
  'Apply for Australian citizenship after meeting residence requirements',
  'Access to social security benefits after qualifying period',
];

const services = [
  'Employer nomination application preparation',
  'Employee visa application lodgement',
  'Skills assessment coordination (Direct Entry)',
  'Skilling Australia Fund (SAF) levy guidance',
  'Labour Market Testing advice (if required)',
  'Compliance and ongoing sponsorship obligations',
  'Family member inclusion strategy',
];

const EmployerNomination186 = () => (
  <Layout>
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/imgs/hero-employer.jpg" alt="Australian corporate office - employer nomination visa" className="w-full h-full object-cover" style={{ objectPosition: "center 30%" }} width="1920" height="1080" loading="eager" />
        <div className="absolute inset-0 hero-gradient" />
      </div>
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Award className="w-4 h-4 text-visa-gold" />
            <span className="t-text-primary text-sm font-medium">Permanent Employer Sponsored</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">Employer Nomination Scheme <span className="text-gradient-gold">Subclass 186</span></h1>
          <p className="t-text-muted text-lg leading-relaxed mb-8">The Employer Nomination Scheme (ENS) visa is a permanent residence visa for skilled workers nominated by their Australian employer. It provides immediate permanent residency, allowing you to live and work in Australia indefinitely.</p>
          <p className="t-text-ghost text-sm mt-4">Professional fee from $ 4,400 AUD | Government charges apply separately</p>
        </div>
      </div>
    </section>

    <section className="py-10 t-bg-body border-b t-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-5 text-center"><Clock className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Processing Time</p><p className="t-text-primary font-semibold">6-12 months</p></div>
          <div className="glass-card p-5 text-center"><Briefcase className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Our Fee (from)</p><p className="t-text-primary font-semibold">$ 4,400 AUD</p></div>
          <div className="glass-card p-5 text-center"><FileText className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Visa Type</p><p className="t-text-primary font-semibold">Permanent</p></div>
          <div className="glass-card p-5 text-center"><MapPin className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Apply From</p><p className="t-text-primary font-semibold">Anywhere</p></div>
        </div>
      </div>
    </section>

    <section className="section-padding t-bg-body relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4">What is the Employer Nomination Scheme (Subclass 186)?</h2>
              <p className="t-text-muted leading-relaxed mb-4">The Employer Nomination Scheme (ENS) visa, subclass 186, is a permanent residence visa that allows Australian employers to nominate skilled overseas workers to fill positions they cannot fill from the local labour market.</p>
              <p className="t-text-muted leading-relaxed">Unlike the temporary TSS visa (subclass 482), the 186 visa grants permanent residency from the outset. This means you and your family can live in Australia indefinitely, access Medicare, and eventually apply for Australian citizenship.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-visa-gold" />Three Streams</h2>
              <div className="space-y-4">
                {streams.map((stream, index) => (
                  <div key={index} className="glass-card p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h3 className="text-lg font-semibold t-text-primary">{stream.name}</h3>
                      <span className="text-visa-teal text-xs">{stream.who}</span>
                    </div>
                    <p className="t-text-faint text-sm mb-2">{stream.desc}</p>
                    <div className="flex flex-wrap gap-2 text-xs t-text-ghost">
                      {stream.requirements.map((req, i) => <span key={i} className="glass-card px-2 py-0.5">{req}</span>)}
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
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-visa-gold" />Benefits of Permanent Residency</h2>
              <div className="glass-card p-6">
                <ul className="grid sm:grid-cols-2 gap-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{benefit}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-visa-gold" />How We Can Help</h2>
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
              <p className="t-text-faint text-sm mb-4">For both employers and employees seeking permanent residency.</p>
              <Link to="/contact" className="btn-primary w-full text-center block mb-2">Book Consultation</Link>
              <p className="t-text-ghost text-xs text-center">$ 330 AUD/hour (pro rata)</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Government & SAF Fees</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="t-text-faint">Nomination fee</span><span className="t-text-primary font-medium">$ 540 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">SAF levy (one-time)</span><span className="t-text-primary font-medium">$ 3,000-5,000 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">Visa application (main)</span><span className="t-text-primary font-medium">$ 4,910 AUD</span></div>
              </div>
              <p className="t-text-ghost text-xs mt-3">Subject to change by Department of Home Affairs</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Related Services</h3>
              <ul className="space-y-3">
                <li><Link to="/visas/skills-in-demand-482" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Skills in Demand 482 (TSS pathway)</Link></li>
                <li><Link to="/employers" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Employer Hub</Link></li>
                <li><Link to="/services/skills-assessments" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Skills Assessment</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default EmployerNomination186;
