import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { Heart, CheckCircle, Clock, DollarSign, FileText, HelpCircle, ShieldAlert, AlertTriangle, Users, Camera, CreditCard, HomeIcon, MessageCircle, Scale, Ban, Calendar, Lock, Mail } from 'lucide-react';

const fourPillars = [
  {
    title: 'Financial Commitment',
    desc: 'How you share financial resources and responsibilities',
    icon: CreditCard,
    examples: [
      'Joint bank accounts and credit cards (6–12 months of statements)',
      'Joint loans, mortgages, or car registrations',
      'Evidence of financial transfers, gifts, or remittances between partners',
      'Joint insurance policies (health, home, car, or life)',
      'Shared household expenses (rent, bills, groceries)',
    ],
  },
  {
    title: 'Nature of the Household',
    desc: 'How you live together and manage daily life',
    icon: HomeIcon,
    examples: [
      'Joint tenancy agreement or mortgage in both names',
      'Utility bills (electricity, gas, water, internet) for 6+ months at the same address',
      'Shared responsibilities: pet registration, childcare documents, household maintenance',
      'Correspondence addressed to both partners at the same residence',
      'Evidence of shared daily routines and domestic arrangements',
    ],
  },
  {
    title: 'Social Recognition',
    desc: 'How your relationship is perceived by others',
    icon: Users,
    examples: [
      '30–40 photos across the relationship (dated and captioned): social events, daily life, milestones',
      'Social media posts and tagged photos together (include URLs and timestamps)',
      'Event tickets, travel itineraries, hotel bookings, wedding invitations',
      'Form 888 supporting statements (minimum 2 from Australian citizens or permanent residents)',
      'Statutory declarations from family and friends who can attest to your relationship',
    ],
  },
  {
    title: 'Commitment to Each Other',
    desc: 'The depth and intention of your partnership',
    icon: Heart,
    examples: [
      'Personal statements from both partners (1–2 pages each): how you met, relationship development, key dates, future plans',
      'Communication records: calls, texts, emails, letters, cards exchanged',
      'Legal commitments: wills, power of attorney, superannuation beneficiary nominations',
      'Marriage or de facto relationship certificate (12+ months cohabitation evidence for de facto)',
      'Joint memberships and subscriptions (gym, streaming services, loyalty programs)',
    ],
  },
];

const evidenceSummary = [
  { label: 'Form 888', desc: 'Minimum 2 forms from Australian citizens/PRs, with witness ID and contact details' },
  { label: 'Personal Statements', desc: 'Separate 1–2 page statements from both partners describing the relationship history' },
  { label: 'Photos', desc: '30–40 dated and captioned photos across social events, daily life, and milestones' },
  { label: 'Joint Finances', desc: 'Bank statements, loans, insurance, bills showing shared financial life' },
  { label: 'Cohabitation Proof', desc: 'Lease, utility bills, mail at the same address for 12+ months (de facto)' },
  { label: 'Communication', desc: 'Screenshots of calls, texts, emails spanning the relationship timeline' },
];

const schedule3Points = [
  'Schedule 3 of the Migration Regulations applies to most onshore partner visa applicants who do not hold a substantive visa at the time of application',
  'You must demonstrate compelling reasons for the grant of the visa, taking into account your individual circumstances',
  'Common exemptions apply if: you have a dependent child with the sponsor; the relationship existed before your last substantive visa expired; or you hold a BVA/BVB with work rights',
  'If Schedule 3 applies and you cannot meet the criteria, your application may be refused unless a waiver is granted',
  'We assess your circumstances before lodgement to determine if Schedule 3 applies and prepare the strongest possible submissions',
];

const pic4020Points = [
  { label: 'Bogus Documents', desc: 'Providing false documents or information can result in a 3-year ban from applying for any Australian visa' },
  { label: 'Serious Fraud', desc: 'In cases of serious fraud, the ban can extend to 10 years and affect future applications' },
  { label: 'Both Parties Affected', desc: 'PIC 4020 applies to both the applicant and the sponsor — either party providing misleading information can jeopardise the entire application' },
  { label: 'Character Test', desc: 'All applicants and sponsors must meet character requirements. Criminal convictions, association with criminal groups, or past immigration breaches can lead to refusal' },
  { label: 'Sponsor Obligations', desc: 'The sponsor must provide an undertaking to support the applicant financially and must not have outstanding debts to the Australian Government' },
];

