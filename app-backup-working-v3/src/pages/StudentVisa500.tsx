import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { GraduationCap, CheckCircle, Clock, FileText, ExternalLink, AlertTriangle, DollarSign, Shield, BookOpen, Briefcase, Wallet } from 'lucide-react';

const benefits = [
  'Study at world-class Australian universities, colleges, and vocational institutions',
  'Work up to 48 hours per fortnight during term and unlimited hours during holidays',
  'Bring family members (partner and dependent children) to Australia',
  'Access to Australia\'s public healthcare system (with Overseas Student Health Cover)',
  'Opportunity to apply for a Temporary Graduate Visa (subclass 485) after completing studies',
  'Build a professional network and gain Australian work experience',
  'Experience Australia\'s high standard of living and multicultural society',
];

const eligibility = [
  {
    category: 'Financial Requirements',
    icon: Wallet,
    items: [
      'Evidence of sufficient funds to cover tuition fees, living costs, and travel for the first year of study (approximately $26,000 AUD for living expenses)',
      'Acceptable evidence includes: bank statements, scholarship letters, education loans, or financial guarantees from family',
      'Tuition fees must be paid for the first semester or year (varies by institution and course)',
    ],
  },
  {
    category: 'Genuine Temporary Entrant (GTE)',
    icon: Shield,
    items: [
      'Demonstrate genuine intention to stay in Australia temporarily for study purposes',
      'Provide a personal statement explaining why you chose Australia, your chosen course, and your future plans',
      'Explain how the course aligns with your career goals and home country circumstances',
    ],
  },
  {
    category: 'Health Insurance (OSHC)',
    icon: Shield,
    items: [
      'Purchase Overseas Student Health Cover (OSHC) for the entire duration of your visa',
      'OSHC must be with an approved Australian health insurance provider',
      'Cover must begin from your date of arrival in Australia',
    ],
  },
  {
    category: 'Course and Institution',
    icon: BookOpen,
    items: [
      'Enrol in a full-time course registered on the Commonwealth Register of Institutions and Courses for Overseas Students (CRICOS)',
      'Provide a Confirmation of Enrolment (CoE) or Letter of Offer from the education provider',
      'Course must be at the appropriate Australian Qualifications Framework (AQF) level',
    ],
  },
];

const workRights = [
  'Maximum 48 hours of work per fortnight (14-day period) during academic term',
  'Unlimited work hours during scheduled course breaks (holidays)',
  'Work rights begin once your course has officially commenced',
  'Master\'s by research or doctoral students: unlimited work hours at all times',
  'You cannot work until your course has started (if you arrive early)',
];

const pathwayTo485 = [
  { step: 'Complete Your Studies', desc: 'Successfully complete a CRICOS-registered course that meets the Australian study requirement (typically 2 years of study).' },
  { step: 'Meet Age Requirement', desc: 'Be under 35 years of age at the time of application for the Temporary Graduate Visa (subclass 485).' },
  { step: 'Apply for Subclass 485', desc: 'The Temporary Graduate Visa allows you to work, study, and live in Australia temporarily after completing your studies. Duration depends on your qualification level (2-4 years).' },
  { step: 'Explore Permanent Pathways', desc: 'During or after your 485 visa, you may become eligible for skilled migration visas (189, 190, 491) or employer-sponsored visas (482, 186).' },
];

const importantWarnings = [
  {
    title: 'Studying Does Not Guarantee Permanent Residency',
    desc: 'Completing studies in Australia does not automatically lead to permanent residency. However, it may significantly improve your chances of qualifying for skilled migration or employer-sponsored visas. We recommend consulting with a registered migration agent to plan your pathway.',
  },
  {
    title: 'Approach Education Providers Directly',
    desc: 'For prospective Student Visa (subclass 500) applicants, we recommend approaching qualified education agents or educational institutions directly for course selection, admission, and enrolment. Our services focus on the visa application process after you have secured your enrolment.',
  },
  {
    title: 'Course Selection Matters',
    desc: 'Not all courses provide a pathway to permanent residency. If your goal is to eventually migrate, it is essential to choose a course on the skilled occupation lists and to understand the points test requirements before enrolling.',
  },
];

