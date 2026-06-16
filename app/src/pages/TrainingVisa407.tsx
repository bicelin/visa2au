import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { GraduationCap, CheckCircle, Clock, FileText, ExternalLink, AlertTriangle, Users, BookOpen, Briefcase, Building2 } from 'lucide-react';

const trainingTypes = [
  {
    type: 'Occupational Training to Improve Skills',
    desc: 'For individuals with recent and relevant experience in their occupation who need structured training to enhance their skills. The training must be tailored to the individual\'s specific skill gaps.',
    suitable: 'Professionals seeking to upgrade skills in their current field',
  },
  {
    type: 'Capacity Building Overseas',
    desc: 'For overseas employers or government agencies to send employees to Australia for training that will be applied in their home country. Includes training for international organisations.',
    suitable: 'Government agencies, international organisations, overseas employers',
  },
  {
    type: 'Professional Development',
    desc: 'For overseas professionals or managers to undertake a tailored professional development training program in Australia. The training must be face-to-face and not available in the applicant\'s home country.',
    suitable: 'Managers and professionals seeking structured professional development',
  },
];

const eligibilityRequirements = [
  {
    category: 'Nomination by an Approved Organisation',
    icon: Building2,
    items: [
      'The nominating organisation must be approved by the Department of Home Affairs as a Temporary Activities Sponsor',
      'The organisation must provide a structured training program with a clear training plan',
      'The training must be face-to-face (at least 30 hours per week, with no more than 30% online)',
    ],
  },
  {
    category: 'Genuine Training Need',
    icon: BookOpen,
    items: [
      'The training must be directly relevant to the applicant\'s occupation or field',
      'The applicant must demonstrate they will genuinely participate in the training program',
      'The training must not be designed to secure ongoing employment in Australia',
    ],
  },
  {
    category: 'Skills and Experience',
    icon: Briefcase,
    items: [
      'For occupational training stream: at least 12 months of recent and relevant full-time experience in the occupation',
      'For professional development stream: at least 2 years of professional or managerial experience',
      'Qualifications relevant to the nominated occupation or field of training',
    ],
  },
  {
    category: 'English Language',
    icon: FileText,
    items: [
      'Functional English is required (IELTS 4.5 overall, PTE 30 overall, or equivalent)',
      'Some exemptions apply depending on the training program and the applicant\'s background',
    ],
  },
];

const trainingPlanElements = [
  'Clear learning objectives aligned with the applicant\'s occupation and skill gaps',
  'Detailed weekly training schedule (minimum 30 hours per week)',
  'Competency-based assessment framework to measure progress',
    'Supervision and mentoring arrangements with qualified trainers',
  'Recognition of prior learning where applicable',
  'Clear articulation of how the training will benefit the applicant\'s home country or employer',
];

const ourServices = [
  'Comprehensive eligibility assessment for both the applicant and the nominating organisation',
  'Professional training plan preparation tailored to Department of Home Affairs requirements',
  'Nomination application (Sponsorship) preparation for the organisation',
  'Visa application preparation and lodgement for the trainee',
  'Guidance on compliance with visa conditions and training requirements',
  'Ongoing support throughout the training period',
  'Communication with the Department of Home Affairs on your behalf',
];

const warnings = [
  {
    title: 'Not a Work Visa',
    desc: 'The Training Visa (subclass 407) is not a substitute for a work visa. Its primary purpose is structured training. Any work performed must be incidental to the training program and not the main purpose of the stay.',
  },
  {
    title: 'No Direct Pathway to Permanent Residency',
    desc: 'The 407 visa does not provide a direct pathway to permanent residency. However, the skills and experience gained during training may enhance your eligibility for skilled migration or employer-sponsored visas in the future.',
  },
  {
    title: 'Organisation Must Be Approved',
    desc: 'The nominating organisation must first be approved as a Temporary Activities Sponsor before lodging a nomination. This process can take several weeks. We recommend starting the sponsorship application early.',
  },
];

