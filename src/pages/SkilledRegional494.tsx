import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { MapPin, CheckCircle, Clock, FileText, HelpCircle, Building2, Award, ExternalLink, GraduationCap, Languages, ArrowRight , Briefcase} from 'lucide-react';

const vs482 = [
  { feature: 'Skills Assessment', visa482: 'Not always required (some exemptions apply)', visa494: 'Mandatory for all applicants', highlight: true },
  { feature: 'English Requirement', visa482: 'Competent English (IELTS 5.0 overall)', visa494: 'Higher English requirement (Competent+, IELTS 5.0+ per band)', highlight: true },
  { feature: 'Work Experience', visa482: '1 year minimum', visa494: '3 years minimum in nominated occupation', highlight: false },
  { feature: 'Location', visa482: 'Anywhere in Australia', visa494: 'Designated regional areas only', highlight: false },
  { feature: 'Pathway to PR', visa482: 'Subclass 186 (Employer Nomination)', visa494: 'Subclass 191 (Regional PR) after 3 years', highlight: false },
  { feature: 'Age Limit', visa482: 'No age limit for visa (but 45 for PR pathway)', visa494: 'Must be under 45 at time of application', highlight: false },
  { feature: 'SAF Levy', visa482: 'Paid by employer', visa494: 'Paid by employer', highlight: false },
];

const requirements = [
  'Be under 45 years of age at the time of application',
  'Have at least 3 years of relevant work experience in your nominated occupation',
  'Have a positive skills assessment from the relevant assessing authority for your occupation',
  'Meet Competent English or higher (IELTS 5.0 minimum in each band)',
  'Be nominated by an approved employer in a designated regional area',
  'Have an occupation on the relevant skilled occupation list',
  'Meet health and character requirements',
];

const englishRequirements = [
  { test: 'IELTS Academic / General Training', minimum: 'At least 5.0 in each of the four test components' },
  { test: 'PTE Academic', minimum: 'At least 36 in each of the four test components' },
  { test: 'TOEFL iBT', minimum: 'At least 35 in each of the four test components' },
  { test: 'OET', minimum: 'At least B in each of the four test components' },
  { test: 'Cambridge C1 Advanced', minimum: 'At least 154 in each of the four test components' },
];

const damaNote = [
  'DAMA arrangements can also facilitate 494 nominations with concessions on English requirements, skills assessments, and experience thresholds',
  'Regional employers endorsed under an active DAMA may have access to a broader range of occupations for 494 sponsorship',
  'The 494 visa requires work in designated regional areas - all of Australia except Sydney, Melbourne, and Brisbane qualifies',
  'DAMA endorsement from the relevant regional authority is a prerequisite for DAMA-concession nominations',
];

const pathwayTo191 = [
  { step: 'Hold a 494 visa', desc: 'Work for your nominating employer in a designated regional area for at least 3 years.' },
  { step: 'Meet Income Requirement', desc: 'Earn at least the minimum taxable income threshold for 3 consecutive years (currently $53,900 AUD annually, subject to change).' },
  { step: 'Comply with Visa Conditions', desc: 'Work only in your nominated occupation and live in the designated regional area throughout the 3-year period.' },
  { step: 'Apply for Subclass 191', desc: 'After 3 years, apply for the Permanent Residence (Skilled Regional) visa (subclass 191) - no further skills assessment or English test required.' },
];

const services = [
  'Complete eligibility assessment for both employer and employee',
  'Skills assessment coordination and preparation',
  'Employer nomination application preparation',
  'Employee visa application lodgement',
  'Regional area compliance guidance',
  'Pathway to subclass 191 PR strategy',
  'Document compilation and review',
  'Communication with Department of Home Affairs',
];