const StudentVisa500 = () => (
  <Layout>
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/imgs/hero-sydney.jpg" alt="Sydney university campus" className="w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} loading="eager" />
        <div className="absolute inset-0 hero-gradient" />
      </div>
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <GraduationCap className="w-4 h-4 text-visa-gold" />
            <span className="t-text-primary text-sm font-medium">Study in Australia</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">Student Visa <span className="text-gradient-gold">Subclass 500</span></h1>
          <p className="t-text-muted text-lg leading-relaxed mb-8">Study at world-class Australian institutions and gain access to work rights, post-study opportunities, and potential pathways to permanent residency. We provide professional visa application services to help you focus on your studies.</p>
          <p className="t-text-ghost text-sm">Comprehensive visa guidance for your educational journey in Australia</p>
        </div>
      </div>
    </section>

    <section className="py-10 t-bg-body border-b t-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-5 text-center"><Clock className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Processing Time</p><p className="t-text-primary font-semibold">4-12 weeks</p></div>
          <div className="glass-card p-5 text-center"><GraduationCap className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Duration</p><p className="t-text-primary font-semibold">Up to 5 years</p></div>
          <div className="glass-card p-5 text-center"><DollarSign className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Govt Fee</p><p className="t-text-primary font-semibold">$2,000 AUD</p></div>
          <div className="glass-card p-5 text-center"><Briefcase className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Work Rights</p><p className="t-text-primary font-semibold">48 hrs/fortnight</p></div>
        </div>
      </div>
    </section>

    <section className="section-padding t-bg-body relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-12">

            {/* Benefits */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4">Why Study in Australia?</h2>
              <div className="glass-card p-6">
                <ul className="space-y-3">
                  {benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-gold shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{b}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Eligibility */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-visa-gold" />Eligibility Requirements</h2>
              <div className="space-y-4">
                {eligibility.map((cat, i) => (
                  <div key={i} className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <cat.icon className="w-5 h-5 text-visa-gold" />
                      <h3 className="t-text-primary font-semibold">{cat.category}</h3>
                    </div>
                    <ul className="space-y-2">
                      {cat.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 t-text-muted text-sm"><span className="text-visa-gold mt-1">&#8226;</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Funds Note */}
            <div className="glass-card p-6 border-visa-gold/20">
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-visa-gold shrink-0 mt-0.5" />
                <div>
                  <p className="t-text-primary font-semibold text-sm">Financial Requirements Summary</p>
                  <p className="t-text-muted text-sm">You must demonstrate sufficient funds to cover approximately <span className="text-visa-gold font-semibold">$26,000 AUD</span> for your first year of living expenses, plus tuition fees and travel costs. Acceptable evidence includes bank statements, education loans, scholarships, or family financial guarantees.</p>
                  <p className="t-text-faint text-xs mt-2"><span className="text-visa-teal font-semibold">Note:</span> If you plan to bring family members (partner or dependent children), financial requirements increase significantly. You will need to demonstrate additional funds for each family member and extend OSHC coverage to include them. Partner OSHC is approximately $4,500 AUD per year, and dependent children approximately $3,500 AUD per year, in addition to increased living expense evidence.</p>
                </div>
              </div>
            </div>

            {/* Work Rights */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-visa-gold" />Work Rights</h2>
              <div className="glass-card p-6">
                <ul className="space-y-2">
                  {workRights.map((w, i) => (
                    <li key={i} className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{w}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 485 Pathway */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-visa-gold" />Pathway to Temporary Graduate Visa (Subclass 485)</h2>
              <p className="t-text-muted text-sm mb-4">After completing your studies, you may be eligible for a Temporary Graduate Visa, which allows you to work in Australia and explore permanent residency pathways.</p>
              <div className="space-y-4">
                {pathwayTo485.map((stage, i) => (
                  <div key={i} className="glass-card p-5 flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-visa-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-visa-gold font-bold text-sm">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="t-text-primary font-semibold mb-1">{stage.step}</h3>
                      <p className="t-text-faint text-sm">{stage.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="glass-card p-5 border-visa-gold/20 mt-4">
                <p className="t-text-secondary text-sm"><span className="text-visa-gold font-semibold">Key Requirements for 485:</span> You must be under 35 years of age at the time of application and have completed a CRICOS-registered course that meets the Australian study requirement (typically 2 years of study at the appropriate level).</p>
              </div>
            </div>

            {/* Important Warnings */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-400" />Important Information</h2>
              <div className="space-y-4">
                {importantWarnings.map((warning, i) => (
                  <div key={i} className="glass-card p-6 border-red-500/20">
                    <h3 className="t-text-primary font-semibold mb-2">{warning.title}</h3>
                    <p className="t-text-muted text-sm">{warning.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Resources */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><ExternalLink className="w-5 h-5 text-visa-gold" />Official Resources</h2>
              <div className="glass-card p-6 space-y-3">
                <a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-visa-500" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors"><ExternalLink className="w-4 h-4" />Student Visa 500 - Official Page</a>
                <a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-visa-485" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors"><ExternalLink className="w-4 h-4" />Temporary Graduate Visa 485 - Official Page</a>
                <a href="https://www.studyinaustralia.gov.au" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors"><ExternalLink className="w-4 h-4" />Study in Australia - Official Guide</a>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-panel p-6 border-visa-gold/30">
              <h3 className="text-lg font-bold t-text-primary mb-3">Need Help with Your Visa?</h3>
              <p className="t-text-faint text-sm mb-4">Contact us after you have secured your course enrolment.</p>
              <Link to="/contact" className="btn-primary w-full text-center block mb-2">Book Consultation</Link>
              <p className="t-text-ghost text-xs text-center">$ 330 AUD/hour (pro rata)</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Our Services</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary">Visa application preparation and lodgement</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary">GTE statement guidance</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary">Document compilation and review</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary">Communication with DoHA</span></li>
              </ul>
            </div>
            <div className="glass-card p-6 border-visa-gold/20">
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-visa-gold shrink-0 mt-0.5" />
                <div>
                  <h3 className="t-text-primary font-semibold text-sm mb-1">Course Enrolment</h3>
                  <p className="t-text-faint text-xs">For course selection and admission, approach education providers or qualified education agents directly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default StudentVisa500;
