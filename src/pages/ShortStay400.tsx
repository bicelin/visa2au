import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { Briefcase, CheckCircle, Clock, FileText, Users, ExternalLink, AlertTriangle, Globe } from 'lucide-react';

const visa400 = [
  {
    stream: 'Short Stay Activity Stream',
    desc: 'For short-term, highly specialised, non-ongoing work in Australia. Typically for experts, technicians, or professionals needed for a specific short-term project.',
    duration: 'Up to 3 months (can be extended to 6 in exceptional cases)',
    workRights: 'Specific non-ongoing work only',
    eligible: 'Highly skilled specialists, installers, after-sales service personnel',
  },
  {
    stream: 'Invite-Driven Stream',
    desc: 'For people invited by an Australian organisation to participate in a specific event, conference, or cultural activity.',
    duration: 'Up to 3 months',
    workRights: 'Activities related to the invitation only',
    eligible: 'Conference speakers, cultural performers, sporting event participants',
  },
  {
    stream: 'Australian Government Endorsed Event Stream',
    desc: 'For events endorsed by the Australian Government as being in the national interest.',
    duration: 'As specified in the endorsement',
    workRights: 'As specified in the endorsement',
    eligible: 'Participants in government-endorsed events',
  },
];

const visa408 = [
  {
    stream: 'COVID-19 Pandemic Event Stream',
    desc: 'For people in Australia who cannot depart due to COVID-19 travel restrictions or who are working in critical sectors during the pandemic.',
    duration: 'Up to 12 months',
    workRights: 'Full work rights in critical sectors',
    eligible: 'People unable to depart Australia, critical sector workers',
  },
  {
    stream: 'Government Endorsed Event Stream',
    desc: 'For people invited to participate in events endorsed by the Australian Government.',
    duration: 'Up to 4 years',
    workRights: 'Activities related to the event',
    eligible: 'Cultural, sporting, or trade event participants',
  },
  {
    stream: 'Entertainment Activities Stream',
    desc: 'For people working in the entertainment industry in Australia, including film, television, live performances, and productions.',
    duration: 'Up to 2 years',
    workRights: 'Entertainment work only',
    eligible: 'Performers, production crew, support staff',
  },
  {
    stream: 'Research Activities Stream',
    desc: 'For researchers, academics, and scientists conducting research at Australian institutions.',
    duration: 'Up to 2 years',
    workRights: 'Research activities only',
    eligible: 'Researchers, academics, visiting scholars',
  },
  {
    stream: 'Religious Work Stream',
    desc: 'For people undertaking full-time religious work in Australia.',
    duration: 'Up to 2 years',
    workRights: 'Religious work only',
    eligible: 'Ministers, missionaries, religious workers',
  },
  {
    stream: 'Special Program Stream',
    desc: 'For people participating in approved special programs that promote cultural exchange or community benefit.',
    duration: 'Up to 12 months',
    workRights: 'As per program terms',
    eligible: 'Youth exchange participants, community program participants',
  },
  {
    stream: 'Training Stream',
    desc: 'For people undertaking workplace-based training or professional development in Australia.',
    duration: 'Up to 2 years',
    workRights: 'Training activities only',
    eligible: 'Trainees, professional development participants',
  },
  {
    stream: 'Superyacht Crew Stream',
    desc: 'For crew members of superyachts operating in Australian waters.',
    duration: 'Up to 12 months',
    workRights: 'Crew duties on the superyacht',
    eligible: 'Superyacht crew members',
  },
];

const commonRequirements = [
  'Be genuinely temporary - intend to stay only for the specified period',
  'Have sufficient funds to support yourself during your stay',
  'Meet health and character requirements',
  'Have health insurance for the duration of your stay',
  'Not intend to engage in ongoing work unless specifically permitted by your visa stream',
];

