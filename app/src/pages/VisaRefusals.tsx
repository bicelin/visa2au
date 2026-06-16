import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { ShieldAlert, Clock, DollarSign, FileText, CheckCircle, ExternalLink, Users, Scale, AlertTriangle , Briefcase} from 'lucide-react';

const artProcess = [
  { step: 'Receive Refusal Notification', desc: 'Carefully review the refusal letter to understand the reasons for the decision and the review rights.', timeline: 'Day 0' },
  { step: 'Seek Professional Advice', desc: 'Contact a registered migration agent immediately to assess your appeal prospects and develop a strategy.', timeline: 'Within 1-7 days' },
  { step: 'Lodge ART Application', desc: 'Submit your application for review to the Administrative Review Tribunal within the strict time limit.', timeline: 'Within 21 days (some visas have 7 days)' },
  { step: 'Prepare Supporting Evidence', desc: 'Gather additional evidence, statements, and documents to address the refusal reasons.', timeline: '2-6 weeks' },
  { step: 'ART Hearing', desc: 'Attend a hearing before an ART member where you or your representative present your case.', timeline: '6-18 months after lodgement' },
  { step: 'ART Decision', desc: 'The ART either affirms the decision, sets it aside and remits for reconsideration, or returns the decision.', timeline: '1-3 months after hearing' },
];

const groundsForReview = [
  'The decision-maker applied the law incorrectly',
  'The decision was made without procedural fairness',
  'New evidence has become available that was not previously considered',
  'The decision-maker made a factual error in assessing your circumstances',
  'The decision was unreasonable or disproportionate in the circumstances',
];

const timeLimits = [
  { visaType: 'Most visa refusals', limit: '21 days from date of decision' },
  { visaType: 'Partner visa (onshore)', limit: '21 days from date of decision' },
  { visaType: 'Student visa', limit: '21 days from date of decision' },
  { visaType: 'Protection visa (866)', limit: '7 working days from date of decision' },
  { visaType: 'Character-related cancellation', limit: 'Varies - seek immediate advice' },
];

const agentValue = [
  {
    title: 'Strategic Case Assessment',
    desc: 'We analyse the refusal reasons against migration law and case precedents to identify the strongest grounds for appeal. Not all refusals are worth appealing - we give honest advice about your chances.',
  },
  {
    title: 'Evidence Compilation',
    desc: 'We identify gaps in the original application and compile new, compelling evidence specifically targeted at addressing the refusal reasons. This includes statutory declarations, expert opinions, and supporting documents.',
  },
  {
    title: 'Legal Submissions',
    desc: 'We prepare detailed written submissions that reference relevant legislation, regulations, and case law to argue why the decision should be set aside. This is a critical component that self-represented applicants often overlook.',
  },
  {
    title: 'Hearing Representation',
    desc: 'We represent you at the ART hearing, presenting your case, examining witnesses, and responding to questions from the Tribunal member. Professional representation significantly improves outcomes.',
  },
  {
    title: 'Bridging Visa Strategy',
    desc: 'A refused visa often means you need a bridging visa to remain lawful in Australia while the appeal is processed. We manage this critical aspect to ensure you maintain lawful status throughout the process.',
  },
  {
    title: 'Alternative Pathways',
    desc: 'If the appeal prospects are poor, we advise on alternative visa options that may be available to you. Sometimes a new application is a better strategy than an appeal.',
  },
];

const costs = [
  { item: 'ART Application Fee (standard)', fee: '$ 3,496 AUD' },
  { item: 'ART Application Fee (concession)', fee: '$ 1,748 AUD' },
  { item: 'ART Hearing Fee (if applicable)', fee: '$ 1,055 AUD' },
  { item: 'Migration Agent Professional Fee (from)', fee: '$ 3,300 AUD' },
  { item: 'Additional evidence costs', fee: 'Varies' },
];

