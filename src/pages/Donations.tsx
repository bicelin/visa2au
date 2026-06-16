import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { Heart, Globe, GraduationCap, ArrowRight, ShieldCheck, TreePine, BookOpen } from 'lucide-react';

const Donations = () => (
  <Layout>
    {/* Hero */}
    <section className="relative pt-32 pb-20 t-bg-body overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden="true" />
      <img src="/imgs/aboriginal-kangaroo.png" alt="" className="absolute top-10 right-10 w-32 h-32 opacity-10 pointer-events-none" aria-hidden="true" loading="lazy" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Heart className="w-4 h-4 text-visa-gold" aria-hidden="true" />
            <span className="t-text-primary text-sm font-medium">Giving Back</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">
            Our <span className="text-gradient-gold">Commitment</span>
          </h1>
          <p className="t-text-muted text-lg leading-relaxed max-w-2xl mx-auto">
            At Visa2AU, we believe in making a meaningful difference. Our social responsibility program supports education, cultural preservation, and humanitarian causes.
          </p>
        </div>
      </div>
    </section>

    {/* Mission Statement */}
    <section className="section-padding t-bg-body relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden="true" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="glass-panel p-8 md:p-10 text-center">
            <Globe className="w-12 h-12 text-visa-gold mx-auto mb-6" aria-hidden="true" />
            <h2 className="text-2xl md:text-3xl font-bold t-text-primary mb-4">
              Smart Immigration is Committed to Giving Back
            </h2>
            <p className="t-text-muted leading-relaxed mb-6">
              We believe that success comes with responsibility. That&apos;s why Visa2AU is proud to support social causes that make a real difference in people&apos;s lives. Whether it&apos;s helping a child access education or preserving Australia&apos;s rich Indigenous heritage, your support matters.
            </p>
            <p className="t-text-muted leading-relaxed">
              Every contribution &mdash; big or small &mdash; helps us build a stronger, more connected community. Thank you for being part of our mission to create lasting positive change.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Focus Areas */}
    <section className="section-padding t-bg-body relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden="true" />
      <img src="/imgs/aboriginal-turtle.png" alt="" className="absolute bottom-10 left-10 w-24 h-24 opacity-10 pointer-events-none" aria-hidden="true" loading="lazy" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold t-text-primary mb-4">
            Our Focus <span className="text-gradient-gold">Areas</span>
          </h2>
          <p className="t-text-muted max-w-2xl mx-auto">
            We direct our efforts toward causes that create lasting, meaningful impact in communities across Australia and beyond.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: GraduationCap,
              title: 'Education Support',
              description: 'We believe education changes lives. Our contributions help provide access to learning opportunities for underprivileged communities, supporting scholarships, educational resources, and skill-building programs.',
            },
            {
              icon: ShieldCheck,
              title: 'Humanitarian Causes',
              description: 'We support organisations that provide relief, protection, and assistance to displaced individuals and families. Our goal is to stand with those rebuilding their lives in new communities.',
            },
            {
              icon: TreePine,
              title: 'Aboriginal Cultural Programs',
              description: 'Australia\'s Indigenous heritage is deeply woven into its identity. We proudly support programs that preserve Aboriginal culture, language, and arts &mdash; honouring the traditions of the world\'s oldest continuous culture.',
            },
          ].map((area, i) => (
            <div key={i} className="glass-card p-8 hover:border-visa-gold/30 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-visa-gold/10 border border-visa-gold/20 flex items-center justify-center mb-5">
                <area.icon className="w-7 h-7 text-visa-gold" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold t-text-primary mb-3">{area.title}</h3>
              <p className="t-text-muted text-sm leading-relaxed">{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How to Support */}
    <section className="section-padding t-bg-body relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden="true" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="glass-panel p-8 md:p-10">
            <div className="text-center mb-8">
              <BookOpen className="w-10 h-10 text-visa-gold mx-auto mb-4" aria-hidden="true" />
              <h2 className="text-2xl md:text-3xl font-bold t-text-primary mb-4">
                How to Support Our Cause
              </h2>
              <p className="t-text-muted leading-relaxed">
                You can contribute by making a direct donation or by choosing to add a voluntary donation when using our immigration services. Every dollar goes toward creating meaningful impact.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="glass-card p-6 text-center">
                <Heart className="w-8 h-8 text-visa-gold mx-auto mb-3" aria-hidden="true" />
                <h3 className="t-text-primary font-semibold mb-2">Direct Donation</h3>
                <p className="t-text-faint text-sm mb-4">Support our programs directly with a one-time or recurring contribution.</p>
                <a
                  href="mailto:info@visa2.au?subject=Donation%20Enquiry"
                  className="btn-primary text-sm inline-flex items-center gap-2"
                >
                  Donate Now <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="glass-card p-6 text-center">
                <GraduationCap className="w-8 h-8 text-visa-teal mx-auto mb-3" aria-hidden="true" />
                <h3 className="t-text-primary font-semibold mb-2">Service Contribution</h3>
                <p className="t-text-faint text-sm mb-4">Add a voluntary donation when booking any of our visa services.</p>
                <Link to="/contact" className="btn-secondary text-sm inline-flex items-center gap-2">
                  Book a Service <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="text-center border-t t-border pt-6">
              <p className="t-text-ghost text-sm">
                Visa2AU is committed to transparency. All donations are used solely for the charitable purposes described above.
                For questions about our donation program, contact us at{' '}
                <a href="mailto:info@visa2.au" className="text-visa-gold hover:text-visa-goldLight">info@visa2.au</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Donations;
