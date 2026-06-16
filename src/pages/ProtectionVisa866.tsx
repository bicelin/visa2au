import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, Clock, FileText, ExternalLink, Users, Heart, AlertTriangle, Lock, Home, Scale , Briefcase} from 'lucide-react';

const whoCanApply = [
  'You are in Australia (lawfully or unlawfully)',
  'You engage Australia\'s protection obligations',
  'You meet health, security, and character requirements',
  'You have not held certain temporary visas (some exclusions apply)',
  'You are not barred from applying for a protection visa',
];

const protectionObligations = [
  {
    type: 'Refugee Criteria',
    desc: 'You have a well-founded fear of persecution in your home country due to your race, religion, nationality, membership of a particular social group, or political opinion. The fear must be real, personal, and connected to one of these grounds.',
  },
  {
    type: 'Complementary Protection',
    desc: 'There is a real risk that if you return to your home country, you will suffer significant harm. Significant harm includes: arbitrary deprivation of life, the death penalty, torture, cruel or inhuman treatment or punishment, or degrading treatment or punishment.',
  },
  {
    type: 'Risk to Life, Health, or Liberty',
    desc: 'You face a well-founded risk to your life, physical or mental health, or risk of forced detention upon return to your home country. This includes situations where you cannot safely return home without risking your life, while you are currently in Australia on a temporary visa (such as a tourist or student visa).',
  },
  {
    type: 'Membership of a Threatened Social Group',
    desc: 'You are a member of a social group that faces systemic persecution or threat in your home country. This includes persecution based on race, ethnicity, gender, or sexual orientation (including LGBTQ+ individuals). Your membership of this group must be the central reason for the harm you fear.',
  },
];

const evidenceRequirements = [
  'All claims must be well-founded and supported by verifiable evidence',
  'Country conditions reports and human rights documentation',
  'Medical reports documenting physical or psychological trauma',
  'Police reports, court records, or official documentation of threats',
  'Witness statements and statutory declarations from credible sources',
  'Media reports and independent country assessments',
  'Evidence of membership in the threatened group (where applicable)',
  'Documentation of previous incidents of harm or threats',
];

const rights = [
  'Live and work in Australia permanently',
  'Access Medicare (Australia\'s public healthcare system)',
  'Sponsor eligible family members for permanent residency',
  'Travel to and from Australia for 5 years (after which you need a Resident Return visa)',
  'Access social security benefits after qualifying periods',
  'Apply for Australian citizenship when eligible',
  'Enrol children in Australian public schools',
  'Access higher education as a domestic student',
];

const processSteps = [
  { step: 'Initial Application', desc: 'Complete and lodge the protection visa application (Form 866) with the Department of Home Affairs. You must be in Australia when you apply.', timeline: 'Day 0' },
  { step: 'Acknowledgement', desc: 'The Department acknowledges receipt of your application and assigns a case officer.', timeline: 'Within 4-8 weeks' },
  { step: 'Interview', desc: 'You attend a detailed interview with a Departmental officer where you explain your protection claims. This is the most critical stage of the process.', timeline: '6-24 months after application' },
  { step: 'Decision', desc: 'The Department assesses your claims, the interview record, and all supporting evidence, then makes a decision.', timeline: 'Varies significantly (6 months - 5+ years)' },
  { step: 'Review or Appeal (if refused)', desc: 'If refused, you may be able to seek review by the Administrative Review Tribunal (ART) or the Immigration Assessment Authority (IAA) in certain cases.', timeline: 'Additional 12-24 months' },
];

const exclusionBars = [
  'You have been granted a Safe Haven Enterprise Visa (SHEV) or Temporary Protection Visa (TPV) previously',
  'You are subject to certain character or security concerns',
  'You have previously had a protection visa application refused or withdrawn (unless circumstances have changed)',
  'You are subject to a section 48 bar (visa refusal or cancellation while in Australia)',
];

const ourServices = [
  'Confidential initial consultation to assess protection claims',
  'Comprehensive protection visa application preparation',
  'Interview preparation and guidance',
  'Statutory declaration and witness statement preparation',
  'Supporting evidence compilation (country information, medical reports, character references)',
  'Written submissions to the Department',
  'ART representation for refused applications',
  'Family member sponsorship after visa grant',
  'Referral to trauma-informed support services',
];

