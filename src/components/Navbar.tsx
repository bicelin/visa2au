import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, ChevronDown, Globe, Check } from 'lucide-react';
import Search from './Search';

const languages = [
  { code: 'en', name: 'EN', label: 'English' },
  { code: 'ru', name: 'RU', label: 'Русский' },
  { code: 'fr', name: 'FR', label: 'Français' },
];

const visaServicesMenuItems = [
  {
    section: 'Partner & Family',
    items: [
      { href: '/visas/partner-visa-820', label: 'Partner Visa 820/801' },
      { href: '/visas/partner-visa-309', label: 'Partner Visa 309/100' },
      { href: '/visas/prospective-marriage-300', label: 'Prospective Marriage 300' },
      { href: '/visas/parent-visa-103', label: 'Parent Visa 103' },
    ]
  },
  {
    section: 'Work & Employer',
    items: [
      { href: '/visas/skills-in-demand-482', label: 'Skills in Demand 482 (SID)' },
      { href: '/visas/skilled-regional-494', label: 'Skilled Employer Regional 494' },
      { href: '/visas/skilled-independent-189', label: 'Skilled Independent 189/190' },
      { href: '/visas/employer-nomination-186', label: 'Employer Nomination 186' },
      { href: '/visas/work-holiday-417', label: 'Work & Holiday 417 & 462' },
      { href: '/employers', label: 'Employer Hub & DAMA' },
    ]
  },
  {
    section: 'Visitor, Stay & Protection',
    items: [
      { href: '/visas/visitor-visa-600', label: 'Visitor Visa 600' },
      { href: '/visas/short-stay-400', label: 'Short Stay 400 & 408' },
      { href: '/services/protection-visa-866', label: 'Protection Visa 866' },
    ]
  },
  {
    section: 'Study & Training',
    items: [
      { href: '/visas/student-visa-500', label: 'Student Visa 500' },
      { href: '/visas/training-visa-407', label: 'Training Visa 407' },
    ]
  },
  {
    section: 'Assessments & Appeals',
    items: [
      { href: '/services/skills-assessments', label: 'Skills Assessments' },
      { href: '/services/citizenship', label: 'Citizenship Applications' },
      { href: '/services/visa-refusals', label: 'ART Appeals & Refusals' },
      { href: '/services/bridging-visas', label: 'Bridging Visas A/B/C/E' },
    ]
  },
];