const SkilledRegional494 = () => (
  <Layout>
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/imgs/hero-outback.jpg" alt="Australian regional landscape" className="w-full h-full object-cover" style={{ objectPosition: "center 30%" }} width="1920" height="1080" loading="eager" />
        <div className="absolute inset-0 hero-gradient" />
      </div>
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <MapPin className="w-4 h-4 text-visa-gold" />
            <span className="t-text-primary text-sm font-medium">Regional Employer Sponsored</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">Skilled Employer Regional Visa <span className="text-gradient-gold">Subclass 494</span></h1>
          <p className="t-text-muted text-lg leading-relaxed mb-8">A provisional visa for skilled workers nominated by an employer in designated regional Australia. The 494 visa requires higher qualifications than the 482 but offers a direct pathway to permanent residency through the subclass 191 visa.</p>
          <p className="t-text-ghost text-sm">Professional fee from $ 4,400 AUD | Government charges apply separately</p>
        </div>
      </div>
    </section>

    <section className="py-10 t-bg-body border-b t-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-5 text-center"><Clock className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Processing Time</p><p className="t-text-primary font-semibold">3-8 months</p></div>
          <div className="glass-card p-5 text-center"><Briefcase className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Our Fee (from)</p><p className="t-text-primary font-semibold">$ 4,400 AUD</p></div>
          <div className="glass-card p-5 text-center"><FileText className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Duration</p><p className="t-text-primary font-semibold">5 years</p></div>
          <div className="glass-card p-5 text-center"><Award className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Pathway to PR</p><p className="t-text-primary font-semibold">Subclass 191</p></div>
        </div>
      </div>
    </section>

    <section className="section-padding t-bg-body relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4">What is the Skilled Employer Regional Visa (Subclass 494)?</h2>
              <p className="t-text-muted leading-relaxed mb-4">The Skilled Employer Regional Sponsored (Provisional) visa (subclass 494) replaced the 187 visa in November 2019. It is a 5-year provisional visa for skilled workers nominated by an employer in designated regional areas of Australia.</p>
              <p className="t-text-muted leading-relaxed mb-4">Unlike the 482 Skills in Demand visa, the 494 has stricter requirements including mandatory skills assessments, higher English proficiency, and a minimum of 3 years work experience. In return, it offers a clearer and more direct pathway to permanent residency through the subclass 191 visa.</p>
              <div className="glass-card p-5 border-visa-gold/20 mt-4">
                <p className="t-text-secondary text-sm"><span className="text-visa-gold font-semibold">Key Advantage:</span> The subclass 494 is not subject to the same occupation list restrictions as the 482 SID visa for certain occupations, making it a valuable alternative for skilled workers whose occupations may not be on the Core Skills Occupation List.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-visa-gold" />494 vs 482 - Key Differences</h2>
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b t-border">
                        <th className="text-left t-text-muted font-medium p-4">Feature</th>
                        <th className="text-left t-text-muted font-medium p-4">SID 482</th>
                        <th className="text-left text-visa-gold font-medium p-4">494 (This Visa)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vs482.map((row, i) => (
                        <tr key={i} className={`border-b t-border ${row.highlight ? 'bg-visa-gold/5' : ''}`}>
                          <td className="p-4 t-text-primary font-medium">{row.feature}</td>
                          <td className="p-4 t-text-faint">{row.visa482}</td>
                          <td className="p-4 t-text-secondary">{row.visa494}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-visa-gold" />Mandatory Skills Assessment</h2>
              <div className="glass-card p-6 border-visa-gold/20">
                <p className="t-text-muted text-sm mb-4">Unlike the 482 visa, the 494 visa requires a mandatory positive skills assessment from the relevant assessing authority before you can lodge your application. This is a non-negotiable requirement with very few exceptions.</p>
                <p className="t-text-muted text-sm mb-4">The skills assessment evaluates whether your qualifications and work experience meet Australian standards for your nominated occupation. Each occupation has a designated assessing authority, and requirements vary significantly between occupations.</p>
                <Link to="/services/skills-assessments" className="text-visa-teal text-sm hover:text-visa-gold transition-colors flex items-center gap-1">
                  Learn about Skills Assessments <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Languages className="w-5 h-5 text-visa-gold" />English Language Requirements</h2>
              <div className="glass-card p-6">
                <p className="t-text-muted text-sm mb-4">The 494 visa requires a higher level of English proficiency than the 482 visa. You must achieve the minimum scores in each of the four test components:</p>
                <div className="space-y-2">
                  {englishRequirements.map((eng, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:justify-between gap-1 py-2 border-b t-border last:border-0">
                      <span className="t-text-primary font-medium text-sm">{eng.test}</span>
                      <span className="t-text-faint text-sm">{eng.minimum}</span>
                    </div>
                  ))}
                </div>
                <a href="https://immi.homeaffairs.gov.au/help-support/departmental-forms/online-forms/pdf/english-language-requirements.pdf" target="_blank" rel="noopener noreferrer" className="text-visa-teal text-xs hover:text-visa-gold transition-colors flex items-center gap-1 mt-4">
                  <ExternalLink className="w-3 h-3" />Full English requirements on Immi website
                </a>
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
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-visa-gold" />Pathway to PR - Subclass 191</h2>
              <p className="t-text-muted text-sm mb-4">The subclass 494 leads to permanent residency through the Permanent Residence (Skilled Regional) visa (subclass 191). Here is the pathway:</p>
              <div className="space-y-4">
                {pathwayTo191.map((stage, index) => (
                  <div key={index} className="glass-card p-5 flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-visa-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-visa-gold font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="t-text-primary font-semibold mb-1">{stage.step}</h3>
                      <p className="t-text-faint text-sm">{stage.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="glass-card p-5 border-visa-gold/20 mt-4">
                <p className="t-text-secondary text-sm"><span className="text-visa-gold font-semibold">Note:</span> The subclass 191 has no skills assessment requirement, no English test requirement, and no points test. If you meet the 3-year work and residence requirements, you are eligible to apply.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-visa-gold" />DAMA & Regional Concessions</h2>
              <p className="t-text-muted text-sm mb-4">The 494 visa is intrinsically linked to regional Australia. Employers in DAMA-designated regions may benefit from significant concessions when sponsoring 494 visa holders.</p>
              <div className="glass-card p-6 border-visa-gold/20">
                <ul className="space-y-3 mb-4">
                  {damaNote.map((item, i) => (
                    <li key={i} className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-gold shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{item}</span></li>
                  ))}
                </ul>
                <Link to="/employers#dama" className="text-visa-teal text-sm hover:text-visa-gold transition-colors flex items-center gap-1">
                  Learn more about DAMA arrangements <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-visa-gold" />Designated Regional Areas</h2>
              <div className="glass-card p-6">
                <p className="t-text-muted text-sm mb-4">The 494 visa requires you to work and live in designated regional areas of Australia. This includes all of Australia except Sydney, Melbourne, and Brisbane. Perth, Adelaide, Gold Coast, and most of Australia are classified as regional.</p>
                <a href="https://immi.homeaffairs.gov.au/visas/working-in-australia/regional-migration" target="_blank" rel="noopener noreferrer" className="text-visa-teal text-sm hover:text-visa-gold transition-colors flex items-center gap-1">
                  <ExternalLink className="w-4 h-4" />Check designated regional areas on Immi website
                </a>
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

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><ExternalLink className="w-5 h-5 text-visa-gold" />Official Resources</h2>
              <div className="glass-card p-6 space-y-3">
                <a href="https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors">
                  <ExternalLink className="w-4 h-4" />Department of Home Affairs - Skilled Occupation List
                </a>
                <a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-employer-sponsored-regional-494" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors">
                  <ExternalLink className="w-4 h-4" />Subclass 494 - Official Visa Page
                </a>
                <a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/permanent-residence-skilled-regional-191" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors">
                  <ExternalLink className="w-4 h-4" />Subclass 191 PR Pathway - Official Page
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 border-visa-gold/30">
              <h3 className="text-lg font-bold t-text-primary mb-3">Book a Consultation</h3>
              <p className="t-text-faint text-sm mb-4">Discuss the 494 visa pathway with our registered agents.</p>
              <Link to="/contact" className="btn-primary w-full text-center block mb-2">Book Consultation</Link>
              <p className="t-text-ghost text-xs text-center">$ 330 AUD/hour (pro rata)</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Government & SAF Fees</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="t-text-faint">Skills assessment</span><span className="t-text-primary font-medium">$ 500-1,200 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">SAF levy (one-time)</span><span className="t-text-primary font-medium">$ 3,000-5,000 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">Visa application (main)</span><span className="t-text-primary font-medium">$ 4,910 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">Additional applicant (18+)</span><span className="t-text-primary font-medium">$ 2,320 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">Additional applicant (under 18)</span><span className="t-text-primary font-medium">$ 1,160 AUD</span></div>
              </div>
              <p className="t-text-ghost text-xs mt-3">Subject to change by Department of Home Affairs</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Related Visas</h3>
              <ul className="space-y-3">
                <li><Link to="/visas/skills-in-demand-482" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Skills in Demand 482 (SID)</Link></li>
                <li><Link to="/visas/employer-nomination-186" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Employer Nomination 186 (PR)</Link></li>
                <li><Link to="/employers" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Employer Hub</Link></li>
                <li><Link to="/services/skills-assessments" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Skills Assessment</Link></li>
              </ul>
            </div>
            <div className="glass-card p-6 border-red-500/20">
              <div className="flex items-center gap-3 mb-3"><HelpCircle className="w-5 h-5 text-red-400" /><h3 className="font-semibold t-text-primary">Need Advice?</h3></div>
              <p className="t-text-faint text-sm mb-3">Not sure whether 482 or 494 is right for you?</p>
              <a href="mailto:info@visa2.au" className="text-visa-gold text-sm hover:text-visa-goldLight">info@visa2.au</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default SkilledRegional494;