const ProtectionVisa866 = () => (
  <Layout>
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/imgs/hero-rainforest.jpg" alt="Australian rainforest representing sanctuary and protection" className="w-full h-full object-cover" style={{ objectPosition: "center 30%" }} width="1920" height="1080" loading="eager" />
        <div className="absolute inset-0 hero-gradient" />
      </div>
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Shield className="w-4 h-4 text-visa-gold" />
            <span className="t-text-primary text-sm font-medium">Protection Visa</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">Protection Visa <span className="text-gradient-gold">Subclass 866</span></h1>
          <p className="t-text-muted text-lg leading-relaxed mb-8">Australia offers protection to refugees and people in need of complementary protection who are already in Australia. The Protection Visa (subclass 866) grants permanent residency to those who meet the criteria. We handle these cases with the utmost confidentiality, sensitivity, and professionalism.</p>
          <p className="t-text-ghost text-sm">Professional fee from $ 6,600 AUD | Government charges apply separately</p>
        </div>
      </div>
    </section>

    <section className="py-10 t-bg-body border-b t-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-5 text-center"><Clock className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Processing Time</p><p className="t-text-primary font-semibold">6 months - 5+ years</p></div>
          <div className="glass-card p-5 text-center"><Shield className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Visa Type</p><p className="t-text-primary font-semibold">Permanent</p></div>
          <div className="glass-card p-5 text-center"><Briefcase className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Our Fee (from)</p><p className="t-text-primary font-semibold">$ 6,600 AUD</p></div>
          <div className="glass-card p-5 text-center"><Heart className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Interview Required</p><p className="t-text-primary font-semibold">Yes</p></div>
        </div>
      </div>
    </section>

    <section className="section-padding t-bg-body relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4">What is the Protection Visa (Subclass 866)?</h2>
              <p className="t-text-muted leading-relaxed mb-4">The Protection Visa (subclass 866) is a permanent visa for people who are in Australia and engage Australia's protection obligations. If you fear persecution in your home country or face significant harm if returned, you may be eligible for this visa.</p>
              <p className="t-text-muted leading-relaxed mb-4">This is one of the most complex and sensitive areas of Australian immigration law. The application process involves a detailed interview where you must explain your protection claims, supported by evidence. The Department of Home Affairs conducts a thorough assessment of your claims against country conditions and may verify your information through various sources.</p>
              <div className="glass-card p-5 border-visa-gold/20 mt-4">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-visa-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="t-text-primary font-semibold text-sm">Confidentiality Guaranteed</p>
                    <p className="t-text-muted text-sm">Protection visa applications are treated with strict confidentiality. Information you provide to the Department is not shared with your home country government without your consent, except in very limited circumstances related to security checks.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4">Who Can Apply?</h2>
              <div className="glass-card p-6">
                <ul className="space-y-3">
                  {whoCanApply.map((req, index) => (
                    <li key={index} className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-gold shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{req}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-visa-gold" />Australia's Protection Obligations</h2>
              <p className="t-text-muted text-sm mb-4">Australia owes you protection if you meet either of the following criteria:</p>
              <div className="space-y-4">
                {protectionObligations.map((obl, i) => (
                  <div key={i} className="glass-card p-5">
                    <h3 className="t-text-primary font-semibold mb-2">{obl.type}</h3>
                    <p className="t-text-muted text-sm">{obl.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Scale className="w-5 h-5 text-visa-gold" />Evidence Requirements</h2>
              <p className="t-text-muted text-sm mb-4">Protection visa claims must be credible, consistent, and supported by verifiable evidence. Vague or unsupported claims are unlikely to succeed. The Department of Home Affairs conducts rigorous verification of all claims against country conditions and available evidence.</p>
              <div className="glass-card p-6 border-visa-gold/20">
                <ul className="space-y-3">
                  {evidenceRequirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-gold shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{req}</span></li>
                  ))}
                </ul>
              </div>
              <div className="glass-card p-5 border-red-500/20 mt-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="t-text-secondary text-sm"><span className="t-text-primary font-semibold">Important:</span> All facts and claims must be well-formed and supported by verifiable evidence. Inconsistent information, fabricated claims, or failure to provide credible supporting documentation will likely result in visa refusal and may affect future visa applications.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-visa-gold" />The Application Process</h2>
              <div className="space-y-4">
                {processSteps.map((stage, index) => (
                  <div key={index} className="glass-card p-5 flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-visa-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-visa-gold font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <h3 className="t-text-primary font-semibold">{stage.step}</h3>
                        <span className="text-visa-gold text-xs">{stage.timeline}</span>
                      </div>
                      <p className="t-text-faint text-sm">{stage.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-400" />Exclusion Bars</h2>
              <p className="t-text-muted text-sm mb-4">Some people are barred from applying for a protection visa. You cannot apply if:</p>
              <div className="glass-card p-6 border-red-500/20">
                <ul className="space-y-3">
                  {exclusionBars.map((bar, i) => (
                    <li key={i} className="flex items-start gap-3"><AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{bar}</span></li>
                  ))}
                </ul>
                <p className="t-text-ghost text-xs mt-4">Some bars can be waived in compelling circumstances. Contact us for advice specific to your situation.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Home className="w-5 h-5 text-visa-gold" />Rights as a Protection Visa Holder</h2>
              <div className="glass-card p-6">
                <ul className="grid sm:grid-cols-2 gap-3">
                  {rights.map((right, i) => (
                    <li key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{right}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-visa-gold" />How We Can Help</h2>
              <div className="glass-card p-6">
                <p className="t-text-muted text-sm mb-4">We handle protection visa cases with sensitivity, confidentiality, and professional expertise. Our services include:</p>
                <ul className="space-y-2">
                  {ourServices.map((service, i) => (
                    <li key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{service}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><ExternalLink className="w-5 h-5 text-visa-gold" />Support Services</h2>
              <div className="glass-card p-6">
                <p className="t-text-muted text-sm mb-4">Protection visa applicants often benefit from additional support services:</p>
                <div className="space-y-3">
                  <a href="https://www.homeaffairs.gov.au/about/corporate/information/fact-sheets/62protection" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors">
                    <ExternalLink className="w-4 h-4" />Department of Home Affairs - Protection Visa Fact Sheet
                  </a>
                  <a href="https://www.art.gov.au" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors">
                    <ExternalLink className="w-4 h-4" />Administrative Review Tribunal (ART)
                  </a>
                  <a href="https://www.ima.com.au" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors">
                    <ExternalLink className="w-4 h-4" />Immigration Assessment Authority (IAA)
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 border-visa-gold/30">
              <h3 className="text-lg font-bold t-text-primary mb-3">Confidential Consultation</h3>
              <p className="t-text-faint text-sm mb-4">We handle protection visa matters with complete confidentiality and sensitivity.</p>
              <Link to="/contact" className="btn-primary w-full text-center block mb-2">Book Consultation</Link>
              <p className="t-text-ghost text-xs text-center">$ 330 AUD/hour (pro rata)</p>
            </div>
            <div className="glass-card p-6 border-visa-gold/20">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-visa-gold shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold t-text-primary text-sm mb-2">Your Privacy Matters</h3>
                  <p className="t-text-faint text-xs">All consultations and case information are kept strictly confidential. We understand the sensitive nature of protection claims and handle all matters with the utmost care.</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Government Fees</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="t-text-faint">There is no visa application charge</span><span className="t-text-primary font-medium">$ 0 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">Health examinations</span><span className="t-text-primary font-medium">$ 300-500 AUD</span></div>
              </div>
              <p className="t-text-ghost text-xs mt-3">Subject to change by Department of Home Affairs</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Related Services</h3>
              <ul className="space-y-3">
                <li><Link to="/services/visa-refusals" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Visa Refusals & ART Appeals</Link></li>
                <li><Link to="/services/bridging-visas" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Bridging Visas</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default ProtectionVisa866;
