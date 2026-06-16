import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Check, ArrowRight, ChevronLeft, ChevronRight, Phone, Clock, Briefcase, Heart, Plane, Users, Shield, GraduationCap } from 'lucide-react';
import Layout from '../components/Layout';

const pricingCategories = [
  {
    id: 'consultations',
    title: 'Consultations',
    icon: Clock,
    items: [
      { name: 'Online Consultation (1 hour)', price: '$330 AUD', note: 'Professional visa assessment and advice' },
      { name: 'DAMA Consultation (1 hour)', price: '$330 AUD', note: 'Designated Area Migration Agreement advice' },
      { name: 'Family & Domestic Violence', price: 'Nil', note: 'No fee for victims of domestic violence' },
    ],
  },
  {
    id: 'travel',
    title: 'Travel & Short Stay Visas',
    icon: Plane,
    items: [
      { name: 'Subclass 600 - Visitor Visa (all streams)', price: '$700 AUD', note: 'Tourist, business, sponsored family' },
      { name: 'Subclass 602 - Medical Treatment Visa', price: '$700 AUD', note: 'Medical treatment in Australia' },
      { name: 'Subclass 651 - eVisitor Visa', price: '$700 AUD', note: 'Electronic visitor for eligible passport holders' },
    ],
  },
  {
    id: 'partner',
    title: 'Partner & Family Visas',
    icon: Heart,
    items: [
      { name: 'Subclass 820/801 - Partner Visa (Onshore)', price: '$5,500 AUD', note: 'Temporary to permanent partner pathway' },
      { name: 'Subclass 309/100 - Partner Visa (Offshore, 2 stage)', price: '$5,500 AUD', note: 'Full offshore partner visa process' },
      { name: 'Subclass 309/100 - Partner Visa (1 stage, Onshore)', price: '$2,200 AUD', note: 'Single stage onshore application' },
      { name: 'Subclass 300 - Prospective Marriage Visa', price: '$5,500 AUD', note: 'Fiancé visa pathway' },
      { name: 'Subclass 461 - NZ Citizen Family Relationship', price: '$2,200 AUD', note: 'For family of NZ citizens' },
      { name: 'Subclass 101 - Child Visa (Offshore)', price: '$3,960 AUD', note: 'For children of Australian citizens/residents' },
    ],
  },
  {
    id: 'parent',
    title: 'Parent Visas',
    icon: Users,
    items: [
      { name: 'Subclass 103 - Parent Visa (Offshore)', price: '$5,500 AUD', note: 'Permanent parent visa with long queue' },
      { name: 'Subclass 143 - Contributory Parent Visa', price: '$5,500 AUD', note: 'Fast-tracked permanent parent visa' },
      { name: 'Subclass 173 - Contributory Parent Visa (Temporary)', price: '$4,400 AUD', note: 'Temporary contributory parent pathway' },
      { name: 'Subclass 864 - Contributory Aged Parent Visa', price: '$5,500 AUD', note: 'For aged parents onshore' },
      { name: 'Subclass 884 - Contributory Aged Parent (Temp)', price: '$4,400 AUD', note: 'Temporary aged parent pathway' },
      { name: 'Subclass 870 - Sponsored Parent Visa', price: '$2,200 AUD', note: 'Temporary parent stay up to 5 years' },
      { name: 'Subclass 870 - Sponsored Parent (Combined)', price: '$3,300 AUD', note: 'Visa + sponsorship combined application' },
    ],
  },
  {
    id: 'work',
    title: 'Work Visas',
    icon: Briefcase,
    items: [
      { name: 'Subclass 482 - SID Visa (Employee)', price: '$3,300 AUD', note: 'Skills in Demand - employee side' },
      { name: 'Subclass 482 - SID Visa (Employer SBS)', price: '$3,300 AUD', note: 'Standard Business Sponsorship' },
      { name: 'Subclass 482 - SID Visa (Employer Nomination)', price: '$3,300 AUD', note: 'Nomination application' },
      { name: 'Subclass 494 - SESR Visa (Employee)', price: '$5,500 AUD', note: 'Skilled Employer Sponsored Regional' },
      { name: 'Subclass 494 - SESR Visa (Employer SBS)', price: '$5,500 AUD', note: 'Regional employer sponsorship' },
      { name: 'Subclass 494 - SESR Visa (Employer Nomination)', price: '$5,500 AUD', note: 'Regional nomination application' },
      { name: 'Subclass 400 - Temporary Work Visa', price: '$3,300 AUD', note: 'Short-term specialised work' },
      { name: 'Subclass 403 - Temporary Activity Visa', price: '$3,300 AUD', note: 'Temporary activity or work' },
      { name: 'Subclass 407 - Training Visa', price: '$3,300 AUD', note: 'Occupational training' },
      { name: 'Subclass 408 - Temporary Activity Visa', price: '$3,300 AUD', note: 'Temporary activity or research' },
      { name: 'Subclass 417 - Working Holiday Visa', price: '$2,200 AUD', note: 'For eligible countries aged 18-30' },
      { name: 'Subclass 462 - Work and Holiday Visa', price: '$2,200 AUD', note: 'For eligible countries with education requirement' },
    ],
  },
  {
    id: 'skilled',
    title: 'Permanent Skilled Visas',
    icon: GraduationCap,
    items: [
      { name: 'Subclass 189 - Skilled Independent Visa', price: '$5,500 AUD', note: 'Points-tested permanent visa, no sponsor required' },
      { name: 'Subclass 190 - Skilled State Nominated Visa', price: '$5,500 AUD', note: 'State/territory nominated permanent visa' },
      { name: 'Subclass 191 - Skilled Regional Visa', price: '$5,500 AUD', note: 'Permanent regional pathway (subclass 491/494 holders)' },
      { name: 'Subclass 491 - Skilled Work Regional Visa', price: '$5,500 AUD', note: 'Provisional 5-year regional visa' },
    ],
  },
  {
    id: 'other',
    title: 'Other Visas & Services',
    icon: Shield,
    items: [
      { name: 'Subclass 866 - Protection Visa (Onshore)', price: '$5,500 AUD', note: 'For refugees seeking protection in Australia' },
      { name: 'Subclass 500 - Student Visa', price: '$3,300 AUD', note: 'Full-time study in Australia' },
      { name: 'Bridging Visa B (BVB) Application', price: '$330 AUD', note: 'Travel permission while on a bridging visa' },
      { name: 'Skills Assessment (Professional)', price: '$3,300 AUD', note: 'Assessment for skilled migration' },
      { name: 'ART Tribunal Application', price: '$5,500 AUD', note: 'Visa refusal appeal to Administrative Review Tribunal' },
      { name: 'NAATI Translation', price: 'On demand', note: 'Certified translation by NAATI accredited translator' },
    ],
  },
];