const ShortStay400 = () => (
  <Layout>
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/imgs/hero-aboriginal.jpg" alt="Abstract background for short stay visas" className="w-full h-full object-cover" style={{ objectPosition: "center 30%" }} width="1920" height="1080" loading="eager" />
        <div className="absolute inset-0 hero-gradient" />
      </div>
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Globe className="w-4 h-4 text-visa-gold" />
            <span className="t-text-primary text-sm font-medium">Temporary Activity Visas</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">Short Stay Activity <span className="text-gradient-gold">400</span> & Temporary Activity <span className="text-gradient-gold">408</span></h1>
          <p className="t-text-muted text-lg leading-relaxed mb-8">Short-term visas for specialised work, cultural events, research, training, and other temporary activities in Australia. These visas are not pathways to permanent residency but serve important purposes for businesses, organisations, and individuals.</p>
          <p className="t-text-ghost text-sm">Professional fee from $ 1,650 AUD | Government charges apply separately</p>
        </div>
      </div>
    </section>

    <section className="py-10 t-bg-body border-b t-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-5 text-center"><Clock className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Processing Time</p><p className="t-text-primary font-semibold">1-4 weeks</p></div>
          <div className="glass-card p-5 text-center"><Briefcase className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Our Fee (from)</p><p className="t-text-primary font-semibold">$ 1,650 AUD</p></div>
          <div className="glass-card p-5 text-center"><FileText className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Duration</p><p className="t-text-primary font-semibold">Up to 4 years</p></div>
          <div className="glass-card p-5 text-center"><Users className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Pathway to PR</p><p className="t-text-primary font-semibold">No</p></div>
        </div>
      </div>
    </section>

    <section className="section-padding t-bg-body relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4">Short Stay Activity Visa (Subclass 400)</h2>
              <p className="t-text-muted leading-relaxed mb-4">The subclass 400 visa is for short-term, non-ongoing specialised work in Australia. It is not a general work visa - it is specifically for situations where an Australian employer or organisation needs someone with highly specialised skills for a short period.</p>
              <p className="t-text-muted leading-relaxed mb-4">This visa is not a substitute for a 482 Skills in Demand visa. If the work is ongoing, repetitive, or could be done by an Australian worker, the 400 visa is not appropriate.</p>
              <div className="space-y-4">
                {visa400.map((stream, index) => (
                  <div key={index} className="glass-card p-5">
                    <h3 className="t-text-primary font-semibold mb-2">{stream.stream}</h3>
                    <p className="t-text-faint text-sm mb-2">{stream.desc}</p>
                    <div className="flex flex-wrap gap-3 text-xs t-text-ghost">
                      <span><span className="text-visa-gold">Duration:</span> {stream.duration}</span>
                      <span><span className="text-visa-teal">Work:</span> {stream.workRights}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4">Temporary Activity Visa (Subclass 408)</h2>
              <p className="t-text-muted leading-relaxed mb-4">The subclass 408 visa covers a broader range of temporary activities in Australia, including cultural events, research, training, religious work, and entertainment. Each stream has specific requirements and conditions.</p>
              <div className="space-y-4">
                {visa408.map((stream, index) => (
                  <div key={index} className="glass-card p-5">
                    <h3 className="t-text-primary font-semibold mb-2">{stream.stream}</h3>
                    <p className="t-text-faint text-sm mb-2">{stream.desc}</p>
                    <div className="flex flex-wrap gap-3 text-xs t-text-ghost">
                      <span><span className="text-visa-gold">Duration:</span> {stream.duration}</span>
                      <span><span className="text-visa-teal">Work:</span> {stream.workRights}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-visa-gold" />Common Requirements</h2>
              <div className="glass-card p-6">
                <ul className="space-y-3">
                  {commonRequirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-gold shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{req}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-400" />Important Limitations</h2>
              <div className="glass-card p-6 border-red-500/20">
                <ul className="space-y-3">
                  {[
                    'Neither the 400 nor 408 visa leads to permanent residency',
                    'The 400 visa cannot be used for ongoing employment - it is for non-ongoing, specialised work only',
                    'The 408 COVID-19 stream is being phased out as travel restrictions ease',
                    'Working in breach of visa conditions can lead to visa cancellation',
                    'These visas are not suitable for general skilled migration purposes',
                    'If you need ongoing work rights, consider the 482 Skills in Demand visa instead',
                  ].map((limit, i) => (
                    <li key={i} className="flex items-start gap-3"><AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{limit}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-visa-gold" />How We Can Help</h2>
              <div className="glass-card p-6">
                <ul className="space-y-2">
                  {[
                    'Assess which visa (400, 408, or 482) is appropriate for your situation',
                    'Prepare the visa application with supporting evidence',
                    'Advise on health insurance requirements',
                    'Guide employers on their obligations for sponsored short-term workers',
                    'Assist with visa condition compliance',
                    'Advise on alternative visa options if these are not suitable',
                  ].map((service, i) => (
                    <li key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{service}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><ExternalLink className="w-5 h-5 text-visa-gold" />Official Resources</h2>
              <div className="glass-card p-6 space-y-3">
                <a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-work-short-stay-400" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors">
                  <ExternalLink className="w-4 h-4" />Subclass 400 - Official Page
                </a>
                <a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-activity-408" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors">
                  <ExternalLink className="w-4 h-4" />Subclass 408 - Official Page
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 border-visa-gold/30">
              <h3 className="text-lg font-bold t-text-primary mb-3">Need Short-Term Work Advice?</h3>
              <p className="t-text-faint text-sm mb-4">We will help you choose the right visa for your short-term needs.</p>
              <Link to="/contact" className="btn-primary w-full text-center block mb-2">Book Consultation</Link>
              <p className="t-text-ghost text-xs text-center">$ 330 AUD/hour (pro rata)</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Government Fees</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="t-text-faint">Subclass 400 application</span><span className="t-text-primary font-medium">$ 405 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">Subclass 408 application</span><span className="t-text-primary font-medium">$ 405 AUD</span></div>
              </div>
              <p className="t-text-ghost text-xs mt-3">Subject to change by Department of Home Affairs</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Related Visas</h3>
              <ul className="space-y-3">
                <li><Link to="/visas/skills-in-demand-482" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Skills in Demand 482 (SID)</Link></li>
                <li><Link to="/visas/visitor-visa-600" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Visitor Visa 600</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default ShortStay400;
