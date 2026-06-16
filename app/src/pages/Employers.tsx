import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Building2, CheckCircle, Clock, ArrowRight, FileText, Users, Briefcase, Award, Globe, Handshake, TrendingUp, MapPin, ExternalLink } from 'lucide-react';

const whySponsor = [
  'Address genuine skills shortages in your business',
  'Access a global talent pool of skilled workers',
  'Retain valuable employees long-term through permanent pathways',
  'Meet seasonal or project-based workforce needs',
  'Gain a competitive edge in your industry',
];

const sponsorshipTypes = [
  { name: 'Skills in Demand (SID) 482', desc: 'Sponsor skilled workers for up to 4 years. Core Skills and Specialist Skills streams available. Pathway to PR after 2 years.', icon: Briefcase, link: '/visas/skills-in-demand-482' },
  { name: 'Employer Nomination Scheme (ENS) 186', desc: 'Nominate skilled workers for permanent residency directly. Three streams available including Temporary Residence Transition.', icon: Award, link: '/visas/employer-nomination-186' },
  { name: 'Skilled Employer Regional (SESR) 494', desc: 'Sponsor skilled workers for regional positions. Leads to permanent residency (subclass 191) after 3 years.', icon: Globe, link: '/visas/skilled-regional-494' },
  { name: 'Designated Area Migration Agreement (DAMA)', desc: 'Tailored labour agreement for specific regional areas with concessions on occupation lists, English, skills, and income thresholds.', icon: MapPin, link: '#dama' },
  { name: 'Labour Agreement', desc: 'Custom negotiated agreement with the Department of Home Affairs for specific workforce needs not covered by standard pathways.', icon: Handshake, link: '#labour-agreements' },
];

const highIncomeThresholds = [
  { stream: 'SID Core Skills Stream', min: '$79,499 AUD', note: 'Core Skills Income Threshold (CSIT) from 1 July 2026' },
  { stream: 'SID Specialist Skills Stream', min: '$146,717 AUD', note: 'Specialist Skills Income Threshold (SSIT) from 1 July 2026. No occupation list restrictions.' },
  { stream: '494 SESR Visa', min: '$79,499 AUD', note: 'Market salary rate for regional sponsorship (CSIT-aligned)' },
  { stream: '186 ENS Direct Entry', min: 'Market rate', note: 'Must meet the market salary rate for the nominated occupation' },
];

const streamComparison = [
  { feature: 'Occupation List', coreSkills: 'Core Skills Occupation List (CSOL) required', specialistSkills: 'No occupation list required (ANZSCO 1,2,4,5,6)' },
  { feature: 'Minimum Income', coreSkills: '$79,499 AUD (CSIT from 1 July 2026)', specialistSkills: '$146,717 AUD (SSIT from 1 July 2026)' },
  { feature: 'English Requirement', coreSkills: 'IELTS 5.0 overall (no band <5.0)', specialistSkills: 'Same as Core Skills' },
  { feature: 'Work Experience', coreSkills: '1 year full-time in nominated occupation', specialistSkills: '1 year full-time in nominated occupation' },
  { feature: 'Skills Assessment', coreSkills: 'Required for most occupations', specialistSkills: 'Required for most occupations' },
  { feature: 'Excluded Occupations', coreSkills: 'None (if on CSOL)', specialistSkills: 'Trades (Skill Level 3), machinery operators/drivers (Level 8), labourers (Level 9)' },
  { feature: 'Duration', coreSkills: 'Up to 4 years', specialistSkills: 'Up to 4 years' },
  { feature: 'Pathway to PR', coreSkills: 'Subclass 186 after 2 years', specialistSkills: 'Subclass 186 after 2 years' },
  { feature: 'Processing', coreSkills: 'Standard', specialistSkills: 'Fast-tracked priority processing' },
];

const specialistSkillsDetails = [
  { label: 'Specialist Skills Income Threshold (SSIT)', value: '$146,717 AUD', note: 'From 1 July 2026. The higher of the SSIT or the annual market salary rate (AMSR) applies.' },
  { label: 'ANZSCO Occupation Eligibility', value: 'Skill Levels 1, 2, 4, 5, 6', note: 'Excludes trades workers (Skill Level 3), machinery operators and drivers (Skill Level 8), and labourers (Skill Level 9).' },
  { label: 'Occupation List Requirement', value: 'None', note: 'The Specialist Skills Stream does not require the occupation to be on a specific skilled occupation list.' },
  { label: 'Work Experience', value: '1 year minimum', note: 'Applicants must have at least 1 year of relevant full-time work experience in their nominated occupation.' },
  { label: 'Processing', value: 'Fast-tracked', note: 'Applications in this stream typically receive priority processing.' },
];

