import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { Award, CheckCircle, Clock, HelpCircle, BookOpen, Globe, MapPin, Users, XCircle , Briefcase} from 'lucide-react';

const eligibilityRequirements = [
  'Be a permanent resident at the time of application and decision',
  'Have lived in Australia on a valid visa for at least 4 years immediately before applying',
  'Have held permanent residency for at least 12 months before applying',
  'Have been physically present in Australia for at least 12 months of the past 2 years',
  'Not have been absent from Australia for more than 12 months in total during the past 4 years',
  'Not have been absent for more than 90 days in the 12 months before applying',
  'Be of good character (police checks required)',
  'Have adequate knowledge of English (if aged 18-59)',
  'Pass the citizenship test (if aged 18-59)',
  'Intend to reside in or maintain a close and continuing connection with Australia',
];

const testTopics = [
  'Australia and its people - demographics, states and territories',
  'Australia\'s democratic beliefs, rights, and liberties',
  'Government and the law in Australia - federal system, parliament, courts',
  'Australian values - freedom, respect, fairness, equality of opportunity',
  'Australian symbols and traditions',
];

const pathways = [
  { name: 'Citizenship by Conferral', description: 'For permanent residents who meet the general residence requirement. This is the most common pathway.', who: 'Most permanent residents' },
  { name: 'Citizenship by Descent', description: 'If you were born outside Australia to an Australian citizen parent at the time of your birth.', who: 'Children of Australian citizens born overseas' },
  { name: 'Citizenship by Adoption', description: 'If you were adopted by an Australian citizen under full Hague Convention intercountry adoption arrangements.', who: 'Adopted children of Australian citizens' },
  { name: 'Resumption of Citizenship', description: 'If you previously gave up or lost your Australian citizenship and wish to resume it.', who: 'Former Australian citizens' },
];

const rights = [
  'Vote in federal, state, and local government elections',
  'Apply for an Australian passport',
  'Stand for election to parliament',
  'Work in the Australian Public Service or Defence Force',
  'Register children born overseas as Australian citizens by descent',
  'Full protection from deportation',
  'Access to consular assistance overseas',
];

const ourServices = [
  'Eligibility assessment and residence calculation',
  'Document preparation and review',
  'Citizenship application lodgement',
  'Citizenship test preparation guidance',
  'Character requirement advice',
  'Complex case strategy (residence gaps, travel history)',
  'Ceremony attendance guidance',
  'Follow-up with Department of Home Affairs',
];

