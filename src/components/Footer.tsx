import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/team', label: 'Our Team' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
  ];

  const visaServices = [
    { href: '/visas/visitor-visa-600', label: 'Visitor Visa 600' },
    { href: '/visas/partner-visa-820', label: 'Partner Visas (820/801, 309/100)' },
    { href: '/visas/skills-in-demand-482', label: 'Employer Sponsorship (482, 186)' },
    { href: '/visas/parent-visa-103', label: 'Parent Visa 103' },
    { href: '/services/skills-assessments', label: 'Skills Assessments' },
    { href: '/services/citizenship', label: 'Citizenship Applications' },
    { href: '/services/visa-refusals', label: 'ART Appeals' },
  ];

  const employerServices = [
    { href: '/employers', label: 'Employer Hub' },
    { href: '/visas/skills-in-demand-482', label: 'Skills in Demand 482' },
    { href: '/visas/employer-nomination-186', label: 'Employer Nomination 186' },
  ];

  return (
    <footer className="bg-visa-navyDark text-white" role="contentinfo">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & About */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-visa-navy rounded-lg flex items-center justify-center" aria-hidden="true">
                <svg className="w-6 h-6 text-visa-gold" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <span className="text-xl font-bold">Visa2AU</span>
            </Link>
            <p className="text-white/60 text-sm mb-6">
              Simplifying the complexity of Australian immigration. Expert migration support for individuals, families, and employers since 2004.
            </p>
            <div className="flex gap-4" aria-label="Social media links">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-visa-gold transition-colors" aria-label="Follow us on Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-visa-gold transition-colors" aria-label="Connect with us on LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-labelledby="footer-quick-links">
            <h4 id="footer-quick-links" className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="text-white/60 hover:text-visa-gold transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Visa Services */}
          <nav aria-labelledby="footer-visa-services">
            <h4 id="footer-visa-services" className="font-bold text-lg mb-6">Visa Services</h4>
            <ul className="space-y-3">
              {visaServices.map((service, index) => (
                <li key={index}>
                  <Link to={service.href} className="text-white/60 hover:text-visa-gold transition-colors text-sm">
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Employer Services */}
          <nav aria-labelledby="footer-employer-services">
            <h4 id="footer-employer-services" className="font-bold text-lg mb-6">For Employers</h4>
            <ul className="space-y-3">
              {employerServices.map((service, index) => (
                <li key={index}>
                  <Link to={service.href} className="text-white/60 hover:text-visa-gold transition-colors text-sm">
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-white/50 text-sm">
                &copy; {currentYear} Visa2AU. All rights reserved.
              </p>
            </div>

            <nav aria-label="Legal links" className="flex flex-wrap justify-center gap-4 text-sm text-white/50">
              <Link to="/terms" className="hover:text-visa-gold transition-colors">Privacy Policy & Terms</Link>
              <span aria-hidden="true">|</span>
              <Link to="/donations" className="hover:text-visa-gold transition-colors">Donations</Link>
              <span aria-hidden="true">|</span>
              <a href="https://www.mara.gov.au" target="_blank" rel="noopener noreferrer" className="hover:text-visa-gold transition-colors flex items-center gap-1">
                MARA <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </nav>
          </div>

          {/* MARN Notice */}
          <div className="mt-4 text-center">
            <p className="text-xs text-white/40">
              Visa2AU is a registered migration agency. All agents are registered with the Migration Agents Registration Authority (MARA).
              MARN: 0534230 (N. Arens), 2418663 (S. Vinnichenko)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;