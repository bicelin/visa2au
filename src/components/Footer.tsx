import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink, ArrowRight, ScrollText, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/our-team', label: 'About Us' },
    { href: '/our-team', label: 'Our Team' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
    { href: '/blog', label: 'Blog' },
  ];

  const visaServices = [
    { href: '/visas/visitor-visa-600', label: 'Visitor Visa 600' },
    { href: '/visas/partner-visa-820', label: 'Partner Visas (820/801, 309/100)' },
    { href: '/visas/skills-in-demand-482', label: 'Skills in Demand (SID) 482' },
    { href: '/visas/skilled-regional-494', label: 'Skilled Regional 494' },
    { href: '/visas/skilled-independent-189', label: 'Skilled Independent 189/190' },
    { href: '/visas/parent-visa-103', label: 'Parent Visa 103' },
    { href: '/visas/short-stay-400', label: 'Short Stay 400 & 408' },
    { href: '/visas/student-visa-500', label: 'Student Visa 500' },
    { href: '/visas/training-visa-407', label: 'Training Visa 407' },
    { href: '/services/skills-assessments', label: 'Skills Assessments' },
    { href: '/services/citizenship', label: 'Citizenship Applications' },
    { href: '/services/visa-refusals', label: 'ART Appeals' },
    { href: '/services/bridging-visas', label: 'Bridging Visas' },
    { href: '/services/protection-visa-866', label: 'Protection Visa 866' },
  ];

  const employerServices = [
    { href: '/employers', label: 'Employer Hub' },
    { href: '/visas/skills-in-demand-482', label: 'Skills in Demand 482 (SID)' },
    { href: '/visas/skilled-regional-494', label: 'Skilled Regional 494' },
    { href: '/visas/employer-nomination-186', label: 'Employer Nomination 186' },
  ];

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: 'var(--footer-bg)' }} role="contentinfo">
      <div className="absolute inset-0 dot-pattern" style={{ opacity: 0.15 }} aria-hidden="true" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)', opacity: 0.05 }} aria-hidden="true" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & About */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <img
                src="/imgs/logo.png"
                alt="Visa2AU - Smart Immigration"
                className="h-10 w-auto"
                width="224"
                height="80"
                loading="lazy"
              />
            </Link>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-faint)' }}>
              Simplifying the complexity of Australian immigration. Expert migration support for individuals, families, and employers since 2004.
            </p>

            <div className="space-y-3">
              <a href="mailto:info@visa2.au" className="flex items-center gap-2 text-sm transition-colors"
                style={{ color: 'var(--text-faint)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}>
                <Mail className="w-4 h-4" aria-hidden="true" /> info@visa2.au
              </a>
              <a href="tel:+61291362462" className="flex items-center gap-2 text-sm transition-colors"
                style={{ color: 'var(--text-faint)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}>
                <Phone className="w-4 h-4" aria-hidden="true" /> +61 2 9136 2462
              </a>
              <div className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-faint)' }}>
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                <span>Level 17, 1 Denison Street<br />North Sydney NSW 2060</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-labelledby="footer-quick-links">
            <h4 id="footer-quick-links" className="font-bold text-lg mb-6" style={{ color: 'var(--text-primary)' }}>Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.href}
                    className="text-sm flex items-center gap-2 group transition-colors"
                    style={{ color: 'var(--text-faint)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Visa Services */}
          <nav aria-labelledby="footer-visa-services">
            <h4 id="footer-visa-services" className="font-bold text-lg mb-6" style={{ color: 'var(--text-primary)' }}>Visa Services</h4>
            <ul className="space-y-3">
              {visaServices.map((service, i) => (
                <li key={i}>
                  <Link
                    to={service.href}
                    className="text-sm flex items-center gap-2 group transition-colors"
                    style={{ color: 'var(--text-faint)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Employer Services */}
          <nav aria-labelledby="footer-employer-services">
            <h4 id="footer-employer-services" className="font-bold text-lg mb-6" style={{ color: 'var(--text-primary)' }}>For Employers</h4>
            <ul className="space-y-3">
              {employerServices.map((service, i) => (
                <li key={i}>
                  <Link
                    to={service.href}
                    className="text-sm flex items-center gap-2 group transition-colors"
                    style={{ color: 'var(--text-faint)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h4 className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Free Visa Assessment</h4>
              <p className="text-xs mb-3" style={{ color: 'var(--text-ghost)' }}>Unsure which visa suits you? Take our quick online assessment.</p>
              <a
                href="https://visa2au.mmportal.cloud/assessment/enquiry/general-enquiry#nav-top"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm flex items-center gap-2 font-medium transition-colors"
                style={{ color: 'var(--gold)' }}
              >
                <ScrollText className="w-4 h-4" aria-hidden="true" />
                Start Assessment <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ color: 'var(--text-ghost)' }}>&copy; {currentYear} Visa2AU. All rights reserved.</p>
            <nav aria-label="Legal links" className="flex flex-wrap justify-center gap-4 text-sm" style={{ color: 'var(--text-ghost)' }}>
              <Link
                to="/terms"
                className="flex items-center gap-1 transition-colors hover:underline"
                style={{ color: 'var(--text-faint)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
              >
                <ScrollText className="w-3.5 h-3.5" /> Privacy Policy & Terms
              </Link>
              <span aria-hidden="true" style={{ color: 'var(--text-ghost)' }}>|</span>
              <Link
                to="/donations"
                className="flex items-center gap-1 transition-colors hover:underline"
                style={{ color: 'var(--text-faint)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
              >
                <Heart className="w-3.5 h-3.5" /> Donations
              </Link>
              <span aria-hidden="true" style={{ color: 'var(--text-ghost)' }}>|</span>
              <a
                href="https://www.mara.gov.au"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 transition-colors hover:underline"
                style={{ color: 'var(--text-faint)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
              >
                MARA <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </nav>
          </div>
          <p className="text-xs text-center mt-4" style={{ color: 'var(--text-ghost)' }}>
            Visa2AU is a registered migration agency. MARN: 0534230 (N. Arens), 2418663 (S. Vinnichenko). NAATI: CPN0VW21W (N. Arens)
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
