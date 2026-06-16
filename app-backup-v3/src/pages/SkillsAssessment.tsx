import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { FileCheck, CheckCircle, Clock, HelpCircle, Building2, GraduationCap, Briefcase, AlertTriangle } from 'lucide-react';

const authorities = [
  { name: 'VETASSESS', fullName: 'Vocational Education and Training Assessment Services', occupations: 'Trades, professional, and general occupations', website: 'https://www.vetassess.com.au' },
  { name: 'ACS', fullName: 'Australian Computer Society', occupations: 'IT, computing, and software engineering', website: 'https://www.acs.org.au' },
  { name: 'Engineers Australia', fullName: 'Engineers Australia', occupations: 'All engineering disciplines', website: 'https://www.engineersaustralia.org.au' },
  { name: 'CPA/CA/IPA', fullName: 'Accounting bodies', occupations: 'Accounting, finance, and auditing', website: 'https://www.cpaaustralia.com.au' },
  { name: 'ANMAC', fullName: 'Australian Nursing & Midwifery Accreditation Council', occupations: 'Nurses and midwives', website: 'https://www.anmac.org.au' },
  { name: 'TRA', fullName: 'Trades Recognition Australia', occupations: 'Trade occupations (electricians, plumbers, chefs, etc.)', website: 'https://www.dewr.gov.au/tra' },
  { name: 'AIM', fullName: 'Australian Institute of Management', occupations: 'Management and executive roles', website: 'https://www.aim.com.au' },
  { name: 'AACA', fullName: 'Architects Accreditation Council of Australia', occupations: 'Architects', website: 'https://www.aaca.org.au' },
  { name: 'AITSOL', fullName: 'Australian Institute of Teaching and School Leadership', occupations: 'Teachers and educators', website: 'https://www.aitsl.edu.au' },
];

const processSteps = [
  'Identify your nominated occupation and its ANZSCO code',
  'Determine the correct assessing authority for your occupation',
  'Review the specific requirements of that assessing authority',
  'Gather qualifications (degrees, diplomas, certificates)',
  'Obtain detailed employment references from all employers',
  'Prepare supporting documents (transcripts, registration, CV)',
  'Submit your application online with the required fee',
  'Await assessment outcome (typically 4 weeks to 6 months)',
];

const ourServices = [
  'Initial consultation to identify your occupation and pathway',
  'Guidance on selecting the correct assessing authority',
  'Document checklist tailored to your specific occupation',
  'Review and feedback on your qualifications and experience',
  'Assistance preparing employment reference templates',
  'Application review before submission',
  'Follow-up with assessing authority if required',
  'Advice on next steps after a positive assessment',
];

