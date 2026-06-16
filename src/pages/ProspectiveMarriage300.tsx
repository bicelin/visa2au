import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { Heart, CheckCircle, Clock, FileText, HelpCircle, AlertTriangle, XCircle, Plane, Users, Diamond , Briefcase} from 'lucide-react';

const requirements = [
  'Be sponsored by an Australian citizen, permanent resident, or eligible New Zealand citizen',
  'Be aged 18 years or older (both applicant and sponsor)',
  'Be outside Australia when you apply and when the visa is granted',
  'Intend to marry your fiancé within 9 months of arriving in Australia',
  'Genuinely intend to live together as spouses after marriage',
  'Have met your fiancé in person (online-only relationships are not sufficient)',
  'Meet health and character requirements',
  'Have no outstanding debts to the Australian Government',
];

const processSteps = [
  { step: 'Apply from Outside Australia', desc: 'Lodge your Prospective Marriage visa application while you are outside Australia. You cannot apply from within Australia.' },
  { step: 'Visa Grant', desc: 'If approved, you will receive a 9-month visa to travel to Australia. You can work and study during this period.' },
  { step: 'Travel to Australia', desc: 'Enter Australia within the visa validity period and prepare for your wedding.' },
  { step: 'Marry Within 9 Months', desc: 'You must marry your Australian fiancé within 9 months of your first entry into Australia on this visa.' },
  { step: 'Apply for Partner Visa', desc: 'After marriage, apply for the onshore Partner Visa (subclass 820/801) to remain in Australia permanently.' },
];

const services = [
  'Eligibility assessment for both applicant and sponsor',
  'Evidence of relationship and meeting in person',
  'Wedding planning timeline and visa coordination',
  'Application preparation and lodgement',
  'Health and character requirement guidance',
  'Communication with Department of Home Affairs',
  'Partner visa (820/801) transition assistance after marriage',
];

const ProspectiveMarriage300 = () => (
  <Layout>
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/imgs/hero-prospective-marriage.jpg" alt="Couple at Australian sunset - prospective marriage visa" className="w-full h-full object-cover" style={{ objectPosition: "center 30%" }} width="1920" height="1080" loading="eager" />
        <div className="absolute inset-0 hero-gradient" />
      </div>
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Diamond className="w-4 h-4 text-visa-gold" />
            <span className="t-text-primary text-sm font-medium">Prospective Marriage Visa</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">Prospective Marriage Visa <span className="text-gradient-gold">300</span></h1>
          <p className="t-text-muted text-lg leading-relaxed mb-8">For people engaged to an Australian citizen, permanent resident, or eligible New Zealand citizen. This visa lets you travel to Australia to marry your fiancé, after which you can apply for permanent residency.</p>
          <p className="t-text-ghost text-sm mt-4">Professional fee from $ 5,500 AUD | Government charges apply separately</p>
        </div>
      </div>
    </section>

    <section className="py-10 t-bg-body border-b t-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-5 text-center"><Clock className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Processing Time</p><p className="t-text-primary font-semibold">12-18 months</p></div>
          <div className="glass-card p-5 text-center"><Briefcase className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Our Fee (from)</p><p className="t-text-primary font-semibold">$ 5,500 AUD</p></div>
          <div className="glass-card p-5 text-center"><FileText className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Valid For</p><p className="t-text-primary font-semibold">9 months</p></div>
          <div className="glass-card p-5 text-center"><Plane className="w-6 h-6 text-visa-gold mx-auto mb-2" /><p className="t-text-faint text-sm">Apply From</p><p className="t-text-primary font-semibold">Outside Australia</p></div>
        </div>
      </div>
    </section>

    <section className="section-padding t-bg-body relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4">What is the Prospective Marriage Visa (Subclass 300)?</h2>
              <p className="t-text-muted leading-relaxed mb-4">The Prospective Marriage Visa (subclass 300), commonly known as the fiancé visa, allows you to enter Australia and marry your Australian partner. This is the first step toward permanent residency for couples who are engaged but not yet married.</p>
              <p className="t-text-muted leading-relaxed">Once you enter Australia on this visa, you have 9 months to marry your partner. After the wedding, you can apply for the Partner Visa (subclass 820/801) to remain in Australia permanently. You can work and study during the 9-month period while on the subclass 300 visa.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-visa-gold" />The Five-Step Process</h2>
              <div className="space-y-4">
                {processSteps.map((stage, index) => (
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
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-visa-gold" />Requirements</h2>
              <div className="glass-card p-6">
                <ul className="space-y-3">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-visa-gold shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{req}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-400" />Important Limitations</h2>
              <div className="glass-card p-6 border-red-500/20">
                <ul className="space-y-3">
                  {[
                    'You must marry within 9 months - failure to do so may result in visa cancellation',
                    'You cannot apply for this visa from within Australia',
                    'This visa does not automatically lead to permanent residency - you must apply for Partner Visa after marriage',
                    'If the relationship ends before marriage, the visa holder must leave Australia',
                    'The sponsor can only sponsor two fiancés in their lifetime (with certain exceptions)',
                  ].map((reason, index) => (
                    <li key={index} className="flex items-start gap-3"><AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{reason}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Heart className="w-5 h-5 text-visa-gold" />How We Can Help</h2>
              <div className="glass-card p-6">
                <ul className="grid sm:grid-cols-2 gap-3">
                  {services.map((service, index) => (
                    <li key={index} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{service}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 border-visa-gold/30">
              <h3 className="text-lg font-bold t-text-primary mb-3">Ready to Apply?</h3>
              <p className="t-text-faint text-sm mb-4">Let us guide you through your fiancé visa journey.</p>
              <Link to="/contact" className="btn-primary w-full text-center block mb-2">Book Consultation</Link>
              <p className="t-text-ghost text-xs text-center">$ 330 AUD/hour (pro rata)</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Government Fees</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="t-text-faint">Base application charge</span><span className="t-text-primary font-medium">$ 9,365 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">Additional applicant (18+)</span><span className="t-text-primary font-medium">$ 4,690 AUD</span></div>
                <div className="flex justify-between"><span className="t-text-faint">Additional applicant (under 18)</span><span className="t-text-primary font-medium">$ 2,345 AUD</span></div>
              </div>
              <p className="t-text-ghost text-xs mt-3">Subject to change by Department of Home Affairs</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold t-text-primary mb-4">Related Visas</h3>
              <ul className="space-y-3">
                <li><Link to="/visas/partner-visa-820" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Partner Visa 820/801 (Onshore)</Link></li>
                <li><Link to="/visas/partner-visa-309" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Partner Visa 309/100 (Offshore)</Link></li>
              </ul>
            </div>
            <div className="glass-card p-6 border-red-500/20">
              <div className="flex items-center gap-3 mb-3"><HelpCircle className="w-5 h-5 text-red-400" /><h3 className="font-semibold t-text-primary">Questions?</h3></div>
              <p className="t-text-faint text-sm mb-3">Contact us for a personalised assessment.</p>
              <a href="mailto:info@visa2.au" className="text-visa-gold text-sm hover:text-visa-goldLight">info@visa2.au</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default ProspectiveMarriage300;