const fiveYearRestrictions = [
  'A person can sponsor a maximum of two (2) partner visa applicants in their lifetime',
  'If you have previously sponsored a partner, or were sponsored yourself as a partner, there must be a minimum 5-year gap between the date of the first visa application and the date of the second visa application',
  'The 5-year restriction is calculated from the date the first visa application was lodged, not the date of grant or relationship breakdown',
  'Waivers of the 5-year restriction are possible only in exceptional circumstances, such as the death of the previous partner or the presence of dependent children',
  'We verify your sponsorship history before lodgement to ensure you meet these legislative requirements',
];

const relationshipBreakdown = [
  'If your relationship ends after lodging the application but before a decision is made, you must inform the Department of Home Affairs immediately',
  'Failure to notify the Department of a relationship breakdown can constitute a breach of visa conditions and affect future applications',
  'If the relationship ends due to domestic violence, special provisions may allow the visa to proceed — see the Domestic Violence section below',
  'If the relationship ends for other reasons, the visa application is typically withdrawn or refused, and any bridging visa ceases',
  'We provide confidential advice if your circumstances change during the application process',
];

const domesticViolence = [
  'If your relationship has broken down due to domestic or family violence, you may still be eligible for the permanent Partner Visa (801) even if you are no longer together',
  'You must provide evidence of the violence, such as court orders, police reports, medical records, or statutory declarations from support services',
  'The domestic violence provisions exist to protect applicants from remaining in abusive relationships solely for visa purposes',
  'This is a sensitive and complex area of law. We handle such cases with the utmost confidentiality and care',
  'If you are in immediate danger, contact 000 (emergency services) or 1800 RESPECT (1800 737 732) for 24-hour support',
];

