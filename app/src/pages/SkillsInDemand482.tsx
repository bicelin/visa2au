import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { Briefcase, CheckCircle, Clock, FileText, HelpCircle, MapPin, Building2, Users, ExternalLink, GraduationCap, Languages } from 'lucide-react';

const sidStreams = [
  {
    name: 'Skills in Demand (SID) Visa - Core Skills Stream',
    desc: 'For occupations on the Core Skills Occupation List (CSOL). Up to 4 years. Suitable for most skilled occupations.',
    work: 'Up to 4 years',
    eligible: 'CSOL occupations',
    experience: '1 year minimum',
  },
  {
    name: 'Skills in Demand (SID) Visa - Specialist Skills Stream',
    desc: 'For highly skilled roles earning $146,717+ AUD (SSIT from 1 July 2026). No occupation list restrictions for ANZSCO units 1, 2, 4, 5, 6 (exclusions apply).',
    work: 'Up to 4 years',
    eligible: 'ANZSCO 1, 2, 4, 5, 6 (excl. trades, drivers, labourers)',
    experience: '1 year minimum',
  },
  {
    name: 'Labour Agreement Stream',
    desc: 'For employers who have negotiated a labour agreement with the Australian Government for specific occupations.',
    work: 'Up to 4 years',
    eligible: 'As per agreement',
    experience: 'As per agreement',
  },
];

const eligibilityCriteria = [
  {
    category: 'English Language Proficiency',
    icon: Languages,
    items: [
      'IELTS: Overall score of at least 5.0 (with no band less than 5.0)',
      'PTE Academic: Overall score of at least 36',
      'TOEFL iBT: Overall score of at least 35',
      'OET: Pass in each component',
      'Higher English requirements apply for certain occupations',
    ],
    link: 'https://immi.homeaffairs.gov.au/help-support/departmental-forms/online-forms/pdf/english-language-requirements.pdf',
    linkText: 'Check English requirements on Immi website',
  },
  {
    category: 'Work Experience',
    icon: Briefcase,
    items: [
      'Minimum of 1 year full-time relevant work experience in your nominated occupation',
      'Experience must be at the required skill level',
      'Part-time experience can be counted proportionally',
    ],
    link: 'https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list',
    linkText: 'Verify your occupation eligibility',
  },
  {
    category: 'Qualifications & Skills Assessment',
    icon: GraduationCap,
    items: [
      'Relevant qualifications for your nominated occupation (diploma, degree, or trade certificate)',
      'Skills assessment from the relevant assessing authority (if required for your occupation)',
      'Qualifications must be comparable to Australian standards',
    ],
    link: 'https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list',
    linkText: 'Check if your occupation requires skills assessment',
  },
];

const generalRequirements = [
  'Have an employer willing to sponsor you who is an approved Standard Business Sponsor (SBS)',
  'Your occupation must be on the relevant skilled occupation list (CSOL for Core Skills stream)',
  'Meet the minimum salary threshold ($79,499 AUD CSIT for Core Skills stream, or $146,717 AUD SSIT for Specialist Skills stream from 1 July 2026)',
  'Meet health and character requirements',
];

const sponsorshipSteps = [
  { step: 'Standard Business Sponsorship', desc: 'Employer applies to become an approved sponsor. Valid for 5 years.' },
  { step: 'Nomination', desc: 'Employer nominates a specific position for the overseas worker, including salary and occupation details.' },
  { step: 'Visa Application', desc: 'The overseas worker applies for the SID visa, providing evidence of skills, qualifications, health checks, and character clearances.' },
];

const pathwayToPR = [
  'Work for your sponsoring employer for at least 2 years on a SID visa',
  'Be under 45 years of age at the time of application (some exemptions apply)',
  'Meet the skills requirement for the nominated occupation',
  'Meet English language requirements',
  'Apply through the Temporary Residence Transition stream of the Employer Nomination Scheme (subclass 186)',
];

const employerFees = [
  { item: 'Standard Business Sponsorship (SBS)', fee: '$420 AUD' },
  { item: 'Nomination fee', fee: '$330 AUD' },
  { item: 'Skilling Australia Fund (SAF) levy', fee: '$1,200 - $1,800 AUD/year' },
];

const employeeFees = [
  { item: 'Visa application (main applicant)', fee: '$3,210 AUD' },
  { item: 'Additional applicant (18 years and over)', fee: '$3,210 AUD' },
  { item: 'Additional applicant (under 18 years)', fee: '$805 AUD' },
];

