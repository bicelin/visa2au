import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, ChevronDown, Globe } from 'lucide-react';

// Language context for i18n support
export const languages = [
  { code: 'en', name: 'EN', label: 'English' },
  { code: 'ru', name: 'RU', label: 'Русский' },
  { code: 'fr', name: 'FR', label: 'Français' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Combined Visa Services Menu
  const visaServicesMenuItems = [
    {
      section: 'Partner & Family Visas',
      items: [
        { href: '/visas/partner-visa-820', label: 'Partner Visa 820/801' },
        { href: '/visas/partner-visa-309', label: 'Partner Visa 309/100' },
        { href: '/visas/prospective-marriage-300', label: 'Prospective Marriage 300' },
        { href: '/visas/parent-visa-103', label: 'Parent Visa 103' },
      ]
    },
    {
      section: 'Work & Employer Visas',
      items: [
        { href: '/visas/work-holiday-417', label: 'Work & Holiday 417' },
        { href: '/visas/skills-in-demand-482', label: 'Skills in Demand 482' },
        { href: '/visas/employer-nomination-186', label: 'Employer Nomination 186' },
        { href: '/employers', label: 'Employer Hub' },
      ]
    },
    {
      section: 'Visitor & Other Visas',
      items: [
        { href: '/visas/visitor-visa-600', label: 'Visitor Visa 600' },
      ]
    },
    {
      section: 'Additional Services',
      items: [
        { href: '/services/skills-assessments', label: 'Skills Assessments' },
        { href: '/services/citizenship', label: 'Citizenship Applications' },
        { href: '/services/visa-refusals', label: 'ART Appeals & Refusals' },
      ]
    },
  ];

  // Our Team Menu - links to combined OurTeam page
  const teamMenuItems = [
    { href: '/our-team', label: 'Our Team' },
    { href: '/pricing', label: 'Pricing & Fees' },
    { href: '/blog', label: 'Blog' },
    { href: '/donations', label: 'Support Us' },
  ];

  const mainNavLinks = [
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-visa-navy shadow-lg' : 'bg-transparent'}`} role="navigation" aria-label="Main navigation">
      {/* Top bar - contact info */}
      <div className={`hidden lg:block bg-visa-navyDark transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden py-0' : 'py-2'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6 text-white/80">
            <a href="tel:+61291362462" className="flex items-center gap-2 hover:text-visa-gold transition-colors" aria-label="Call us - voicemail service">
              <Phone className="w-4 h-4" aria-hidden="true" />
              <span>+61 2 9136 2462</span>
              <span className="text-xs text-white/50">(voicemail)</span>
            </a>
            <a href="mailto:info@visa2.au" className="flex items-center gap-2 hover:text-visa-gold transition-colors" aria-label="Email us at info@visa2.au">
              <Mail className="w-4 h-4" aria-hidden="true" />
              <span>info@visa2.au</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/60" aria-label="Office location">
              Level 17, 1 Denison Street, North Sydney NSW 2060
            </span>
            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
                aria-expanded={isLangOpen}
                aria-haspopup="listbox"
              >
                <Globe className="w-4 h-4" />
                <span>EN</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${lang.code === 'en' ? 'bg-visa-navy/5 text-visa-navy font-medium' : 'text-visa-charcoal hover:bg-gray-50'}`}
                      onClick={() => {
                        // Future: implement actual language switching
                        console.log(`Language ${lang.code} selected - translation coming soon`);
                        setIsLangOpen(false);
                      }}
                    >
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-visa-charcoal/60 ml-2">{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className={`bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300 ${isScrolled ? 'lg:shadow-lg' : 'lg:shadow-none'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20" ref={dropdownRef}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3" aria-label="Visa2AU - Back to homepage">
              <img src="/logo_blue.svg" alt="Visa2AU Logo" className="h-12 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6" role="menubar">
              {/* Visa Services Dropdown - Combined Menu */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'visas' ? null : 'visas')}
                  className="flex items-center gap-1 text-visa-charcoal hover:text-visa-navy font-medium transition-colors"
                  aria-expanded={activeDropdown === 'visas'}
                  aria-haspopup="true"
                >
                  Visa Services
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'visas' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'visas' && (
                  <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-100 p-4 animate-fade-in">
                    {visaServicesMenuItems.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="mb-4 last:mb-0">
                        <h3 className="text-xs font-semibold text-visa-gold uppercase tracking-wider mb-2">{section.section}</h3>
                        <div className="space-y-1">
                          {section.items.map((item, itemIndex) => (
                            <Link
                              key={itemIndex}
                              to={item.href}
                              className="block px-3 py-2 text-sm text-visa-charcoal hover:text-visa-navy hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Our Team Dropdown - Links to combined page */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'team' ? null : 'team')}
                  className="flex items-center gap-1 text-visa-charcoal hover:text-visa-navy font-medium transition-colors"
                  aria-expanded={activeDropdown === 'team'}
                  aria-haspopup="true"
                >
                  Our Team
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'team' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'team' && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in">
                    {teamMenuItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.href}
                        className="block px-4 py-2 text-sm text-visa-charcoal hover:text-visa-navy hover:bg-gray-50 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Main Nav Links */}
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-visa-charcoal hover:text-visa-navy font-medium transition-colors relative group"
                  role="menuitem"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-visa-gold transition-all duration-300 group-hover:w-full" aria-hidden="true" />
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                Book Consultation
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-visa-navy"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div id="mobile-menu" className={`lg:hidden bg-white border-t transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'}`} aria-hidden={!isMobileMenuOpen}>
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-4" role="menu">
              {/* Mobile Visa Services Dropdown */}
              <div>
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'mobile-visas' ? null : 'mobile-visas')}
                  className="flex items-center justify-between w-full text-visa-charcoal hover:text-visa-navy font-medium py-2"
                >
                  Visa Services
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'mobile-visas' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'mobile-visas' && (
                  <div className="pl-4 space-y-3 mt-2">
                    <div>
                      <p className="text-xs font-semibold text-visa-gold uppercase tracking-wider mb-1">Partner & Family Visas</p>
                      <Link to="/visas/partner-visa-820" className="block text-visa-charcoal/70 py-1 pl-2">Partner Visa 820/801</Link>
                      <Link to="/visas/partner-visa-309" className="block text-visa-charcoal/70 py-1 pl-2">Partner Visa 309/100</Link>
                      <Link to="/visas/prospective-marriage-300" className="block text-visa-charcoal/70 py-1 pl-2">Prospective Marriage 300</Link>
                      <Link to="/visas/parent-visa-103" className="block text-visa-charcoal/70 py-1 pl-2">Parent Visa 103</Link>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-visa-gold uppercase tracking-wider mb-1">Work & Employer Visas</p>
                      <Link to="/visas/work-holiday-417" className="block text-visa-charcoal/70 py-1 pl-2">Work & Holiday 417</Link>
                      <Link to="/visas/skills-in-demand-482" className="block text-visa-charcoal/70 py-1 pl-2">Skills in Demand 482</Link>
                      <Link to="/visas/employer-nomination-186" className="block text-visa-charcoal/70 py-1 pl-2">Employer Nomination 186</Link>
                      <Link to="/employers" className="block text-visa-charcoal/70 py-1 pl-2">Employer Hub</Link>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-visa-gold uppercase tracking-wider mb-1">Visitor & Other Visas</p>
                      <Link to="/visas/visitor-visa-600" className="block text-visa-charcoal/70 py-1 pl-2">Visitor Visa 600</Link>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-visa-gold uppercase tracking-wider mb-1">Additional Services</p>
                      <Link to="/services/skills-assessments" className="block text-visa-charcoal/70 py-1 pl-2">Skills Assessments</Link>
                      <Link to="/services/citizenship" className="block text-visa-charcoal/70 py-1 pl-2">Citizenship Applications</Link>
                      <Link to="/services/visa-refusals" className="block text-visa-charcoal/70 py-1 pl-2">ART Appeals & Refusals</Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Our Team Dropdown */}
              <div>
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'mobile-team' ? null : 'mobile-team')}
                  className="flex items-center justify-between w-full text-visa-charcoal hover:text-visa-navy font-medium py-2"
                >
                  Our Team
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'mobile-team' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'mobile-team' && (
                  <div className="pl-4 space-y-2 mt-2">
                    <Link to="/our-team" className="block text-visa-charcoal/70 py-1">Our Team</Link>
                    <Link to="/pricing" className="block text-visa-charcoal/70 py-1">Pricing & Fees</Link>
                    <Link to="/blog" className="block text-visa-charcoal/70 py-1">Blog</Link>
                    <Link to="/donations" className="block text-visa-charcoal/70 py-1">Support Us</Link>
                  </div>
                )}
              </div>

              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-visa-charcoal hover:text-visa-navy font-medium py-2 transition-colors"
                  role="menuitem"
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/contact" className="btn-primary text-center mt-2" role="menuitem">
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