const PartnerVisa820 = () => (
  <Layout>
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/imgs/hero-aboriginal.jpg" alt="Aboriginal dot-art patterns in gold and teal on dark background" className="w-full h-full object-cover" style={{ objectPosition: "center 30%" }} width="1920" height="1080" loading="eager" />
        <div className="absolute inset-0 hero-gradient" />
      </div>
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Heart className="w-4 h-4 text-visa-gold" aria-hidden="true" />
            <span className="t-text-primary text-sm font-medium">Partner Visa</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">Partner Visa <span className="text-gradient-gold">820/801</span></h1>
          <p className="t-text-muted text-lg leading-relaxed mb-8">Unite with your partner in Australia. The Partner Visa allows the spouse or de facto partner of an Australian citizen, permanent resident, or eligible New Zealand citizen to live in Australia permanently.</p>
        </div>
      </div>
    </section>

    <section className="py-10 t-bg-body border-b t-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-5 text-center"><Clock className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Processing</p><p className="t-text-primary font-semibold">12–24 months</p></div>
          <div className="glass-card p-5 text-center"><DollarSign className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Our Fee</p><p className="t-text-primary font-semibold">$5,500 AUD</p></div>
          <div className="glass-card p-5 text-center"><FileText className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Pathway</p><p className="t-text-primary font-semibold">Temp to Permanent</p></div>
          <div className="glass-card p-5 text-center"><Users className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">De Facto</p><p className="t-text-primary font-semibold">12+ months</p></div>
        </div>
      </div>
    </section>

    <section className="section-padding t-bg-body relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-14">

            {/* Overview */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4">Visa Overview</h2>
              <p className="t-text-muted leading-relaxed mb-4">The Partner Visa (subclass 820/801) is a two-stage process for the spouse or de facto partner of an Australian citizen, permanent resident, or eligible New Zealand citizen. The first stage (subclass 820) is a temporary visa granted while the permanent stage (subclass 801) is assessed.</p>
              <p className="t-text-muted leading-relaxed">The Department of Home Affairs assesses whether your relationship is genuine, ongoing, and mutually exclusive. You must provide substantial evidence across four key areas — the "four pillars" of a relationship.</p>
            </div>

            {/* Two-Stage Process */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4">Two-Stage Process</h2>
              <div className="space-y-4">
                <div className="glass-card p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                    <h3 className="text-lg font-semibold t-text-primary">Stage 1: Temporary Visa (Subclass 820)</h3>
                    <span className="text-visa-gold text-sm">Granted first</span>
                  </div>
                  <p className="t-text-faint">Allows you to live, work, and study in Australia while your permanent visa is processed. Includes full work rights and access to Medicare. Usually granted within 12–24 months.</p>
                </div>
                <div className="glass-card p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                    <h3 className="text-lg font-semibold t-text-primary">Stage 2: Permanent Visa (Subclass 801)</h3>
                    <span className="text-visa-gold text-sm">~2 years after 820</span>
                  </div>
                  <p className="t-text-faint">Granted approximately 2 years after the subclass 820, provided the relationship is still genuine and ongoing. The Department may request updated evidence before granting the permanent visa.</p>
                </div>
              </div>
            </div>

            {/* Four Pillars */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Heart className="w-5 h-5 text-visa-gold" />The Four Pillars of a Genuine Relationship</h2>
              <p className="t-text-muted text-sm mb-6">The Department of Home Affairs assesses your relationship across four dimensions. Your evidence must demonstrate that your partnership is genuine, ongoing, and mutually committed.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {fourPillars.map((pillar, i) => (
                  <div key={i} className="glass-card p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-visa-gold/15 flex items-center justify-center">
                        <pillar.icon className="w-5 h-5 text-visa-gold" />
                      </div>
                      <div>
                        <h3 className="t-text-primary font-semibold text-sm">{pillar.title}</h3>
                        <p className="t-text-ghost text-xs">{pillar.desc}</p>
                      </div>
                    </div>
                    <ul className="space-y-1.5">
                      {pillar.examples.map((ex, j) => (
                        <li key={j} className="flex items-start gap-2 t-text-faint text-xs"><span className="text-visa-gold mt-0.5">&#8226;</span>{ex}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence Summary */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Camera className="w-5 h-5 text-visa-gold" />Evidence Checklist Summary</h2>
              <div className="glass-card p-6">
                <div className="grid sm:grid-cols-2 gap-3">
                  {evidenceSummary.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" />
                      <div>
                        <span className="t-text-secondary text-sm font-medium">{item.label}</span>
                        <p className="t-text-ghost text-xs">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-visa-gold/5 border border-visa-gold/10">
                  <p className="t-text-muted text-xs"><span className="text-visa-gold font-semibold">Quality over quantity:</span> Focus on clear, verifiable evidence that demonstrates the depth and duration of your relationship. Label files clearly (e.g., "Joint_Bank_Statement_Jan2025.pdf"). All non-English documents require NAATI-certified translations.</p>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4">Key Requirements</h2>
              <div className="glass-card p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-gold shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">Be in a genuine and ongoing relationship with an Australian citizen, permanent resident, or eligible NZ citizen</span></li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-gold shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">For de facto relationships: demonstrate 12+ months of cohabitation (unless registered)</span></li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-gold shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">Meet health and character requirements (including PIC 4020 — no bogus documents)</span></li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-gold shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">Provide substantial evidence across the four pillars of your relationship</span></li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-gold shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">Be in Australia when applying (subclass 820 onshore)</span></li>
                </ul>
              </div>
            </div>

            {/* Schedule 3 */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-visa-gold" />Schedule 3 Limitations (Onshore Applicants)</h2>
              <div className="glass-card p-6 border-visa-gold/20">
                <p className="t-text-muted text-sm mb-4">Schedule 3 of the Migration Regulations applies to most onshore Partner Visa applicants who do not hold a substantive visa at the time of application. This commonly includes people who have overstayed a visa, had a visa cancelled, or are on a bridging visa with no further stay conditions.</p>
                <ul className="space-y-2">
                  {schedule3Points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3"><AlertTriangle className="w-4 h-4 text-visa-gold shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{point}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* PIC 4020 */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-red-400" />Character & Fraud Warning (PIC 4020)</h2>
              <div className="glass-card p-6 border-red-500/20">
                <p className="t-text-muted text-sm mb-4">Public Interest Criterion 4020 is one of the most serious provisions in Australian immigration law. It applies to both the applicant and the sponsor. Providing false information or bogus documents can have severe consequences.</p>
                <div className="space-y-3">
                  {pic4020Points.map((point, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Ban className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="t-text-primary text-sm font-medium">{point.label}</span>
                        <p className="t-text-faint text-xs">{point.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5-Year Restriction */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-visa-gold" />5-Year Sponsorship Restrictions</h2>
              <div className="glass-card p-6 border-visa-gold/20">
                <p className="t-text-muted text-sm mb-4">Australian law places strict limits on how many times a person can sponsor a partner, and how frequently.</p>
                <ul className="space-y-2">
                  {fiveYearRestrictions.map((point, i) => (
                    <li key={i} className="flex items-start gap-3"><AlertTriangle className="w-4 h-4 text-visa-gold shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{point}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Relationship Breakdown */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><MessageCircle className="w-5 h-5 text-visa-gold" />If Your Relationship Ends</h2>
              <div className="glass-card p-6">
                <ul className="space-y-2">
                  {relationshipBreakdown.map((point, i) => (
                    <li key={i} className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{point}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Domestic Violence */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Scale className="w-5 h-5 text-visa-teal" />Domestic Violence Provisions</h2>
              <div className="glass-card p-6 border-visa-teal/20">
                <p className="t-text-muted text-sm mb-4">Australian immigration law recognises that genuine relationships can break down due to domestic or family violence. Special provisions exist to protect victims.</p>
                <ul className="space-y-2">
                  {domesticViolence.map((point, i) => (
                    <li key={i} className="flex items-start gap-3"><Heart className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{point}</span></li>
                  ))}
                </ul>
                <div className="mt-4 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                  <p className="t-text-muted text-xs"><span className="text-red-400 font-semibold">If you are in immediate danger:</span> Call <a href="tel:000" className="text-visa-gold">000</a> for emergency services, or <a href="tel:1800737732" className="text-visa-gold">1800 RESPECT (1800 737 732)</a> for 24-hour support.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-panel p-6 border-visa-gold/30">
              <h3 className="text-lg font-bold t-text-primary mb-3">Ready to Apply?</h3>
              <p className="t-text-faint text-sm mb-6">Get expert assistance with your Partner Visa application.</p>
              <Link to="/contact" className="btn-primary w-full text-center block mb-3">Book Consultation</Link>
              <p className="t-text-ghost text-xs text-center">$330 AUD/hour (pro rata)</p>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Government Fee</h3>
              <div className="flex justify-between items-baseline mb-2">
                <span className="t-text-faint text-sm">Main applicant</span>
                <span className="text-visa-gold font-bold text-lg">$9,365 AUD</span>
              </div>
              <p className="t-text-ghost text-xs">Subject to change by Department of Home Affairs. Additional applicant fees apply.</p>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Related Visas</h3>
              <ul className="space-y-3">
                <li><Link to="/visas/partner-visa-309" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Partner Visa 309/100 (Offshore)</Link></li>
                <li><Link to="/visas/prospective-marriage-300" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Prospective Marriage 300</Link></li>
                <li><Link to="/visas/parent-visa-103" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Parent Visa 103</Link></li>
              </ul>
            </div>

            <div className="glass-card p-6 border-red-500/20">
              <div className="flex items-center gap-3 mb-3"><HelpCircle className="w-5 h-5 text-red-400" /><h3 className="font-semibold t-text-primary">Need Help?</h3></div>
              <p className="t-text-faint text-sm mb-3">Questions about your relationship evidence or Schedule 3?</p>
              <a href="mailto:info@visa2.au" className="text-visa-gold text-sm hover:text-visa-goldLight flex items-center gap-1"><Mail className="w-3 h-3" />info@visa2.au</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default PartnerVisa820;