const damaRegions = [
  { region: 'Adelaide City and Regional South Australia', status: 'Active', concessions: 'Reduced English requirements, lower skills thresholds, broader occupation list, lower minimum salary for some occupations', employers: 'Over 1,000 endorsed employers across South Australia including regional employers', note: 'Two DAMAs covering Adelaide and all of regional SA' },
  { region: 'Northern Territory', status: 'Active', concessions: 'Lower English requirements for some occupations, age concessions (up to 50), skills concessions, broader occupation list', employers: 'All NT employers can access concessions through the NT DAMA', note: 'One DAMA covering the entire Northern Territory' },
  { region: 'Orana, NSW', status: 'Active', concessions: 'English and skills concessions for selected occupations, pathways to PR available', employers: 'Endorsed employers in the Orana region (Dubbo, Wagga, etc.)', note: 'Covers a large portion of central and western NSW' },
  { region: 'Far North Queensland', status: 'Active', concessions: 'Concessions on English, skills, and experience for selected occupations', employers: 'Employers in Cairns and surrounding FNQ region', note: 'Supports tourism and hospitality industries' },
  { region: 'Goldfields, Western Australia', status: 'Active', concessions: 'Skills and English concessions for mining-related occupations', employers: 'Mining and resources sector employers in the Kalgoorlie region', note: 'Focus on supporting the mining industry workforce' },
  { region: 'Great South Coast, Victoria', status: 'Active', concessions: 'Lower thresholds for selected occupations in dairy, agriculture, and manufacturing', employers: 'Endorsed employers across the Great South Coast region', note: 'Supports dairy farming and agricultural sectors' },
  { region: 'South West, Western Australia', status: 'Active', concessions: 'Broader occupation list including trades and hospitality, English and skills concessions', employers: 'Endorsed employers in the Bunbury and Margaret River region', note: 'Supports tourism, hospitality, and trades sectors' },
  { region: 'Pilbara, Western Australia', status: 'Active', concessions: 'Skills and experience concessions for mining and resources occupations', employers: 'Mining and resources employers in the Pilbara region', note: 'Focus on FIFO and residential workforce needs' },
  { region: 'East Kimberley, Western Australia', status: 'Active', concessions: 'Lower English requirements, broader occupation list including tourism and hospitality', employers: 'Endorsed employers in the East Kimberley region', note: 'Supports tourism and remote community services' },
  { region: 'West Kimberley, Western Australia', status: 'Active', concessions: 'Similar to East Kimberley DAMA with tourism and hospitality focus', employers: 'Endorsed employers in the West Kimberley region', note: 'Broome and surrounding areas' },
];

const labourAgreementTypes = [
  { type: 'Company-Specific Labour Agreement', desc: 'Negotiated directly between an employer and the Department of Home Affairs for specific, unique workforce needs that cannot be met through standard visa programs.', useCase: 'Large-scale projects, niche industries, or specific skills not on standard occupation lists' },
  { type: 'Industry Labour Agreement', desc: 'A pre-negotiated agreement template for specific industries with recognised skills shortages.', useCase: 'Aged care, fishing, meat, minister of religion, on-hire, religious institutions, snow sport, and horticulture industries' },
  { type: 'Global Talent Employer Sponsored (GTES)', desc: 'For employers to sponsor highly skilled overseas workers for positions that cannot be filled through other visa programs.', useCase: 'Start-ups, established businesses with innovative practices, and tech companies seeking highly specialised talent' },
  { type: 'DAMA Labour Agreement', desc: 'Part of a broader DAMA framework, providing concessions on standard requirements for endorsed employers in designated areas.', useCase: 'Regional employers who are endorsed under an active DAMA arrangement' },
];

const labourAgreementProcess = [
  { step: 'Initial Consultation & Feasibility Assessment', desc: 'We assess whether a labour agreement is the right pathway for your business and identify which type of agreement suits your needs.' },
  { step: 'Business Case Preparation', desc: 'We prepare a comprehensive business case demonstrating why standard visa pathways are insufficient and why a labour agreement is necessary.' },
  { step: 'Labour Agreement Request (LAR)', desc: 'We lodge the Labour Agreement Request with the Department of Home Affairs, including all supporting evidence and business justifications.' },
  { step: 'Negotiation with Department', desc: 'The Department assesses your request and may negotiate terms including occupation list, concessions, and annual nomination caps.' },
  { step: 'Agreement Execution', desc: 'Once terms are agreed, the labour agreement is executed and your business becomes an approved party to the agreement.' },
  { step: 'Nomination & Visa Applications', desc: 'We then assist with nominating individual workers and lodging their visa applications under the agreed terms.' },
];