const SkillsAssessment = () => (
  <Layout>
    <section className="relative pt-32 pb-20 t-bg-body overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <img src="/imgs/aboriginal-turtle.png" alt="" className="absolute bottom-0 right-0 w-32 h-32 opacity-10 pointer-events-none" aria-hidden="true" loading="lazy" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <FileCheck className="w-4 h-4 text-visa-gold" aria-hidden="true" />
            <span className="t-text-primary text-sm font-medium">Skills Assessment</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">Skills <span className="text-gradient-gold">Assessment</span></h1>
          <p className="t-text-muted text-lg leading-relaxed mb-8">A mandatory step for most skilled migration pathways. We help you get your qualifications and experience assessed by the relevant Australian assessing authority.</p>
          <p className="t-text-ghost text-sm mt-4">Professional fee from $3,300 AUD | Government charges apply separately</p>
        </div>
      </div>
    </section>

    <section className="py-10 t-bg-body border-b t-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-5 text-center"><Clock className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Processing Time</p><p className="t-text-primary font-semibold">4 wks - 6 mths</p></div>
          <div className="glass-card p-5 text-center"><Briefcase className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Our Fee (from)</p><p className="t-text-primary font-semibold">$3,300 AUD</p></div>
          <div className="glass-card p-5 text-center"><GraduationCap className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Valid For</p><p className="t-text-primary font-semibold">2-3 years</p></div>
          <div className="glass-card p-5 text-center"><Briefcase className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Occupations</p><p className="t-text-primary font-semibold">500+ covered</p></div>
        </div>
      </div>
    </section>

    <section className="section-padding t-bg-body relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4">What is a Skills Assessment?</h2>
              <p className="t-text-muted leading-relaxed mb-4">A skills assessment is an official evaluation of your qualifications and work experience by a recognised Australian assessing authority. It determines whether your skills meet Australian standards for your nominated occupation.</p>
              <p className="t-text-muted leading-relaxed mb-4">Most skilled visa pathways require a positive skills assessment before you can lodge an Expression of Interest (EOI) or visa application. Without it, you cannot proceed with your skilled migration application.</p>
              <div className="glass-card p-5 border-visa-gold/20 mt-6">
                <p className="t-text-secondary text-sm"><span className="text-visa-gold font-semibold">Important:</span> Each assessing authority has its own requirements, fee structure, and processing time. Choosing the right authority for your occupation is critical.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-visa-gold" />Major Assessing Authorities</h2>
              <div className="space-y-3">
                {authorities.map((auth, i) => (
                  <div key={i} className="glass-card p-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="t-text-primary font-medium text-sm">{auth.name}</h3>
                      <p className="t-text-ghost text-xs">{auth.occupations}</p>
                    </div>
                    <a href={auth.website} target="_blank" rel="noopener noreferrer" className="text-visa-teal text-xs hover:text-visa-gold transition-colors">Visit website &rarr;</a>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-visa-gold" />The Assessment Process</h2>
              <div className="glass-card p-6">
                <ol className="space-y-3">
                  {processSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-visa-gold/20 text-visa-gold text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <span className="t-text-secondary text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><FileCheck className="w-5 h-5 text-visa-gold" />Our Services</h2>
              <div className="glass-card p-6">
                <ul className="grid sm:grid-cols-2 gap-3">
                  {ourServices.map((s, i) => (
                    <li key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{s}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-visa-gold" />Common Challenges</h2>
              <div className="glass-card p-6 border-visa-gold/20">
                <ul className="space-y-3 t-text-muted text-sm">
                  <li className="flex items-start gap-2"><span className="text-visa-gold">&#8226;</span>Employment references missing key details (dates, duties, hours worked)</li>
                  <li className="flex items-start gap-2"><span className="text-visa-gold">&#8226;</span>Overseas qualifications not recognised without equivalence assessment</li>
                  <li className="flex items-start gap-2"><span className="text-visa-gold">&#8226;</span>Gaps in employment history not adequately explained</li>
                  <li className="flex items-start gap-2"><span className="text-visa-gold">&#8226;</span>Applying to the wrong assessing authority for the occupation</li>
                  <li className="flex items-start gap-2"><span className="text-visa-gold">&#8226;</span>Insufficient documentation of relevant work experience</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 border-visa-gold/30">
              <h3 className="text-lg font-bold t-text-primary mb-3">Need a Skills Assessment?</h3>
              <p className="t-text-faint text-sm mb-4">Our agents will guide you through the entire process.</p>
              <Link to="/contact" className="btn-primary w-full text-center block mb-2">Book Consultation</Link>
              <p className="t-text-ghost text-xs text-center">$330 AUD/hour (pro rata)</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-bold t-text-primary mb-3">Why It Matters</h3>
              <p className="t-text-faint text-sm leading-relaxed">A positive skills assessment is not just a visa requirement - it also helps you understand how your qualifications align with Australian standards and can strengthen your overall migration strategy.</p>
            </div>
            <div className="glass-card p-6 border-red-500/20">
              <div className="flex items-center gap-3 mb-3"><HelpCircle className="w-5 h-5 text-red-400" /><h3 className="font-semibold t-text-primary">Not Sure Where to Start?</h3></div>
              <p className="t-text-faint text-sm mb-3">Book a consultation to identify your pathway.</p>
              <a href="mailto:info@visa2.au" className="text-visa-gold text-sm hover:text-visa-goldLight">info@visa2.au</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default SkillsAssessment;