const TrainingVisa407 = () => (
  <Layout>
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/imgs/hero-employer.jpg" alt="Professional training environment" className="w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} loading="eager" />
        <div className="absolute inset-0 hero-gradient" />
      </div>
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <GraduationCap className="w-4 h-4 text-visa-gold" />
            <span className="t-text-primary text-sm font-medium">Training Visa</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">Training Visa <span className="text-gradient-gold">Subclass 407</span></h1>
          <p className="t-text-muted text-lg leading-relaxed mb-8">The Training Visa allows you to participate in occupational training activities in Australia to improve your skills in your current occupation, area of tertiary study, or field of expertise. We specialise in preparing professional training plans and visa applications that meet all Department requirements.</p>
          <p className="t-text-ghost text-sm">Professional fee from $ 3,300 AUD | Government charges apply separately</p>
        </div>
      </div>
    </section>

    <section className="py-10 t-bg-body border-b t-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-5 text-center"><Clock className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Processing Time</p><p className="t-text-primary font-semibold">3-6 months</p></div>
          <div className="glass-card p-5 text-center"><GraduationCap className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Duration</p><p className="t-text-primary font-semibold">Up to 2 years</p></div>
          <div className="glass-card p-5 text-center"><FileText className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Work Rights</p><p className="t-text-primary font-semibold">Training-related only</p></div>
          <div className="glass-card p-5 text-center"><Briefcase className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Our Fee (from)</p><p className="t-text-primary font-semibold">$ 3,300 AUD</p></div>
        </div>
      </div>
    </section>

    <section className="section-padding t-bg-body relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-12">

            {/* Overview */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4">What is the Training Visa (Subclass 407)?</h2>
              <p className="t-text-muted leading-relaxed mb-4">The Training Visa (subclass 407) is designed for individuals who want to come to Australia to participate in occupational training activities. Unlike work visas, the primary purpose of the 407 visa is structured training that enhances the applicant\'s skills in their current occupation, area of tertiary study, or field of expertise.</p>
              <p className="t-text-muted leading-relaxed">The visa requires nomination by an approved Australian organisation that provides a structured training program. The training must be face-to-face and involve at least 30 hours per week of supervised activities.</p>
            </div>

            {/* Training Types */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-visa-gold" />Types of Training</h2>
              <div className="space-y-4">
                {trainingTypes.map((t, i) => (
                  <div key={i} className="glass-card p-5">
                    <h3 className="t-text-primary font-semibold mb-1">{t.type}</h3>
                    <p className="t-text-faint text-sm mb-1">{t.desc}</p>
                    <p className="t-text-ghost text-xs"><span className="text-visa-gold">Suitable for:</span> {t.suitable}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligibility */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-visa-gold" />Eligibility Requirements</h2>
              <div className="space-y-4">
                {eligibilityRequirements.map((cat, i) => (
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

            {/* Training Plan */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-visa-gold" />What Makes a Strong Training Plan?</h2>
              <p className="t-text-muted text-sm mb-4">A professional training plan is the cornerstone of a successful 407 visa application. The Department of Home Affairs scrutinises training plans carefully to ensure they are genuine, structured, and beneficial. Our training plans include:</p>
              <div className="glass-card p-6 border-visa-gold/20">
                <ul className="space-y-3">
                  {trainingPlanElements.map((e, i) => (
                    <li key={i} className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-gold shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{e}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* How We Help */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-visa-gold" />How We Can Help</h2>
              <p className="t-text-muted text-sm mb-4">We have extensive experience preparing Training Visa applications and professional training plans that meet the Department of Home Affairs\' requirements. Our services include:</p>
              <div className="glass-card p-6">
                <ul className="space-y-2">
                  {ourServices.map((s, i) => (
                    <li key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{s}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Warnings */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-400" />Important Information</h2>
              <div className="space-y-4">
                {warnings.map((w, i) => (
                  <div key={i} className="glass-card p-6 border-red-500/20">
                    <h3 className="t-text-primary font-semibold mb-2">{w.title}</h3>
                    <p className="t-text-muted text-sm">{w.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Resources */}
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><ExternalLink className="w-5 h-5 text-visa-gold" />Official Resources</h2>
              <div className="glass-card p-6 space-y-3">
                <a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/training-visa-407" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors"><ExternalLink className="w-4 h-4" />Training Visa 407 - Official Page</a>
                <a href="https://immi.homeaffairs.gov.au/visas/employing-and-sponsoring-someone/sponsoring-workers/nominating-for-a-visa" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors"><ExternalLink className="w-4 h-4" />Nomination and Sponsorship Information</a>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-panel p-6 border-visa-gold/30">
              <h3 className="text-lg font-bold t-text-primary mb-3">Need a Training Plan?</h3>
              <p className="t-text-faint text-sm mb-4">We professionally prepare training plans for eligible candidates.</p>
              <Link to="/contact" className="btn-primary w-full text-center block mb-2">Book Consultation</Link>
              <p className="t-text-ghost text-xs text-center">$ 330 AUD/hour (pro rata)</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Government Fees</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="t-text-faint">Sponsorship application</span><span className="t-text-primary font-medium">$420 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">Nomination fee</span><span className="t-text-primary font-medium">$170 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">Visa application (main)</span><span className="t-text-primary font-medium">$430 AUD</span></div>
              </div>
              <p className="t-text-ghost text-xs mt-3">Subject to change by Department of Home Affairs</p>
            </div>
            <div className="glass-card p-6 border-visa-gold/20">
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-visa-gold shrink-0 mt-0.5" />
                <div>
                  <h3 className="t-text-primary font-semibold text-sm mb-1">Training Plan Specialists</h3>
                  <p className="t-text-faint text-xs">Our team has extensive experience preparing professional training plans that meet Department of Home Affairs requirements.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default TrainingVisa407;