const Pricing = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const category = pricingCategories[activeCategory];

  const nextCategory = () => setActiveCategory((prev) => (prev + 1) % pricingCategories.length);
  const prevCategory = () => setActiveCategory((prev) => (prev - 1 + pricingCategories.length) % pricingCategories.length);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 t-bg-body overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden="true" />
        {/* Aboriginal turtle decoration */}
        <img src="/imgs/aboriginal-turtle.png" alt="" className="absolute bottom-0 right-0 w-40 h-40 opacity-10 pointer-events-none" aria-hidden="true" loading="lazy" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
              <DollarSign className="w-4 h-4 text-visa-gold" aria-hidden="true" />
              <span className="t-text-primary text-sm font-medium">Transparent Pricing</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">
              Professional Service <span className="text-gradient-gold">Fees</span>
            </h1>
            <p className="t-text-muted text-lg max-w-2xl mx-auto">
              All fees are in Australian Dollars (AUD) and include GST. These are indicative fees only — contact us for a personalised quote.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Factors */}
      <section className="py-12 t-bg-body border-b t-border">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-lg font-semibold t-text-secondary mb-8">Key Factors That Impact Pricing</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {['Visa type and subclass', 'Onshore vs offshore', 'Skills assessments required', 'Time and resources needed'].map((f, i) => (
              <div key={i} className="glass-card p-4 text-center">
                <Check className="w-5 h-5 text-visa-gold mx-auto mb-2" aria-hidden="true" />
                <p className="t-text-secondary text-sm">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Tabs - Desktop */}
      <section className="py-8 t-bg-body border-b t-border hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {pricingCategories.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(i)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  i === activeCategory
                    ? 'bg-visa-gold text-visa-navy'
                    : 'glass-card t-text-muted hover:t-text-primary hover:border-visa-gold/30'
                }`}
              >
                <cat.icon className="w-4 h-4 inline mr-1.5" aria-hidden="true" />
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Category Carousel - Mobile */}
      <section className="py-6 t-bg-body border-b t-border md:hidden">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <button onClick={prevCategory} className="p-2 t-text-faint hover:text-visa-gold" aria-label="Previous category">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <category.icon className="w-5 h-5 text-visa-gold" aria-hidden="true" />
            <span className="t-text-primary font-semibold">{category.title}</span>
          </div>
          <button onClick={nextCategory} className="p-2 t-text-faint hover:text-visa-gold" aria-label="Next category">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        {/* Dots indicator */}
        <div className="flex justify-center gap-1.5 mt-3">
          {pricingCategories.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveCategory(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === activeCategory ? 'bg-visa-gold w-6' : 'bg-white/20'}`}
              aria-label={`Go to category ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Fee Table */}
      <section className="section-padding t-bg-body relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden="true" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="glass-panel overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-5 border-b t-border t-bg-input">
                <div className="col-span-7 md:col-span-8 t-text-faint text-sm font-semibold uppercase tracking-wider">Service</div>
                <div className="col-span-5 md:col-span-4 t-text-faint text-sm font-semibold uppercase tracking-wider text-right">Professional Fee</div>
              </div>

              {/* Table Rows */}
              {category.items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 p-5 border-b t-border hover:bg-white/[0.02] transition-colors group">
                  <div className="col-span-7 md:col-span-8">
                    <p className="t-text-primary font-medium group-hover:text-visa-gold transition-colors">{item.name}</p>
                    <p className="t-text-ghost text-sm mt-1">{item.note}</p>
                  </div>
                  <div className="col-span-5 md:col-span-4 flex items-center justify-end">
                    <span className={`text-xl font-bold ${item.price === 'Nil' ? 'text-visa-teal' : 'text-gradient-gold'}`}>{item.price}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="mt-8 glass-card p-6">
              <h3 className="t-text-primary font-semibold mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-visa-gold" aria-hidden="true" />
                Important Notes
              </h3>
              <ul className="space-y-2 t-text-faint text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-visa-gold mt-1">&#8226;</span>
                  All professional fees are in Australian Dollars (AUD) and include GST.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-visa-gold mt-1">&#8226;</span>
                  Fees exclude Department of Home Affairs visa application charges and other government fees.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-visa-gold mt-1">&#8226;</span>
                  Fees may vary based on individual circumstances and case complexity. Contact us for a personalised quote.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-visa-gold mt-1">&#8226;</span>
                  All fees are indicative only and may vary based on individual circumstances.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-visa-gold mt-1">&#8226;</span>
                  Family and domestic violence consultations are provided at no charge.
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <p className="t-text-faint mb-4">Need a personalised quote for your situation?</p>
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                Request a Quote <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="t-text-ghost text-sm mt-3">
                Or call us: <a href="tel:+61291362462" className="text-visa-gold hover:text-visa-goldLight flex items-center gap-1 inline-flex"><Phone className="w-3 h-3" />+61 2 9136 2462</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