const employerObligations = [
  'Pay market salary rates (at least $79,499 AUD per year for Core Skills stream, or $146,717 AUD for Specialist Skills)',
  'Pay the Skilling Australia Fund (SAF) levy for each nomination',
  'Ensure the worker only works in the nominated occupation',
  'Notify the Department of Home Affairs of certain changes',
  'Cooperate with monitoring and compliance activities',
  'Not recover nomination or sponsorship costs from the visa holder',
  'Meet the minimum income threshold for the relevant visa stream',
];

const ourServices = [
  'Eligibility assessment for your business',
  'Standard Business Sponsorship (SBS) application',
  'Nomination application preparation and lodgement',
  'DAMA endorsement application',
  'Labour Agreement negotiation and preparation',
  'Labour Market Testing (LMT) guidance',
  'Market salary rate assessment',
  'SAF levy calculation and payment guidance',
  'Employee visa application assistance',
  'Ongoing compliance and monitoring support',
  'Pathway to permanent residency strategy',
];

const Employers = () => (
  <Layout>
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/imgs/hero-employer.jpg" alt="Australian business office" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 hero-gradient" />
      </div>
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Building2 className="w-4 h-4 text-visa-gold" />
            <span className="t-text-primary text-sm font-medium">For Employers</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">Employer <span className="text-gradient-gold">Sponsorship Hub</span></h1>
          <p className="t-text-muted text-lg leading-relaxed mb-8">Sponsor skilled overseas workers to fill critical positions in your Australian business. From standard sponsorship to DAMA arrangements and custom Labour Agreements - we provide end-to-end employer sponsorship services tailored to your workforce needs.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">Enquire Now <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/visas/skills-in-demand-482" className="btn-secondary inline-flex items-center gap-2">SID Visa 482</Link>
            <Link to="/visas/employer-nomination-186" className="btn-secondary inline-flex items-center gap-2">ENS Visa 186</Link>
            <Link to="/visas/skilled-regional-494" className="btn-secondary inline-flex items-center gap-2">Regional 494</Link>
          </div>
          <p className="t-text-ghost text-sm mt-4">Professional fees from $ 3,300 AUD | Government charges apply separately</p>
        </div>
      </div>
    </section>

    <section className="py-10 t-bg-body border-b t-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-5 text-center"><Clock className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">SBS Processing</p><p className="t-text-primary font-semibold">1-4 weeks</p></div>
          <div className="glass-card p-5 text-center"><Briefcase className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Sponsorship Valid</p><p className="t-text-primary font-semibold">5 years</p></div>
          <div className="glass-card p-5 text-center"><Users className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Nominate</p><p className="t-text-primary font-semibold">Multiple workers</p></div>
          <div className="glass-card p-5 text-center"><Award className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">PR Pathway</p><p className="t-text-primary font-semibold">Available</p></div>
        </div>
      </div>
    </section>

    <section className="section-padding t-bg-body relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold t-text-primary mb-4">Why Sponsor <span className="text-gradient-gold">Overseas Workers?</span></h2>
            <p className="t-text-muted max-w-2xl mx-auto">Australian businesses face genuine skills shortages in many industries. Employer sponsorship is a proven strategy to access global talent and build a sustainable workforce.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whySponsor.map((item, i) => (
              <div key={i} className="glass-card p-5 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-visa-gold shrink-0 mt-0.5" />
                <span className="t-text-secondary text-sm">{item}</span>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-3xl font-bold t-text-primary mb-6 text-center">Sponsorship <span className="text-gradient-gold">Options</span></h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sponsorshipTypes.map((type, i) => (
                <Link key={i} to={type.link} className="glass-card p-6 hover:border-visa-gold/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-visa-gold/10 border border-visa-gold/20 flex items-center justify-center mb-4 group-hover:bg-visa-gold/20 transition-colors">
                    <type.icon className="w-6 h-6 text-visa-gold" />
                  </div>
                  <h3 className="text-lg font-bold t-text-primary mb-2 group-hover:text-visa-gold transition-colors">{type.name}</h3>
                  <p className="t-text-faint text-sm">{type.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Income Thresholds */}
          <div>
            <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-visa-gold" />Minimum Income Requirements</h2>
            <p className="t-text-muted text-sm mb-4">Employers must pay sponsored workers at least the minimum income threshold for their visa stream. These thresholds ensure overseas workers are paid fairly and in line with Australian market rates.</p>
            <div className="glass-card p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b t-border">
                      <th className="text-left t-text-muted font-medium p-3">Visa Stream</th>
                      <th className="text-left t-text-muted font-medium p-3">Minimum Income</th>
                      <th className="text-left t-text-muted font-medium p-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {highIncomeThresholds.map((row, i) => (
                      <tr key={i} className="border-b t-border last:border-0">
                        <td className="p-3 t-text-primary font-medium">{row.stream}</td>
                        <td className="p-3 text-visa-gold font-medium">{row.min}</td>
                        <td className="p-3 t-text-faint">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="glass-card p-5 border-visa-gold/20 mt-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-visa-gold shrink-0 mt-0.5" />
                <div>
                  <p className="t-text-primary font-semibold text-sm">High-Income Specialist Stream (SID 482)</p>
                  <p className="t-text-muted text-sm">For candidates earning $146,717+ AUD annually (SSIT from 1 July 2026), the Specialist Skills Stream removes occupation list restrictions entirely. Any ANZSCO Skill Level 1, 2, 4, 5, or 6 occupation can be sponsored at this income level. The Core Skills Stream requires $79,499+ AUD (CSIT from 1 July 2026) for occupations on the Core Skills Occupation List (CSOL).</p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Skills vs Specialist Skills Comparison */}
          <div id="specialist-skills">
            <h2 className="text-3xl font-bold t-text-primary mb-4 flex items-center gap-2"><FileText className="w-6 h-6 text-visa-gold" />SID Stream Comparison: Core Skills vs Specialist Skills</h2>
            <p className="t-text-muted text-sm mb-4">Understanding the difference between the two main SID streams helps you choose the right pathway for your nominated position.</p>
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b t-border">
                      <th className="text-left t-text-muted font-medium p-4">Feature</th>
                      <th className="text-left t-text-muted font-medium p-4">Core Skills Stream</th>
                      <th className="text-left text-visa-gold font-medium p-4">Specialist Skills Stream</th>
                    </tr>
                  </thead>
                  <tbody>
                    {streamComparison.map((row, i) => (
                      <tr key={i} className="border-b t-border last:border-0">
                        <td className="p-4 t-text-primary font-medium">{row.feature}</td>
                        <td className="p-4 t-text-faint">{row.coreSkills}</td>
                        <td className="p-4 t-text-secondary">{row.specialistSkills}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <h3 className="text-xl font-bold t-text-primary mt-8 mb-4">Specialist Skills Stream - Key Details</h3>
            <div className="glass-card p-6 border-visa-gold/20">
              <div className="space-y-4">
                {specialistSkillsDetails.map((detail, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b t-border last:border-0">
                    <div className="sm:w-64 shrink-0">
                      <span className="t-text-muted text-sm">{detail.label}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-visa-gold font-semibold text-sm">{detail.value}</span>
                      <p className="t-text-ghost text-xs mt-0.5">{detail.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DAMA Section */}
          <div id="dama">
            <h2 className="text-3xl font-bold t-text-primary mb-4 flex items-center gap-2"><MapPin className="w-6 h-6 text-visa-gold" />Designated Area Migration Agreements (DAMA)</h2>
            <p className="t-text-muted leading-relaxed mb-6">DAMAs are formal agreements between the Australian Government and designated regional authorities. They provide employers in those regions with access to overseas workers through tailored visa arrangements that include concessions on standard requirements.</p>

            <div className="glass-card p-6 border-visa-gold/20 mb-6">
              <h3 className="t-text-primary font-semibold mb-3">What Concessions Can DAMAs Offer?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Lower English language requirements (IELTS 4.5-5.0 vs 5.0-5.5)',
                  'Broader occupation lists with additional eligible occupations',
                  'Lower skills and experience requirements for selected occupations',
                  'Age concessions (up to 50 or 55 for some occupations)',
                  'Lower minimum salary thresholds for some occupations',
                  'Permanent residency pathways through DAMA-specific streams',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{item}</span></div>
                ))}
              </div>
            </div>

            <h3 className="text-xl font-bold t-text-primary mb-4">Active DAMA Regions</h3>
            <div className="space-y-3">
              {damaRegions.map((dama, i) => (
                <div key={i} className="glass-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h4 className="t-text-primary font-semibold">{dama.region}</h4>
                    <span className="text-visa-teal text-xs font-medium px-2 py-1 rounded bg-visa-teal/10">{dama.status}</span>
                  </div>
                  <p className="t-text-faint text-sm mb-2"><span className="text-visa-gold">Concessions:</span> {dama.concessions}</p>
                  <p className="t-text-faint text-sm mb-1"><span className="text-visa-teal">Endorsed Employers:</span> {dama.employers}</p>
                  <p className="t-text-ghost text-xs italic">{dama.note}</p>
                </div>
              ))}
            </div>

            <div className="glass-card p-6 mt-4">
              <h3 className="t-text-primary font-semibold mb-3">DAMA Endorsement Process</h3>
              <div className="space-y-3">
                {[
                  { step: 'Contact the Regional Authority', desc: 'Each DAMA has a designated regional authority (e.g., Regional Development Australia) that manages employer endorsement.' },
                  { step: 'Employer Assessment', desc: 'The regional authority assesses your business eligibility, including genuine need, labour market testing, and compliance history.' },
                  { step: 'DAMA Endorsement', desc: 'If approved, the regional authority endorses your business under the DAMA. This endorsement is required before lodging any visa applications.' },
                  { step: 'Visa Nomination & Application', desc: 'Once endorsed, you can nominate workers under the DAMA framework with applicable concessions. We handle the nomination and visa application process.' },
                ].map((stage, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-visa-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-visa-gold font-bold text-sm">{i + 1}</span>
                    </div>
                    <div>
                      <h4 className="t-text-primary font-medium text-sm">{stage.step}</h4>
                      <p className="t-text-faint text-xs">{stage.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="https://immi.homeaffairs.gov.au/visas/employing-and-sponsoring-someone/sponsoring-workers/designated-area-migration-agreements" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors mt-4">
                <ExternalLink className="w-4 h-4" />Department of Home Affairs - DAMA Information
              </a>
            </div>
          </div>

          {/* Labour Agreements */}
          <div id="labour-agreements">
            <h2 className="text-3xl font-bold t-text-primary mb-4 flex items-center gap-2"><Handshake className="w-6 h-6 text-visa-gold" />Labour Agreements</h2>
            <p className="t-text-muted leading-relaxed mb-6">When standard visa pathways do not meet your workforce needs, a Labour Agreement may be the solution. This is a negotiated agreement between your business and the Department of Home Affairs that allows you to sponsor overseas workers under customised conditions.</p>
            <div className="space-y-4 mb-6">
              {labourAgreementTypes.map((la, i) => (
                <div key={i} className="glass-card p-5">
                  <h3 className="t-text-primary font-semibold mb-2">{la.type}</h3>
                  <p className="t-text-faint text-sm mb-1">{la.desc}</p>
                  <p className="t-text-ghost text-xs"><span className="text-visa-gold">Typical use:</span> {la.useCase}</p>
                </div>
              ))}
            </div>
            <h3 className="text-xl font-bold t-text-primary mb-4">Our Labour Agreement Services</h3>
            <div className="glass-card p-6">
              <div className="space-y-3">
                {labourAgreementProcess.map((stage, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-visa-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-visa-gold font-bold text-sm">{i + 1}</span>
                    </div>
                    <div>
                      <h4 className="t-text-primary font-medium text-sm">{stage.step}</h4>
                      <p className="t-text-faint text-xs">{stage.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="t-text-ghost text-xs mt-4">Labour Agreement applications are complex and typically take 3-6 months for approval. Professional fees from $ 11,000 AUD.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-visa-gold" />Employer Obligations</h2>
              <div className="glass-card p-6">
                <ul className="space-y-3">
                  {employerObligations.map((obligation, index) => (
                    <li key={index} className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{obligation}</span></li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-visa-gold" />How We Can Help</h2>
              <div className="glass-card p-6">
                <ul className="space-y-3">
                  {ourServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{service}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 text-center border-visa-gold/30">
            <h2 className="text-2xl font-bold t-text-primary mb-4">Ready to Become a Sponsor?</h2>
            <p className="t-text-muted mb-6 max-w-2xl mx-auto">Contact our team for a consultation about your business's sponsorship needs. We will assess your eligibility and recommend the best pathway - whether standard sponsorship, DAMA, or a custom Labour Agreement.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2">Book Consultation <ArrowRight className="w-4 h-4" /></Link>
              <a href="tel:+61291362462" className="btn-secondary inline-flex items-center gap-2">Call +61 2 9136 2462</a>
            </div>
            <p className="t-text-ghost text-sm mt-4">Consultation fee: $ 330 AUD/hour (pro rata fees may apply)</p>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Employers;