const SkillsInDemand482 = () => (
  <Layout>
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/imgs/hero-skilled-worker.jpg" alt="Skilled worker at Australian industrial site" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 hero-gradient" />
      </div>
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Briefcase className="w-4 h-4 text-visa-gold" />
            <span className="t-text-primary text-sm font-medium">Skills in Demand Visa</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">Skills in Demand Visa <span className="text-gradient-gold">Subclass 482 (SID)</span></h1>
          <p className="t-text-muted text-lg leading-relaxed mb-8">The Skills in Demand (SID) visa allows Australian employers to sponsor skilled overseas workers to fill genuine skills shortages. This visa can lead to permanent residency through the Employer Nomination Scheme.</p>
          <p className="t-text-ghost text-sm">Professional fee from $ 3,300 AUD | Government charges apply separately</p>
        </div>
      </div>
    </section>

    <section className="py-10 t-bg-body border-b t-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-5 text-center"><Clock className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Processing Time</p><p className="t-text-primary font-semibold">8-12 months</p></div>
          <div className="glass-card p-5 text-center"><Briefcase className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Our Fee (from)</p><p className="t-text-primary font-semibold">$ 3,300 AUD</p></div>
          <div className="glass-card p-5 text-center"><FileText className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Duration</p><p className="t-text-primary font-semibold">Up to 4 years</p></div>
          <div className="glass-card p-5 text-center"><Building2 className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Pathway to PR</p><p className="t-text-primary font-semibold">Yes, after 2 years</p></div>
        </div>
      </div>
    </section>

    <section className="section-padding t-bg-body relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4">What is the Skills in Demand (SID) Visa?</h2>
              <p className="t-text-muted leading-relaxed mb-4">The Skills in Demand (SID) visa, subclass 482, is Australia's primary employer-sponsored temporary work visa. It allows Australian employers to sponsor overseas workers to fill genuine skills shortages when they cannot find suitable Australian candidates.</p>
              <p className="t-text-muted leading-relaxed mb-4">The SID visa has three streams: the Core Skills Stream for occupations on the Core Skills Occupation List (CSOL), the Specialist Skills Stream for high-income, highly specialised roles with no occupation list restrictions, and the Labour Agreement Stream for employers with negotiated agreements.</p>
              <div className="glass-card p-5 border-visa-gold/20 mt-4">
                <p className="t-text-secondary text-sm"><span className="text-visa-gold font-semibold">Pathway to Permanent Residency:</span> After working for your sponsoring employer for 2 years, you may be eligible to apply for permanent residency through the Employer Nomination Scheme (subclass 186).</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4">Check if Your Occupation is Eligible</h2>
              <a
                href="https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-4 flex items-center gap-3 hover:border-visa-gold/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-visa-gold/20 flex items-center justify-center shrink-0">
                  <ExternalLink className="w-5 h-5 text-visa-gold" />
                </div>
                <div>
                  <p className="t-text-primary font-medium text-sm group-hover:text-visa-gold transition-colors">Department of Home Affairs - Skilled Occupation List</p>
                  <p className="t-text-ghost text-xs">Check if your occupation is on the CSOL (opens in new tab)</p>
                </div>
              </a>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-visa-gold" />SID Visa Streams</h2>
              <div className="space-y-4">
                {sidStreams.map((stream, index) => (
                  <div key={index} className="glass-card p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h3 className="text-lg font-semibold t-text-primary">{stream.name}</h3>
                      <span className="text-visa-gold text-sm">{stream.work}</span>
                    </div>
                    <p className="t-text-faint text-sm mb-2">{stream.desc}</p>
                    <div className="flex flex-wrap gap-4 text-xs t-text-ghost">
                      <span><span className="text-visa-teal">Eligible occupations:</span> {stream.eligible}</span>
                      <span><span className="text-visa-teal">Experience required:</span> {stream.experience}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-4">
                <Link to="/employers#specialist-skills" className="text-visa-teal text-sm hover:text-visa-gold transition-colors flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />Full Specialist Skills details on Employer Hub
                </Link>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-visa-gold" />Eligibility Criteria for Candidates</h2>
              <div className="space-y-6">
                {eligibilityCriteria.map((criteria, index) => (
                  <div key={index} className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <criteria.icon className="w-5 h-5 text-visa-gold" />
                      <h3 className="t-text-primary font-semibold">{criteria.category}</h3>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {criteria.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 t-text-muted text-sm">
                          <span className="text-visa-gold mt-1">&#8226;</span>{item}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={criteria.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-visa-teal text-xs hover:text-visa-gold transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />{criteria.linkText}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-visa-gold" />The Sponsorship Process</h2>
              <div className="space-y-4">
                {sponsorshipSteps.map((stage, index) => (
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
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-visa-gold" />General Requirements</h2>
              <div className="glass-card p-6">
                <ul className="space-y-3">
                  {generalRequirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-gold shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{req}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-visa-gold" />Pathway to Permanent Residency</h2>
              <div className="glass-card p-6 border-visa-gold/20">
                <p className="t-text-muted text-sm mb-4">After holding a SID visa for 2 years, you may be eligible to apply for the Employer Nomination Scheme (subclass 186) through the Temporary Residence Transition stream:</p>
                <ul className="space-y-3">
                  {pathwayToPR.map((item, index) => (
                    <li key={index} className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{item}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-visa-gold" />How We Can Help</h2>
              <div className="glass-card p-6">
                <ul className="grid sm:grid-cols-2 gap-3">
                  {[
                    'Employer sponsorship application (SBS) preparation',
                    'Nomination application for the position',
                    'Employee visa application lodgement',
                    'Skilling Australia Fund (SAF) levy guidance',
                    'Market salary rate assessment',
                    'Labour Market Testing (LMT) advice',
                    'Compliance and ongoing sponsorship obligations',
                    'Pathway to permanent residency strategy',
                  ].map((service, index) => (
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
                <a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skills-in-demand-482" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors">
                  <ExternalLink className="w-4 h-4" />SID Visa (subclass 482) - Official Page
                </a>
                <a href="https://immi.homeaffairs.gov.au/visas/employing-and-sponsoring-someone/sponsoring-workers/learn-about-standard-business-sponsorship" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors">
                  <ExternalLink className="w-4 h-4" />Standard Business Sponsorship Information
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 border-visa-gold/30">
              <h3 className="text-lg font-bold t-text-primary mb-3">Ready to Apply?</h3>
              <p className="t-text-faint text-sm mb-4">For both employers and employees.</p>
              <Link to="/contact" className="btn-primary w-full text-center block mb-2">Book Consultation</Link>
              <p className="t-text-ghost text-xs text-center">$ 330 AUD/hour (pro rata)</p>
            </div>

            {/* Government Fees - Combined */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Government Fees</h3>

              <p className="text-visa-teal text-xs font-semibold uppercase tracking-wider mb-2">Employer-paid</p>
              <div className="space-y-1 text-sm mb-5">
                {employerFees.map((fee, i) => (
                  <div key={i} className="flex items-baseline justify-between gap-2 py-1 border-b t-border last:border-0">
                    <span className="t-text-faint truncate">{fee.item}</span>
                    <span className="t-text-primary font-medium whitespace-nowrap shrink-0">{fee.fee}</span>
                  </div>
                ))}
              </div>

              <p className="text-visa-gold text-xs font-semibold uppercase tracking-wider mb-2">Employee-paid</p>
              <div className="space-y-1 text-sm">
                {employeeFees.map((fee, i) => (
                  <div key={i} className="flex items-baseline justify-between gap-2 py-1 border-b t-border last:border-0">
                    <span className="t-text-faint truncate">{fee.item}</span>
                    <span className="t-text-primary font-medium whitespace-nowrap shrink-0">{fee.fee}</span>
                  </div>
                ))}
              </div>

              <p className="t-text-ghost text-xs mt-4">Subject to change by Department of Home Affairs</p>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Related Services</h3>
              <ul className="space-y-3">
                <li><Link to="/visas/employer-nomination-186" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Employer Nomination 186 (PR pathway)</Link></li>
                <li><Link to="/visas/skilled-regional-494" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Skilled Employer Regional 494</Link></li>
                <li><Link to="/employers" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Employer Hub & DAMA</Link></li>
                <li><Link to="/services/skills-assessments" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Skills Assessment</Link></li>
              </ul>
            </div>
            <div className="glass-card p-6 border-red-500/20">
              <div className="flex items-center gap-3 mb-3"><HelpCircle className="w-5 h-5 text-red-400" /><h3 className="font-semibold t-text-primary">Employer Questions?</h3></div>
              <p className="t-text-faint text-sm mb-3">Contact us about employer sponsorship.</p>
              <a href="mailto:info@visa2.au" className="text-visa-gold text-sm hover:text-visa-goldLight">info@visa2.au</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default SkillsInDemand482;