const Citizenship = () => (
  <Layout>
    <section className="relative pt-32 pb-20 t-bg-body overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <img src="/imgs/aboriginal-koala.png" alt="" className="absolute bottom-0 right-10 w-28 h-28 opacity-10 pointer-events-none" aria-hidden="true" loading="lazy" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Award className="w-4 h-4 text-visa-gold" aria-hidden="true" />
            <span className="t-text-primary text-sm font-medium">Citizenship</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">Australian <span className="text-gradient-gold">Citizenship</span></h1>
          <p className="t-text-muted text-lg leading-relaxed mb-8">Take the final step in your migration journey. Australian citizenship grants you full membership in the Australian community with all associated rights and responsibilities.</p>
          <p className="t-text-ghost text-sm mt-4">Professional fee from $3,300 AUD | Government charges apply separately</p>
        </div>
      </div>
    </section>

    <section className="py-10 t-bg-body border-b t-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-5 text-center"><Clock className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Processing Time</p><p className="t-text-primary font-semibold">6-12 months</p></div>
          <div className="glass-card p-5 text-center"><Briefcase className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Our Fee (from)</p><p className="t-text-primary font-semibold">$3,300 AUD</p></div>
          <div className="glass-card p-5 text-center"><BookOpen className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Citizenship Test</p><p className="t-text-primary font-semibold">Required (18-59)</p></div>
          <div className="glass-card p-5 text-center"><Globe className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Residence</p><p className="t-text-primary font-semibold">4 years min</p></div>
        </div>
      </div>
    </section>

    <section className="section-padding t-bg-body relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4">What is Australian Citizenship?</h2>
              <p className="t-text-muted leading-relaxed mb-4">Australian citizenship represents the final milestone in your migration journey. It is a formal recognition that you are a full member of the Australian community, with the same rights and responsibilities as any other Australian citizen.</p>
              <p className="t-text-muted leading-relaxed">Unlike permanent residency, citizenship cannot be revoked except in very limited circumstances. It gives you the security of knowing Australia is your home forever.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-visa-gold" />Pathways to Citizenship</h2>
              <div className="space-y-4">
                {pathways.map((p, i) => (
                  <div key={i} className="glass-card p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h3 className="text-lg font-semibold t-text-primary">{p.name}</h3>
                      <span className="text-visa-teal text-xs">{p.who}</span>
                    </div>
                    <p className="t-text-muted text-sm">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-visa-gold" />General Eligibility Requirements</h2>
              <div className="glass-card p-6">
                <p className="t-text-muted text-sm mb-4">For citizenship by conferral (the most common pathway), you must meet the following:</p>
                <ul className="space-y-3">
                  {eligibilityRequirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-gold shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{req}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-visa-gold" />The Citizenship Test</h2>
              <div className="glass-card p-6">
                <p className="t-text-muted text-sm mb-4">If you are aged 18 to 59, you must pass a citizenship test. The test is computer-based, consists of 20 multiple-choice questions, and you need to score at least 75% to pass. All questions are based on the Australian citizenship test resource.</p>
                <h3 className="t-text-primary font-semibold mb-3">Topics Covered:</h3>
                <ul className="space-y-2">
                  {testTopics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-2"><span className="text-visa-gold mt-1">&#8226;</span><span className="t-text-muted text-sm">{topic}</span></li>
                  ))}
                </ul>
                <p className="t-text-ghost text-sm mt-4">The test also assesses your understanding of the privileges and responsibilities of Australian citizenship. Our team can provide guidance on test preparation.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-visa-gold" />Rights as an Australian Citizen</h2>
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
                <ul className="grid sm:grid-cols-2 gap-3">
                  {ourServices.map((s, i) => (
                    <li key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{s}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-400" />Common Complexities</h2>
              <div className="glass-card p-6 border-red-500/20">
                <ul className="space-y-3 t-text-muted text-sm">
                  <li className="flex items-start gap-2"><span className="text-red-400">&#8226;</span>Extended periods of travel that interrupt the residence requirement</li>
                  <li className="flex items-start gap-2"><span className="text-red-400">&#8226;</span>Previous criminal convictions or character concerns</li>
                  <li className="flex items-start gap-2"><span className="text-red-400">&#8226;</span>Complex travel history with multiple countries</li>
                  <li className="flex items-start gap-2"><span className="text-red-400">&#8226;</span>Children included in the application with different circumstances</li>
                  <li className="flex items-start gap-2"><span className="text-red-400">&#8226;</span>Previous visa cancellations or compliance issues</li>
                </ul>
                <p className="t-text-ghost text-sm mt-4">Complex cases require careful strategy. Contact us for personalised advice.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 border-visa-gold/30">
              <h3 className="text-lg font-bold t-text-primary mb-3">Ready to Apply?</h3>
              <p className="t-text-faint text-sm mb-4">Our agents will guide you through the citizenship process.</p>
              <Link to="/contact" className="btn-primary w-full text-center block mb-2">Book Consultation</Link>
              <p className="t-text-ghost text-xs text-center">$330 AUD/hour (pro rata)</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-bold t-text-primary mb-3">Government Fees</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="t-text-faint">General eligibility</span><span className="t-text-primary font-medium">$560 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">Concession (pensioner)</span><span className="t-text-primary font-medium">$75 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">Children under 16</span><span className="t-text-primary font-medium">Nil</span></div>
              </div>
              <p className="t-text-ghost text-xs mt-3">Subject to change by Department of Home Affairs</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-bold t-text-primary mb-3">Processing Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-visa-gold/20 text-visa-gold text-xs flex items-center justify-center shrink-0">1</span><span className="t-text-muted text-sm">Application lodged</span></div>
                <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-visa-gold/20 text-visa-gold text-xs flex items-center justify-center shrink-0">2</span><span className="t-text-muted text-sm">Application processed (6-12 months)</span></div>
                <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-visa-gold/20 text-visa-gold text-xs flex items-center justify-center shrink-0">3</span><span className="t-text-muted text-sm">Citizenship test (if applicable)</span></div>
                <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-visa-gold/20 text-visa-gold text-xs flex items-center justify-center shrink-0">4</span><span className="t-text-muted text-sm">Approval notification</span></div>
                <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-visa-gold/20 text-visa-gold text-xs flex items-center justify-center shrink-0">5</span><span className="t-text-muted text-sm">Citizenship ceremony</span></div>
              </div>
            </div>
            <div className="glass-card p-6 border-red-500/20">
              <div className="flex items-center gap-3 mb-3"><HelpCircle className="w-5 h-5 text-red-400" /><h3 className="font-semibold t-text-primary">Questions?</h3></div>
              <p className="t-text-faint text-sm mb-3">Contact us for a personalised citizenship assessment.</p>
              <a href="mailto:info@visa2.au" className="text-visa-gold text-sm hover:text-visa-goldLight">info@visa2.au</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Citizenship;
