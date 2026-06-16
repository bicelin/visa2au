import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Shield, Users, Award, Clock, Star } from 'lucide-react';

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);

  // Subtle parallax for floating orbs on mouse move
  useEffect(() => {
    const section = sectionRef.current;
    const orbs = orbsRef.current;
    if (!section || !orbs) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      orbs.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    };

    section.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => section.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const highlights = [
    { icon: Shield, label: 'MARN Registered', sub: 'Licensed Agents' },
    { icon: Users, label: '2,000+', sub: 'Cases Handled' },
    { icon: Award, label: '99.8%', sub: 'Success Rate' },
    { icon: Clock, label: '20+ Years', sub: 'Experience' },
  ];

  const visaPills = [
    'Partner Visas 820/801',
    'Skills in Demand 482',
    'Student Visa 500',
    'Visitor Visa 600',
    'Skilled Migration 189/190',
    'Employer Sponsorship',
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/imgs/hero-outback.jpg"
          alt="Australian landscape at golden hour with warm sandstone colours"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 30%' }}
          width="1920"
          height="1080"
          // @ts-ignore
          fetchPriority="high"
          decoding="async"
        />
        {/* Theme-aware gradient overlay */}
        <div className="absolute inset-0 hero-gradient" />
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 'var(--dot-opacity)',
            backgroundImage: `radial-gradient(circle, var(--dot-color) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Floating decorative orbs (parallax) */}
      <div ref={orbsRef} className="absolute inset-0 z-[1] pointer-events-none transition-transform duration-700 ease-out">
        <div className="absolute top-[15%] left-[10%] w-64 h-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-[20%] right-[15%] w-48 h-48 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, var(--teal) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="absolute top-[50%] left-[50%] w-32 h-32 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-28 pb-20 lg:pt-32 lg:pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-center">

            {/* Left Content — takes 3 columns on large screens */}
            <div className="lg:col-span-3 text-center lg:text-left">
              {/* MARN Badge */}
              <div
                className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6 animate-fade-in"
                role="banner"
              >
                <CheckCircle className="w-4 h-4" style={{ color: 'var(--gold)' }} aria-hidden="true" />
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  MARN Registered Migration Agents — Since 2004
                </span>
              </div>

              {/* SEO-Optimised 2026 Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold mb-6 leading-[1.08] tracking-tight animate-fade-in delay-100"
                style={{ color: 'var(--text-primary)' }}>
                Australian Visa &<br />
                Migration Agents<br />
                <span className="text-gradient-gold">2025–2026</span>
              </h1>

              {/* SEO-rich subheadline */}
              <p className="text-base sm:text-lg mb-8 max-w-xl leading-relaxed animate-fade-in delay-200"
                style={{ color: 'var(--text-muted)' }}>
                Expert immigration help for partner visas, employer sponsorship, skilled migration & student visas. 
                MARN-accredited agents serving Sydney, Melbourne, Brisbane & worldwide. Book your consultation online.
              </p>

              {/* Visa pills — quick visual scan */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8 animate-fade-in delay-300">
                {visaPills.map((pill, i) => (
                  <span
                    key={i}
                    className="glass-card px-3 py-1 text-xs font-medium"
                    style={{ color: 'var(--text-faint)' }}
                  >
                    {pill}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in delay-400">
                <Link
                  to="/contact"
                  className="btn-primary text-base px-8 py-4 inline-flex items-center justify-center gap-2 group"
                >
                  Book a Consultation
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
                <a
                  href="https://visa2au.mmportal.cloud/assessment/enquiry/general-enquiry#nav-top"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-base px-8 py-4 inline-flex items-center justify-center gap-2"
                >
                  <Star className="w-4 h-4" aria-hidden="true" />
                  Free Visa Assessment
                </a>
              </div>

              {/* Pricing note */}
              <p className="text-sm mt-4 animate-fade-in delay-400" style={{ color: 'var(--text-ghost)' }}>
                Consultation: $330 AUD per 1 hour (pro rata fees may apply)
              </p>

              {/* Highlight stats row */}
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in delay-500">
                {highlights.map((item, i) => (
                  <div key={i} className="glass-card px-3 py-3 text-center">
                    <item.icon className="w-5 h-5 mx-auto mb-1" style={{ color: 'var(--gold)' }} aria-hidden="true" />
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                    <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content — Glass Panel — takes 2 columns */}
            <div className="hidden lg:block lg:col-span-2 animate-fade-in delay-500">
              <div className="glass-panel p-7 relative">
                {/* Decorative glow orbs inside panel */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)', filter: 'blur(40px)' }} aria-hidden="true" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-15 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, var(--teal) 0%, transparent 70%)', filter: 'blur(40px)' }} aria-hidden="true" />

                <h2 className="text-xl font-bold mb-4 relative" style={{ color: 'var(--text-primary)' }}>
                  Why Choose Visa2AU?
                </h2>
                <ul className="space-y-3 relative">
                  {[
                    'MARN Registered Migration Agents',
                    'Personalised Case Management',
                    'Transparent Fixed-Fee Pricing',
                    '99.8% Visa Success Rate',
                    'Multilingual: English & Russian',
                    'NAATI-Certified Translations',
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: 'rgba(251, 191, 36, 0.15)' }}>
                        <CheckCircle className="w-4 h-4" style={{ color: 'var(--gold)' }} aria-hidden="true" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 pt-5 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-faint)' }}>
                    Not sure which visa fits your situation?
                  </p>
                  <a
                    href="https://visa2au.mmportal.cloud/assessment/enquiry/general-enquiry#nav-top"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium flex items-center gap-2 group text-sm"
                    style={{ color: 'var(--gold)' }}
                  >
                    Take Our Free Visa Assessment
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </a>
                  <p className="text-xs mt-2" style={{ color: 'var(--text-ghost)' }}>
                    Takes 3 minutes — instant guidance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