const teamMenuItems = [
  { href: '/our-team', label: 'Our Team' },
  { href: '/pricing', label: 'Pricing & Fees' },
  { href: '/blog', label: 'Blog' },
  { href: '/donations', label: 'Support Us' },
  { href: '/terms', label: 'Privacy Policy' },
];

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close everything on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setActiveDropdown(null);
    setIsLangOpen(false);
  }, [location.pathname]);

  // Close language dropdown when other dropdowns open
  useEffect(() => {
    if (activeDropdown !== null) {
      setIsLangOpen(false);
    }
  }, [activeDropdown]);

  // Click outside to close language dropdown
  useEffect(() => {
    if (!isLangOpen) return;
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [isLangOpen]);

  // Escape key closes everything
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false);
        setActiveDropdown(null);
        setIsLangOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const toggleDropdown = useCallback((name: string) => {
    setIsLangOpen(false); // close lang when opening other dropdowns
    setActiveDropdown(prev => prev === name ? null : name);
  }, []);

  const closeAll = useCallback(() => {
    setIsMobileOpen(false);
    setActiveDropdown(null);
    setIsLangOpen(false);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 shadow-lg glass-navbar"
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Top bar - always visible */}
      <div
        className="hidden lg:block"
        style={{ backgroundColor: 'var(--bg-navbar)', backdropFilter: 'blur(10px)' }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center py-2 text-sm">
          <div className="flex items-center gap-6" style={{ color: 'var(--text-faint)' }}>
            <a href="tel:+61291362462" className="flex items-center gap-2 transition-colors"
              style={{ color: 'var(--text-faint)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
              aria-label="Call us">
              <Phone className="w-4 h-4" aria-hidden="true" />
              <span>+61 2 9136 2462</span>
              <span className="text-xs" style={{ color: 'var(--text-ghost)' }}>(voicemail)</span>
            </a>
            <a href="mailto:info@visa2.au" className="flex items-center gap-2 transition-colors"
              style={{ color: 'var(--text-faint)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
              aria-label="Email us">
              <Mail className="w-4 h-4" aria-hidden="true" />
              <span>info@visa2.au</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs" style={{ color: 'var(--text-ghost)' }}>Level 17, 1 Denison Street, North Sydney NSW 2060</span>
            <div className="relative" ref={langRef}>
              <button
                onClick={() => {
                  setIsLangOpen(p => !p);
                  setActiveDropdown(null);
                }}
                className="flex items-center gap-1.5 transition-colors py-1 px-2 rounded-md"
                style={{ color: 'var(--text-faint)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
                aria-expanded={isLangOpen}
                aria-haspopup="listbox"
                aria-label="Select language"
              >
                <Globe className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-medium">EN</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {isLangOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-44 py-2 z-[70] rounded-xl overflow-hidden"
                  style={{
                    backgroundColor: 'var(--bg-navbar)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                  }}
                >
                  {languages.map(lang => {
                    const isActive = lang.code === 'en';
                    return (
                      <button
                        key={lang.code}
                        className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors"
                        style={{
                          color: isActive ? 'var(--gold)' : 'var(--text-secondary)',
                          backgroundColor: isActive ? 'rgba(251,191,36,0.08)' : 'transparent',
                        }}
                        onMouseEnter={e => {
                          if (!isActive) {
                            (e.currentTarget.style.backgroundColor = 'var(--bg-input)');
                            (e.currentTarget.style.color = 'var(--text-primary)');
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isActive) {
                            (e.currentTarget.style.backgroundColor = 'transparent');
                            (e.currentTarget.style.color = 'var(--text-secondary)');
                          }
                        }}
                        onClick={() => setIsLangOpen(false)}
                      >
                        <span className="font-semibold w-6">{lang.name}</span>
                        <span style={{ color: isActive ? 'var(--gold)' : 'var(--text-faint)' }}>{lang.label}</span>
                        {isActive && <Check className="w-4 h-4 ml-auto" style={{ color: 'var(--gold)' }} aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div style={{ backgroundColor: 'var(--bg-navbar)', backdropFilter: 'blur(20px)' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-[4.5rem]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="Visa2AU - Back to homepage">
              <img
                src="/imgs/logo.png"
                alt="Visa2AU Smart Immigration"
                className="h-10 lg:h-12 w-auto"
                width="224"
                height="80"
                loading="eager"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Visa Services Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('visas')}
                  className="flex items-center gap-1 font-medium transition-colors py-2"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  aria-expanded={activeDropdown === 'visas'}
                  aria-haspopup="true"
                >
                  Visa Services
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'visas' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'visas' && (
                  <div className="absolute top-full left-0 mt-2 w-[520px] p-5 z-50 glass-panel animate-fade-in"
                    style={{ backgroundColor: 'var(--bg-navbar)' }}>
                    <div className="grid grid-cols-2 gap-4">
                      {visaServicesMenuItems.map((section, i) => (
                        <div key={i}>
                          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--gold)' }}>{section.section}</h3>
                          <div className="space-y-0.5">
                            {section.items.map((item, j) => (
                              <Link
                                key={j}
                                to={item.href}
                                onClick={() => setActiveDropdown(null)}
                                className="block px-3 py-2 text-sm rounded-lg transition-colors"
                                style={{ color: 'var(--text-faint)' }}
                                onMouseEnter={e => {
                                  (e.currentTarget.style.color = 'var(--gold)');
                                  (e.currentTarget.style.backgroundColor = 'var(--bg-input)');
                                }}
                                onMouseLeave={e => {
                                  (e.currentTarget.style.color = 'var(--text-faint)');
                                  (e.currentTarget.style.backgroundColor = 'transparent');
                                }}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Our Team Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('team')}
                  className="flex items-center gap-1 font-medium transition-colors py-2"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  aria-expanded={activeDropdown === 'team'}
                  aria-haspopup="true"
                >
                  Our Team
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'team' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'team' && (
                  <div className="absolute top-full left-0 mt-2 w-56 py-2 z-50 glass-panel animate-fade-in"
                    style={{ backgroundColor: 'var(--bg-navbar)' }}>
                    {teamMenuItems.map((item, i) => (
                      <Link
                        key={i}
                        to={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2 text-sm transition-colors"
                        style={{ color: 'var(--text-faint)' }}
                        onMouseEnter={e => {
                          (e.currentTarget.style.color = 'var(--gold)');
                          (e.currentTarget.style.backgroundColor = 'var(--bg-input)');
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget.style.color = 'var(--text-faint)');
                          (e.currentTarget.style.backgroundColor = 'transparent');
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Link */}
              <Link
                to="/contact"
                className="font-medium transition-colors relative group py-2"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" style={{ backgroundColor: 'var(--gold)' }} />
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden lg:block">
              <Search />
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2 text-sm">
                Book Consultation
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => setIsMobileOpen(p => !p)}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-menu"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Overlay */}
      {isMobileOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden fixed inset-x-0 bottom-0 z-50 overflow-y-auto"
          style={{
            top: '7.5rem',
            backgroundColor: 'var(--bg-navbar)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div className="container mx-auto px-4 py-6 pb-24">
            {/* Mobile: Visa Services */}
            <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => toggleDropdown('mobile-visas')}
                className="flex items-center justify-between w-full font-semibold py-4 text-lg"
                style={{ color: 'var(--text-primary)' }}
                aria-expanded={activeDropdown === 'mobile-visas'}
              >
                Visa Services
                <ChevronDown className={`w-5 h-5 transition-transform ${activeDropdown === 'mobile-visas' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'mobile-visas' && (
                <div className="pb-4 space-y-5">
                  {visaServicesMenuItems.map((section, i) => (
                    <div key={i}>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--gold)' }}>{section.section}</p>
                      <div className="space-y-1">
                        {section.items.map((item, j) => (
                          <Link
                            key={j}
                            to={item.href}
                            onClick={closeAll}
                            className="block py-2 pl-2 transition-colors"
                            style={{ color: 'var(--text-faint)' }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
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

            {/* Mobile: Our Team */}
            <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => toggleDropdown('mobile-team')}
                className="flex items-center justify-between w-full font-semibold py-4 text-lg"
                style={{ color: 'var(--text-primary)' }}
                aria-expanded={activeDropdown === 'mobile-team'}
              >
                Our Team
                <ChevronDown className={`w-5 h-5 transition-transform ${activeDropdown === 'mobile-team' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'mobile-team' && (
                <div className="pb-4 space-y-2">
                  {teamMenuItems.map((item, i) => (
                    <Link
                      key={i}
                      to={item.href}
                      onClick={closeAll}
                      className="block py-2 pl-2 transition-colors"
                      style={{ color: 'var(--text-faint)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile: Contact */}
            <Link
              to="/contact"
              onClick={closeAll}
              className="block font-semibold py-4 text-lg"
              style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}
            >
              Contact
            </Link>

            {/* Mobile CTA */}
            <div className="mt-8 text-center">
              <Link to="/contact" onClick={closeAll} className="btn-primary w-full inline-block text-center">
                Book Consultation
              </Link>
              <p className="text-sm mt-4" style={{ color: 'var(--text-faint)' }}>
                $330 AUD per 1 hour<br /><span style={{ color: 'var(--text-ghost)' }}>(pro rata fees may apply)</span>
              </p>
            </div>

            {/* Mobile Contact Info */}
            <div className="mt-8 flex flex-col items-center gap-3 text-sm" style={{ color: 'var(--text-faint)' }}>
              <a href="tel:+61291362462" className="flex items-center gap-2 transition-colors hover:text-[var(--gold)]">
                <Phone className="w-4 h-4" /> +61 2 9136 2462
              </a>
              <a href="mailto:info@visa2.au" className="flex items-center gap-2 transition-colors hover:text-[var(--gold)]">
                <Mail className="w-4 h-4" /> info@visa2.au
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
