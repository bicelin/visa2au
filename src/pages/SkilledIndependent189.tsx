import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { Award, CheckCircle, Clock, FileText, ExternalLink, GraduationCap, Star, AlertTriangle, TrendingUp, MapPin, Briefcase } from 'lucide-react';

const pointsCategories = [
  { category: 'Age', max: '30 points', examples: ['18-24: 25 pts', '25-32: 30 pts', '33-39: 25 pts', '40-44: 15 pts'] },
  { category: 'English Language', max: '20 points', examples: ['Competent: 0 pts', 'Proficient: 10 pts', 'Superior: 20 pts'] },
  { category: 'Skilled Employment (overseas)', max: '15 points', examples: ['3-4 years: 5 pts', '5-7 years: 10 pts', '8+ years: 15 pts'] },
  { category: 'Skilled Employment (Australia)', max: '20 points', examples: ['1-2 years: 5 pts', '3-4 years: 10 pts', '5-7 years: 15 pts', '8+ years: 20 pts'] },
  { category: 'Educational Qualifications', max: '20 points', examples: ['Diploma/Trade: 10 pts', 'Bachelor: 15 pts', 'PhD: 20 pts'] },
  { category: 'Australian Study', max: '5 points', examples: ['Min. 2 years study in Australia'] },
  { category: 'Partner Skills', max: '10 points', examples: ['Partner with positive skills assessment and competent English'] },
  { category: 'Other', max: '15 points', examples: ['Professional Year: 5 pts', 'NAATI: 5 pts', 'Regional study: 5 pts'] },
];

const eligibility189 = [
  'Have an occupation on the Medium and Long-term Strategic Skills List (MLTSSL)',
  'Obtain a positive skills assessment from the relevant assessing authority',
  'Be under 45 years of age when invited to apply',
  'Score at least 65 points on the points test',
  'Have Competent English (IELTS 6.0 in each band)',
  'Meet health and character requirements',
  'Submit an Expression of Interest (EOI) through SkillSelect and be invited to apply',
];

const eligibility190 = [
  'Have an occupation on the relevant state/territory skilled occupation list',
  'Obtain a positive skills assessment from the relevant assessing authority',
  'Be under 45 years of age when invited to apply',
  'Score at least 65 points on the points test (including 5 points from state nomination)',
  'Have Competent English (IELTS 6.0 in each band)',
  'Be nominated by an Australian state or territory government',
  'Commit to living and working in the nominating state for at least 2 years',
];

const eoiProcess = [
  { step: 'Skills Assessment', desc: 'Get a positive skills assessment for your nominated occupation from the relevant assessing authority.' },
  { step: 'English Test', desc: 'Take an approved English language test and achieve the required score.' },
  { step: 'Submit EOI', desc: 'Create an EOI in SkillSelect, claiming points for age, English, experience, qualifications, and other factors.' },
  { step: 'Wait for Invitation', desc: 'Wait for the Department of Home Affairs to issue an invitation. Invitations are issued periodically based on occupation quotas and points ranking.' },
  { step: 'Apply for Visa', desc: 'If invited, lodge your visa application within 60 days of the invitation.' },
];

const importantWarnings = [
  {
    title: 'Limited Places, High Competition',
    desc: 'Australia issues a limited number of invitations for each occupation each program year. Popular occupations may require 85-100+ points to receive an invitation. There is no guarantee that your EOI will result in an invitation, even with a competitive points score.',
    icon: AlertTriangle,
  },
  {
    title: 'No Guarantee After EOI Submission',
    desc: 'Submitting an EOI does not guarantee an invitation. Your EOI remains in the SkillSelect pool for up to 2 years, but if you are not invited within that period, your EOI expires and you must submit a new one. Invitation rounds are conducted at the discretion of the Department.',
    icon: TrendingUp,
  },
  {
    title: 'Points Thresholds Vary',
    desc: 'The minimum 65 points is only the threshold to submit an EOI. In practice, most occupations require significantly higher scores to receive an invitation. The required score varies by occupation, changes each invitation round, and is not published in advance.',
    icon: Star,
  },
];

const stateNomination = [
  { state: 'New South Wales', notes: 'Competitive - requires high points for most occupations. Occupation lists change throughout the year.' },
  { state: 'Victoria', notes: 'Uses a ROI (Registration of Interest) system in addition to EOI. STEMM occupations and health sector prioritised.' },
  { state: 'Queensland', notes: 'Requires minimum points thresholds and proof of employment. Prioritises in-demand occupations.' },
  { state: 'Western Australia', notes: 'Offers graduate streams and general streams. Lower points requirements for graduates.' },
  { state: 'South Australia', notes: 'Prioritises health, defence, and technology sectors. Graduate pathways available.' },
  { state: 'Tasmania', notes: 'Uses a Gateway system. Skilled employment in Tasmania strongly preferred.' },
  { state: 'ACT', notes: 'Canberra Matrix system - points-based with additional Canberra-specific criteria.' },
  { state: 'Northern Territory', notes: 'Prioritises applicants with NT connections. Lower points for onshore NT residents.' },
];

