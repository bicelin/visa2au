import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { Route, CheckCircle, Clock, FileText, ExternalLink, AlertTriangle, Shield, Plane, Home, Ban, Briefcase } from 'lucide-react';

const bridgingVisas = [
  {
    visa: 'Bridging Visa A (BVA)',
    subclass: 'Subclass 010',
    when: 'Automatically granted when you apply for a new substantive visa while holding a valid substantive visa in Australia.',
    workRights: 'Same as the visa you held when you applied. If that visa had work rights, the BVA usually inherits them.',
    travel: 'No - you cannot travel outside Australia on a BVA. If you leave, the BVA ceases.',
    conditions: 'No work (if previous visa had no work rights), Must not engage in paid work (8101)',
    icon: Home,
  },
  {
    visa: 'Bridging Visa B (BVB)',
    subclass: 'Subclass 020',
    when: 'Applied for separately when you hold a BVA and need to travel outside Australia temporarily.',
    workRights: 'Same as your BVA - work rights are maintained.',
    travel: 'Yes - specifically allows travel. You must specify your travel dates and purpose.',
    conditions: 'Limited travel period, Return before expiry or BVB ceases',
    icon: Plane,
  },
  {
    visa: 'Bridging Visa C (BVC)',
    subclass: 'Subclass 030',
    when: 'Granted when you apply for a substantive visa after your previous visa has already expired (unlawful status).',
    workRights: 'Generally no work rights unless you apply for and are granted a separate work permission.',
    travel: 'No - cannot travel outside Australia. If you leave, you cannot return on a BVC.',
    conditions: 'No work (8101), No further stay (8503 may apply)',
    icon: Shield,
  },
  {
    visa: 'Bridging Visa E (BVE)',
    subclass: 'Subclass 050',
    when: 'For people who are unlawful in Australia and are making arrangements to depart, or applying for a new visa.',
    workRights: 'Generally no work rights, but can apply for permission in limited circumstances.',
    travel: 'No - designed for departure only, not travel.',
    conditions: 'Must depart Australia by specified date, Report to Department as required',
    icon: Route,
  },
];

const conditionRemoval = [
  {
    condition: 'No Work (Condition 8101)',
    desc: 'Prevents you from engaging in paid employment in Australia. Common on visitor visas, bridging visas, and some other temporary visas.',
    impact: 'Cannot work to support yourself, limited financial independence, career disruption.',
    removal: 'We can prepare and lodge a request to remove this condition if you can demonstrate a compelling need to work (financial hardship, employer sponsorship, critical skills shortage in your field).',
  },
  {
    condition: 'No Further Stay (Condition 8503)',
    desc: 'Prevents you from applying for most further visas while in Australia. Common on visitor visas and some temporary visas.',
    impact: 'Cannot apply for another visa onshore, must depart Australia to apply for a new visa, disrupts migration strategy.',
    removal: 'We can apply for a waiver of this condition in very limited circumstances (compelling and compassionate reasons, such as serious illness, death of a family member, or relationship breakdown).',
  },
  {
    condition: 'Must Not Depart (Condition 8547)',
    desc: 'Prevents you from leaving Australia without permission.',
    impact: 'Cannot travel for family emergencies, business, or personal reasons.',
    removal: 'We can apply for permission to travel with supporting evidence of the compelling need.',
  },
];

const strategyPoints = [
  'Plan your visa applications to ensure continuous lawful status - gaps can lead to bridging visa C or E with fewer rights',
  'Never let your substantive visa expire before lodging a new application - this triggers much less favourable bridging conditions',
  'If you need to travel while on a bridging visa A, apply for a bridging visa B before you leave',
  'Understand the conditions on your bridging visa before accepting any work',
  'If you have a "no work" condition and face financial hardship, seek professional advice immediately',
  'Never breach visa conditions - this can affect future visa applications and character assessments',
  'Keep records of all your visa applications and bridging visa grants',
];