const VisaRefusals = () => (
  <Layout>
    <section className="relative pt-32 pb-20 t-bg-body overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <ShieldAlert className="w-4 h-4 text-visa-gold" />
            <span className="t-text-primary text-sm font-medium">Visa Refusals & ART Appeals</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">
            Visa Refusals & <span className="text-gradient-gold">ART Appeals</span>
          </h1>
          <p className="t-text-muted text-lg leading-relaxed mb-8">
            Has your visa application been refused? The Administrative Review Tribunal (ART) replaced the Administrative Appeals Tribunal (AAT) in October 2024. Our experienced migration agents can assess your case, represent you at ART hearings, and maximise your chances of a successful appeal.
          </p>
          <p className="t-text-ghost text-sm">Professional fee from $ 3,300 AUD | ART fees apply separately</p>
        </div>
      </div>
    </section>

    <section className="py-10 t-bg-body border-b t-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-5 text-center"><Clock className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Time Limit</p><p className="t-text-primary font-semibold">7-21 days</p></div>
          <div className="glass-card p-5 text-center"><DollarSign className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">ART Fee</p><p className="t-text-primary font-semibold">$ 3,496 AUD</p></div>
          <div className="glass-card p-5 text-center"><Briefcase className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Our Fee (from)</p><p className="t-text-primary font-semibold">$ 3,300 AUD</p></div>
          <div className="glass-card p-5 text-center"><Scale className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">ART Timeline</p><p className="t-text-primary font-semibold">6-18 months</p></div>
        </div>
      </div>
    </section>

    <section className="section-padding t-bg-body relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4">What is the Administrative Review Tribunal (ART)?</h2>
              <p className="t-text-muted leading-relaxed mb-4">The Administrative Review Tribunal (ART) commenced on 14 October 2024, replacing the former Administrative Appeals Tribunal (AAT). The ART conducts independent merits reviews of administrative decisions made by Australian Government ministers, departments, and agencies - including visa refusal and cancellation decisions by the Department of Home Affairs.</p>
              <p className="t-text-muted leading-relaxed">When the ART reviews a decision, it considers the case afresh ("de novo" review). This means the ART looks at all the evidence and circumstances, including any new evidence, and makes its own decision. The ART can affirm the original decision, vary it, set it aside and substitute a new decision, or remit the matter for reconsideration.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-visa-gold" />Strict Time Limits</h2>
              <p className="t-text-muted text-sm mb-4">Time limits for lodging an ART application are strict and cannot be extended. Missing the deadline means you lose your right to appeal.</p>
              <div className="space-y-2">
                {timeLimits.map((t, i) => (
                  <div key={i} className="glass-card p-4 flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="t-text-primary font-medium text-sm">{t.visaType}</span>
                    <span className="text-red-400 text-sm font-medium">{t.limit}</span>
                  </div>
                ))}
              </div>
              <div className="glass-card p-5 border-red-500/20 mt-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="t-text-secondary text-sm"><span className="t-text-primary font-semibold">Urgent:</span> If your visa has been refused, contact us immediately. Time is critical and delays can cost you your right to appeal.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-visa-gold" />The ART Review Process</h2>
              <div className="space-y-4">
                {artProcess.map((stage, index) => (
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
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-visa-gold" />Common Grounds for Review</h2>
              <div className="glass-card p-6">
                <ul className="space-y-3">
                  {groundsForReview.map((ground, index) => (
                    <li key={index} className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-gold shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{ground}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5 text-visa-gold" />Application Costs</h2>
              <div className="glass-card p-6">
                <div className="space-y-2">
                  {costs.map((c, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="t-text-muted">{c.item}</span>
                      <span className="t-text-primary font-medium">{c.fee}</span>
                    </div>
                  ))}
                </div>
                <p className="t-text-ghost text-xs mt-4">The ART fee is subject to change. A 50% fee reduction may be available for holders of certain concession cards. Fees are generally not refunded if the review is unsuccessful.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-6 flex items-center gap-2"><Users className="w-5 h-5 text-visa-gold" />The Value of a Registered Migration Agent</h2>
              <div className="space-y-4">
                {agentValue.map((item, i) => (
                  <div key={i} className="glass-card p-5">
                    <h3 className="t-text-primary font-semibold mb-2">{item.title}</h3>
                    <p className="t-text-faint text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><ExternalLink className="w-5 h-5 text-visa-gold" />Official Resources</h2>
              <div className="glass-card p-6 space-y-3">
                <a href="https://www.art.gov.au" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors">
                  <ExternalLink className="w-4 h-4" />Administrative Review Tribunal (ART) Official Website
                </a>
                <a href="https://www.art.gov.au/immigration-and-migration" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors">
                  <ExternalLink className="w-4 h-4" />ART Immigration and Migration Reviews
                </a>
                <a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/review-decisions-art" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors">
                  <ExternalLink className="w-4 h-4" />Department of Home Affairs - ART Review Information
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 border-red-500/30">
              <div className="flex items-center gap-3 mb-3"><ShieldAlert className="w-5 h-5 text-red-400" /><h3 className="font-bold t-text-primary">Urgent: Visa Refused?</h3></div>
              <p className="t-text-faint text-sm mb-4">Time limits are strict. Contact us immediately for urgent advice.</p>
              <Link to="/contact" className="btn-primary w-full text-center block mb-2">Get Urgent Help</Link>
              <p className="t-text-ghost text-xs text-center">$ 330 AUD/hour (pro rata)</p>
            </div>
            <div className="glass-card p-6 border-visa-gold/20">
              <h3 className="font-bold t-text-primary mb-3">Why Act Fast?</h3>
              <ul className="space-y-2 t-text-muted text-sm">
                <li className="flex items-start gap-2"><span className="text-red-400">&#8226;</span>Strict time limits (7-21 days)</li>
                <li className="flex items-start gap-2"><span className="text-red-400">&#8226;</span>No extensions granted</li>
                <li className="flex items-start gap-2"><span className="text-red-400">&#8226;</span>Bridging visa may expire</li>
                <li className="flex items-start gap-2"><span className="text-red-400">&#8226;</span>Evidence takes time to prepare</li>
              </ul>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Our ART Services</h3>
              <ul className="space-y-3">
                <li><Link to="/contact" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Merits review assessment</Link></li>
                <li><Link to="/contact" className="t-text-muted hover:text-visa-gold text-sm transition-colors">ART application lodgement</Link></li>
                <li><Link to="/contact" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Hearing representation</Link></li>
                <li><Link to="/contact" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Written submissions</Link></li>
                <li><Link to="/contact" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Bridging visa management</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default VisaRefusals;