const SkilledIndependent189 = () => (
  <Layout>
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/imgs/hero-sydney.jpg" alt="Sydney skyline representing skilled migration opportunities" className="w-full h-full object-cover" style={{ objectPosition: "center 30%" }} width="1920" height="1080" loading="eager" />
        <div className="absolute inset-0 hero-gradient" />
      </div>
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Award className="w-4 h-4 text-visa-gold" />
            <span className="t-text-primary text-sm font-medium">Points-Tested Skilled Migration</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">Skilled Independent <span className="text-gradient-gold">189</span> & State Nominated <span className="text-gradient-gold">190</span></h1>
          <p className="t-text-muted text-lg leading-relaxed mb-8">Australia's most sought-after permanent residency visas for skilled workers. No employer sponsorship required - but competition is fierce and places are extremely limited. Understand the points system, the EOI process, and the reality of your chances before you begin.</p>
          <p className="t-text-ghost text-sm">Professional fee from $ 5,500 AUD | Government charges apply separately</p>
        </div>
      </div>
    </section>

    <section className="py-10 t-bg-body border-b t-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-5 text-center"><Clock className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Processing Time</p><p className="t-text-primary font-semibold">6-18 months</p></div>
          <div className="glass-card p-5 text-center"><Award className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Visa Type</p><p className="t-text-primary font-semibold">Permanent</p></div>
          <div className="glass-card p-5 text-center"><Star className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Min. Points</p><p className="t-text-primary font-semibold">65 (EOI threshold)</p></div>
          <div className="glass-card p-5 text-center"><FileText className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Age Limit</p><p className="t-text-primary font-semibold">Under 45</p></div>
        </div>
      </div>
    </section>

    <section className="section-padding t-bg-body relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4">Understanding Skilled Migration Visas</h2>
              <p className="t-text-muted leading-relaxed mb-4">The Skilled Independent (subclass 189) and Skilled Nominated (subclass 190) are Australia's primary permanent residency pathways for skilled workers who do not have employer sponsorship. Both are points-tested visas that require you to submit an Expression of Interest (EOI) and receive an invitation before you can apply.</p>
              <p className="t-text-muted leading-relaxed mb-4">The 189 is an independent visa - you do not need sponsorship from an employer, family member, or state government. The 190 requires nomination from an Australian state or territory government, which gives you an additional 5 points but commits you to living in that state for at least 2 years.</p>
              <div className="glass-card p-5 border-red-500/20 mt-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="t-text-primary font-semibold text-sm">Critical Reality Check</p>
                    <p className="t-text-muted text-sm">These visas are extremely competitive. While the minimum points threshold is 65, the actual invitation points for most occupations in 2024-2025 were between 85-100 points. There are no guarantees of receiving an invitation, and the process can take years.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-6 flex items-center gap-2"><Star className="w-5 h-5 text-visa-gold" />The Points Test System</h2>
              <p className="t-text-muted text-sm mb-4">Points are awarded across multiple categories. You need at least 65 points to submit an EOI, but as noted above, competitive scores are typically much higher.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {pointsCategories.map((cat, i) => (
                  <div key={i} className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="t-text-primary font-semibold text-sm">{cat.category}</h3>
                      <span className="text-visa-gold text-xs font-medium">{cat.max}</span>
                    </div>
                    <ul className="space-y-1">
                      {cat.examples.map((ex, j) => (
                        <li key={j} className="t-text-faint text-xs">{ex}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="t-text-ghost text-xs mt-4">Source: <a href="https://immi.homeaffairs.gov.au/visas/working-in-australia/skills-assessment/occupations" target="_blank" rel="noopener noreferrer" className="text-visa-teal hover:text-visa-gold">Department of Home Affairs Points Test</a></p>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-visa-gold" />The EOI Process</h2>
              <p className="t-text-muted text-sm mb-4">Submitting an Expression of Interest (EOI) through SkillSelect is the first step. Your EOI is ranked by points, and the highest-scoring candidates in each occupation are invited to apply during invitation rounds.</p>
              <div className="space-y-4">
                {eoiProcess.map((stage, index) => (
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
              <h2 className="text-2xl font-bold t-text-primary mb-6">Important Warnings</h2>
              <div className="space-y-4">
                {importantWarnings.map((warning, i) => (
                  <div key={i} className="glass-card p-6 border-red-500/20">
                    <div className="flex items-start gap-3">
                      <warning.icon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="t-text-primary font-semibold mb-2">{warning.title}</h3>
                        <p className="t-text-muted text-sm">{warning.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-visa-gold" />Eligibility - Subclass 189</h2>
              <div className="glass-card p-6">
                <ul className="space-y-3">
                  {eligibility189.map((req, index) => (
                    <li key={index} className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-gold shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{req}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-visa-teal" />Eligibility - Subclass 190 (State Nominated)</h2>
              <div className="glass-card p-6">
                <ul className="space-y-3">
                  {eligibility190.map((req, index) => (
                    <li key={index} className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{req}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-visa-gold" />State Nomination Overview</h2>
              <p className="t-text-muted text-sm mb-4">Each Australian state and territory has its own nomination requirements, occupation lists, and application processes. Here is a summary:</p>
              <div className="space-y-3">
                {stateNomination.map((state, i) => (
                  <div key={i} className="glass-card p-4">
                    <h3 className="t-text-primary font-medium text-sm mb-1">{state.state}</h3>
                    <p className="t-text-faint text-xs">{state.notes}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-visa-gold" />How We Can Help</h2>
              <div className="glass-card p-6">
                <p className="t-text-muted text-sm mb-4">We provide honest, realistic advice about your chances of receiving an invitation. Our services include:</p>
                <ul className="space-y-2">
                  {[
                    'Realistic points assessment and strategy to maximise your score',
                    'Occupation selection advice to improve invitation chances',
                    'Skills assessment preparation and coordination',
                    'State nomination strategy and application assistance',
                    'EOI submission and monitoring',
                    'Alternative pathway advice if points are insufficient',
                    'Complete visa application preparation after invitation',
                  ].map((service, i) => (
                    <li key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{service}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><ExternalLink className="w-5 h-5 text-visa-gold" />Official Resources</h2>
              <div className="glass-card p-6 space-y-3">
                <a href="https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors">
                  <ExternalLink className="w-4 h-4" />Skilled Occupation Lists
                </a>
                <a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors">
                  <ExternalLink className="w-4 h-4" />Subclass 189 - Official Page
                </a>
                <a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-nominated-190" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors">
                  <ExternalLink className="w-4 h-4" />Subclass 190 - Official Page
                </a>
                <a href="https://skillselect.homeaffairs.gov.au/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors">
                  <ExternalLink className="w-4 h-4" />SkillSelect EOI Portal
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 border-visa-gold/30">
              <h3 className="text-lg font-bold t-text-primary mb-3">Realistic Assessment</h3>
              <p className="t-text-faint text-sm mb-4">Before investing in the EOI process, get an honest evaluation of your chances.</p>
              <Link to="/contact" className="btn-primary w-full text-center block mb-2">Book Consultation</Link>
              <p className="t-text-ghost text-xs text-center">$ 330 AUD/hour (pro rata)</p>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <Briefcase className="w-5 h-5 text-visa-gold" />
                <h3 className="text-lg font-bold t-text-primary">Our Fee</h3>
              </div>
              <p className="text-visa-gold font-bold text-xl">$ 5,500 <span className="text-sm font-normal t-text-ghost">AUD</span></p>
              <p className="t-text-ghost text-xs mt-1">indicative only</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Government Fees</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="t-text-faint">189 visa application</span><span className="t-text-primary font-medium">$ 4,910 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">190 visa application</span><span className="t-text-primary font-medium">$ 4,910 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">Skills assessment</span><span className="t-text-primary font-medium">$ 500-1,200 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">English test</span><span className="t-text-primary font-medium">$ 300-400 AUD</span></div>
              </div>
              <p className="t-text-ghost text-xs mt-3">Subject to change by Department of Home Affairs</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Related Visas</h3>
              <ul className="space-y-3">
                <li><Link to="/visas/skills-in-demand-482" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Skills in Demand 482 (SID)</Link></li>
                <li><Link to="/visas/skilled-regional-494" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Skilled Employer Regional 494</Link></li>
                <li><Link to="/services/skills-assessments" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Skills Assessment</Link></li>
              </ul>
            </div>
            <div className="glass-card p-6 border-visa-gold/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-visa-gold shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold t-text-primary text-sm mb-2">Explore Alternatives</h3>
                  <p className="t-text-faint text-xs">If your points score is not competitive, consider the 482 SID visa, 494 regional visa, or employer sponsorship as alternative pathways to permanent residency.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default SkilledIndependent189;