const ourServices = [
  'Comprehensive bridging visa strategy and planning',
  'Application for Bridging Visa B (travel permission)',
  'Request to remove "No Work" condition (8101)',
  'Waiver application for "No Further Stay" condition (8503)',
  'Bridging visa E applications for unlawful non-citizens',
  'Status resolution and becoming lawful again',
  'Coordination of multiple visa applications',
  'Communication with Department of Home Affairs',
];

const BridgingVisas = () => (
  <Layout>
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/imgs/hero-coast.jpg" alt="Australian coast - bridging between visas" className="w-full h-full object-cover" style={{ objectPosition: "center 30%" }} width="1920" height="1080" loading="eager" />
        <div className="absolute inset-0 hero-gradient" />
      </div>
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Route className="w-4 h-4 text-visa-gold" />
            <span className="t-text-primary text-sm font-medium">Visa Strategy</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">Bridging Visas <span className="text-gradient-gold">A, B, C & E</span></h1>
          <p className="t-text-muted text-lg leading-relaxed mb-8">Bridging visas are the connective tissue of the Australian immigration system. They maintain your lawful status while transitioning between visas. Understanding which bridging visa you hold, its conditions, and how to strategically manage them is critical to your migration journey.</p>
          <p className="t-text-ghost text-sm">Professional fee from $ 1,100 AUD | Government charges apply separately</p>
        </div>
      </div>
    </section>

    <section className="py-10 t-bg-body border-b t-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-5 text-center"><Clock className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Processing Time</p><p className="t-text-primary font-semibold">Instant - 4 weeks</p></div>
          <div className="glass-card p-5 text-center"><Briefcase className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Our Fee (from)</p><p className="t-text-primary font-semibold">$ 1,100 AUD</p></div>
          <div className="glass-card p-5 text-center"><FileText className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">No Government Fee</p><p className="t-text-primary font-semibold">Usually $0</p></div>
          <div className="glass-card p-5 text-center"><Briefcase className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Work Rights</p><p className="t-text-primary font-semibold">Varies by visa</p></div>
        </div>
      </div>
    </section>

    <section className="section-padding t-bg-body relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4">What is a Bridging Visa?</h2>
              <p className="t-text-muted leading-relaxed mb-4">A bridging visa is a temporary visa that lets you remain lawfully in Australia while you wait for a decision on a substantive visa application, wait for the outcome of an immigration review, or make arrangements to depart Australia.</p>
              <p className="t-text-muted leading-relaxed mb-4">The type of bridging visa you receive depends on your circumstances - particularly whether you held a valid visa when you applied for your new visa, whether you need to travel, and whether you are currently lawful or unlawful.</p>
              <div className="glass-card p-5 border-visa-gold/20 mt-4">
                <p className="t-text-secondary text-sm"><span className="text-visa-gold font-semibold">Why Bridging Visas Matter:</span> The difference between a Bridging Visa A (with work rights) and a Bridging Visa C (with no work rights and no travel) can fundamentally change your life in Australia. Strategic visa planning is essential to ensure you maintain the best possible bridging conditions.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-6">The Four Main Bridging Visas</h2>
              <div className="space-y-4">
                {bridgingVisas.map((bv, i) => (
                  <div key={i} className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-visa-gold/20 flex items-center justify-center shrink-0">
                        <bv.icon className="w-5 h-5 text-visa-gold" />
                      </div>
                      <div>
                        <h3 className="t-text-primary font-semibold">{bv.visa}</h3>
                        <p className="t-text-ghost text-xs">{bv.subclass}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-visa-gold font-medium">When granted:</span> <span className="t-text-muted">{bv.when}</span></div>
                      <div><span className="text-visa-teal font-medium">Work rights:</span> <span className="t-text-muted">{bv.workRights}</span></div>
                      <div><span className="text-red-400 font-medium">Travel:</span> <span className="t-text-muted">{bv.travel}</span></div>
                      <div><span className="t-text-secondary font-medium">Key conditions:</span> <span className="t-text-faint">{bv.conditions}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Ban className="w-5 h-5 text-red-400" />Condition Removal Services</h2>
              <p className="t-text-muted text-sm mb-4">Many bridging and temporary visas come with restrictive conditions that can severely limit your life in Australia. We specialise in requesting the removal of these conditions.</p>
              <div className="space-y-4">
                {conditionRemoval.map((cond, i) => (
                  <div key={i} className="glass-card p-5 border-red-500/10">
                    <h3 className="t-text-primary font-semibold mb-2">{cond.condition}</h3>
                    <p className="t-text-faint text-sm mb-2">{cond.desc}</p>
                    <div className="mb-2">
                      <span className="text-red-400 text-xs font-medium">Impact: </span>
                      <span className="t-text-faint text-xs">{cond.impact}</span>
                    </div>
                    <div>
                      <span className="text-visa-teal text-xs font-medium">How we help: </span>
                      <span className="t-text-faint text-xs">{cond.removal}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-visa-gold" />Strategic Visa Planning</h2>
              <div className="glass-card p-6 border-visa-gold/20">
                <p className="t-text-muted text-sm mb-4">The bridging visa you receive is often a direct result of your visa planning strategy. Here are essential principles we help our clients navigate:</p>
                <ul className="space-y-3">
                  {strategyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-gold shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{point}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-visa-gold" />How We Can Help</h2>
              <div className="glass-card p-6">
                <ul className="space-y-2">
                  {ourServices.map((service, i) => (
                    <li key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{service}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><ExternalLink className="w-5 h-5 text-visa-gold" />Official Resources</h2>
              <div className="glass-card p-6 space-y-3">
                <a href="https://immi.homeaffairs.gov.au/visas/already-have-a-visa/check-visa-details-and-conditions/see-your-visa-conditions" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors">
                  <ExternalLink className="w-4 h-4" />Check Your Visa Conditions (VEVO)
                </a>
                <a href="https://immi.homeaffairs.gov.au/visas/already-have-a-visa/bridging-visas" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-visa-teal hover:text-visa-gold text-sm transition-colors">
                  <ExternalLink className="w-4 h-4" />Department of Home Affairs - Bridging Visas
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 border-visa-gold/30">
              <h3 className="text-lg font-bold t-text-primary mb-3">Need Bridging Visa Advice?</h3>
              <p className="t-text-faint text-sm mb-4">Strategic advice can make the difference between a BVA with work rights and a BVC with restrictions.</p>
              <Link to="/contact" className="btn-primary w-full text-center block mb-2">Book Consultation</Link>
              <p className="t-text-ghost text-xs text-center">$ 330 AUD/hour (pro rata)</p>
            </div>
            <div className="glass-card p-6 border-red-500/20">
              <div className="flex items-center gap-3 mb-3"><AlertTriangle className="w-5 h-5 text-red-400" /><h3 className="font-bold t-text-primary">Urgent Situation?</h3></div>
              <p className="t-text-faint text-sm mb-3">Visa expired? Unlawful status? Need condition removal? Contact us immediately.</p>
              <a href="mailto:info@visa2.au" className="text-visa-gold text-sm hover:text-visa-goldLight">info@visa2.au</a>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Our Expertise</h3>
              <ul className="space-y-2 t-text-muted text-sm">
                <li className="flex items-start gap-2"><span className="text-visa-gold">&#8226;</span>BVA to BVB travel applications</li>
                <li className="flex items-start gap-2"><span className="text-visa-gold">&#8226;</span>Condition 8101 removal (work rights)</li>
                <li className="flex items-start gap-2"><span className="text-visa-gold">&#8226;</span>Condition 8503 waiver (No Further Stay)</li>
                <li className="flex items-start gap-2"><span className="text-visa-gold">&#8226;</span>BVE for unlawful non-citizens</li>
                <li className="flex items-start gap-2"><span className="text-visa-gold">&#8226;</span>Status resolution strategies</li>
              </ul>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Related Services</h3>
              <ul className="space-y-3">
                <li><Link to="/services/visa-refusals" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Visa Refusals & ART Appeals</Link></li>
                <li><Link to="/contact" className="t-text-muted hover:text-visa-gold text-sm transition-colors">General Consultation</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default BridgingVisas;
