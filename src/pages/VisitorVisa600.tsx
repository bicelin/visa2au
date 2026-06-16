import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { Plane, CheckCircle, Clock, ArrowRight, FileText, HelpCircle, AlertTriangle, XCircle, Users, MapPin, HeartHandshake , Briefcase} from 'lucide-react';

const VisitorVisa600 = () => {
  const requirements = [
    'Valid passport with at least 6 months validity beyond your intended stay',
    'Genuine temporary entrant (GTE) - you must intend to stay temporarily in Australia',
    'Sufficient funds to cover your stay (bank statements, payslips, or sponsor evidence)',
    'Meet health requirements (medical examinations may be required)',
    'Meet character requirements (police clearances from countries lived in for 12+ months)',
    'Evidence of ties to your home country (employment letter, property ownership, family)',
    'Travel itinerary including accommodation bookings or invitation letter',
    'Health insurance for the duration of your stay (strongly recommended)',
  ];

  const streams = [
    { name: 'Tourist Stream', description: 'For holidays, sightseeing, visiting friends and family, or other recreational purposes. This is the most common stream for visitors.', duration: 'Up to 12 months', who: 'Holiday makers, family visitors' },
    { name: 'Sponsored Family Stream', description: 'For family members who have an eligible family member in Australia willing to sponsor their visit. The sponsor provides a bond and financial support.', duration: 'Up to 12 months', who: 'Parents, siblings, relatives of Australian residents' },
    { name: 'Business Visitor Stream', description: 'For short-term business visits including meetings, conferences, negotiations, or exploratory business visits. Does not permit work.', duration: 'Up to 3 months', who: 'Business visitors, conference attendees' },
    { name: 'Approved Destination Status Stream', description: 'For citizens from certain countries visiting as part of an approved tour group.', duration: 'As per tour', who: 'Tour group participants from China' },
    { name: 'Frequent Traveller Stream', description: 'For frequent business travellers from the People\'s Republic of China with a long-term, multiple-entry visa.', duration: 'Up to 10 years', who: 'Frequent Chinese business travellers' },
  ];

  const commonReasonsRefusal = [
    'Insufficient evidence of ties to home country',
    'Inconsistent information across application documents',
    'Concerns about financial capacity to support the visit',
    'Previous visa compliance issues or overstays',
    'Failure to meet health or character requirements',
    'Submitting fraudulent or misleading documents',
  ];

  const servicesProvided = [
    'Complete visa eligibility assessment',
    'Document checklist tailored to your circumstances',
    'Application form preparation and review',
    'Genuine temporary entrant statement drafting',
    'Financial evidence compilation guidance',
    'Sponsorship letter preparation (if applicable)',
    'Application lodgement and tracking',
    'Communication with Department of Home Affairs',
    'Post-lodgement follow-up and advice',
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/imgs/hero-coast.jpg" alt="Australian coastline" className="w-full h-full object-cover" style={{ objectPosition: "center 30%" }} width="1920" height="1080" loading="eager" />
          <div className="absolute inset-0 hero-gradient" />
        </div>
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
              <Plane className="w-4 h-4 text-visa-gold" aria-hidden="true" />
              <span className="t-text-primary text-sm font-medium">Visitor Visa</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">Visitor Visa <span className="text-gradient-gold">Subclass 600</span></h1>
            <p className="t-text-muted text-lg leading-relaxed mb-8">The Visitor Visa (subclass 600) allows you to visit Australia for tourism, business, or to see family and friends. Multiple streams cater to different purposes of visit.</p>
            <p className="t-text-ghost text-sm mt-4">Professional fee from $770 AUD | Government charges apply separately</p>
          </div>
        </div>
      </section>

      {/* Overview Cards */}
      <section className="py-10 t-bg-body border-b t-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-card p-5 text-center">
              <Clock className="w-6 h-6 text-visa-gold mx-auto mb-2" />
              <p className="t-text-faint text-sm">Processing Time</p>
              <p className="t-text-primary font-semibold">14-30 days</p>
              <p className="t-text-ghost text-xs">(approximate)</p>
            </div>
            <div className="glass-card p-5 text-center">
              <Briefcase className="w-6 h-6 text-visa-gold mx-auto mb-2" />
              <p className="t-text-faint text-sm">Our Fee</p>
              <p className="t-text-primary font-semibold">$770 AUD</p>
              <p className="t-text-ghost text-xs">per application</p>
            </div>
            <div className="glass-card p-5 text-center">
              <FileText className="w-6 h-6 text-visa-gold mx-auto mb-2" />
              <p className="t-text-faint text-sm">Stay Duration</p>
              <p className="t-text-primary font-semibold">Up to 12 months</p>
              <p className="t-text-ghost text-xs">depends on stream</p>
            </div>
            <div className="glass-card p-5 text-center">
              <MapPin className="w-6 h-6 text-visa-gold mx-auto mb-2" />
              <p className="t-text-faint text-sm">Where to Apply</p>
              <p className="t-text-primary font-semibold">Offshore</p>
              <p className="t-text-ghost text-xs">(usually)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding t-bg-body relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* What is this visa */}
              <div>
                <h2 className="text-2xl font-bold t-text-primary mb-4">What is the Visitor Visa (Subclass 600)?</h2>
                <p className="t-text-muted leading-relaxed mb-4">The Visitor Visa (subclass 600) lets you visit Australia for tourism or business visitor activities. It is a temporary visa with multiple streams designed to cater to different visitor purposes. You must apply from outside Australia (with some exceptions for the Tourist stream) and the visa can be granted for single or multiple entries.</p>
                <p className="t-text-muted leading-relaxed">This visa does not allow you to work in Australia. If you are visiting for business purposes, you can conduct business visitor activities such as attending conferences, negotiating contracts, or exploratory business visits, but you cannot work for or provide services to an Australian business.</p>
              </div>

              {/* Visa Streams */}
              <div>
                <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-visa-gold" />Available Visa Streams</h2>
                <div className="space-y-4">
                  {streams.map((stream, index) => (
                    <div key={index} className="glass-card p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <h3 className="text-lg font-semibold t-text-primary">{stream.name}</h3>
                        <span className="text-visa-gold text-sm font-medium">{stream.duration}</span>
                      </div>
                      <p className="t-text-muted text-sm mb-2">{stream.description}</p>
                      <p className="t-text-ghost text-xs"><span className="text-visa-teal">Best for:</span> {stream.who}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
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

              {/* Common Refusal Reasons */}
              <div>
                <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-400" />Common Reasons for Refusal</h2>
                <div className="glass-card p-6 border-red-500/20">
                  <ul className="space-y-3">
                    {commonReasonsRefusal.map((reason, index) => (
                      <li key={index} className="flex items-start gap-3"><AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{reason}</span></li>
                    ))}
                  </ul>
                  <p className="t-text-ghost text-sm mt-4">If your visa has been refused, contact us immediately. We can advise on your appeal options including ART (Administrative Review Tribunal) review.</p>
                </div>
              </div>

              {/* Our Services */}
              <div>
                <h2 className="text-2xl font-bold t-text-primary mb-4 flex items-center gap-2"><HeartHandshake className="w-5 h-5 text-visa-gold" />How We Can Help</h2>
                <div className="glass-card p-6">
                  <p className="t-text-muted mb-4">Our MARN-registered migration agents provide comprehensive support throughout your Visitor Visa application:</p>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {servicesProvided.map((service, index) => (
                      <li key={index} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" /><span className="t-text-secondary text-sm">{service}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="glass-panel p-6 border-visa-gold/30">
                <h3 className="text-lg font-bold t-text-primary mb-3">Ready to Apply?</h3>
                <p className="t-text-faint text-sm mb-4">Get expert assistance with your Visitor Visa application.</p>
                <Link to="/contact" className="btn-primary w-full text-center block mb-2">Book Consultation</Link>
                <p className="t-text-ghost text-xs text-center">$330 AUD/hour (pro rata)</p>
              </div>
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold t-text-primary mb-4">Government Fees</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="t-text-faint">Base application charge</span><span className="t-text-primary font-medium">$200 AUD</span></div>
                  <div className="flex justify-between"><span className="t-text-faint">Additional applicant (18+)</span><span className="t-text-primary font-medium">$200 AUD</span></div>
                  <div className="flex justify-between"><span className="t-text-faint">Additional applicant (under 18)</span><span className="t-text-primary font-medium">$55 AUD</span></div>
                </div>
                <p className="t-text-ghost text-xs mt-3">Subject to change by Department of Home Affairs</p>
              </div>
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold t-text-primary mb-4">Related Visas</h3>
                <ul className="space-y-3">
                  <li><Link to="/visas/work-holiday-417" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Work & Holiday 417</Link></li>
                  <li><Link to="/visas/partner-visa-820" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Partner Visa 820/801</Link></li>
                  <li><Link to="/services/skills-assessments" className="t-text-muted hover:text-visa-gold text-sm transition-colors">Skills Assessment</Link></li>
                </ul>
              </div>
              <div className="glass-card p-6 border-red-500/20">
                <div className="flex items-center gap-3 mb-3"><HelpCircle className="w-5 h-5 text-red-400" /><h3 className="font-semibold t-text-primary">Visa Refused?</h3></div>
                <p className="t-text-faint text-sm mb-3">We can help with appeals and AAT representation.</p>
                <Link to="/services/visa-refusals" className="text-red-400 text-sm hover:text-red-300 flex items-center gap-1">Learn about appeals <ArrowRight className="w-3 h-3" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default VisitorVisa600;
