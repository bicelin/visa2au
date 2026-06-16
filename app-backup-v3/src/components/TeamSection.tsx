import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Mail, ArrowRight, Scale, Headphones, UserCheck, Globe } from 'lucide-react';

const team = [
  {
    name: 'Natasha Arens',
    marn: '0534230',
    title: 'Senior Registered Migration Agent',
    experience: '20+ years experience',
    expertise: ['Corporate migration', 'Hospitality & agriculture', 'Mining & resources', 'Arts and sports migration'],
    email: 'natasha@visa2.au',
    photo: '/imgs/natasha.jpg',
    certs: [
      { label: 'MARN 0534230', icon: Award },
      { label: 'NAATI CPN0VW21W', icon: Globe },
    ],
    extra: 'Certified NAATI Translator (Russian-English)',
  },
  {
    name: 'Sergey Vinnichenko',
    marn: '2418663',
    title: 'Migration Agent',
    qualification: 'Migration Law and Practice (UTS, 2024)',
    expertise: ['Technology sector', 'Business development', 'Skilled nominations', 'Employer sponsorship'],
    email: 'sergey@visa2.au',
    photo: '/imgs/sergey.jpg',
    certs: [{ label: 'MARN 2418663', icon: Award }],
  },
  {
    name: 'Denis Kosachev',
    title: 'Legal Advocate (Russia)',
    qualification: 'Licensed Advocate',
    expertise: ['Legal advocacy', 'Visa applications', 'Administrative law', 'Document preparation'],
    email: 'denis@visa2.au',
    photo: '',
    certs: [{ label: 'Licensed Advocate', icon: Scale }],
  },
  {
    name: 'Franz Somera',
    title: 'Office Administrator & Coordinator',
    qualification: 'Administration & Client Relations',
    expertise: ['Client onboarding', 'Document management', 'Case coordination', 'General enquiries'],
    email: 'support@visa2.au',
    photo: '',
    certs: [{ label: 'Support Team', icon: Headphones }],
  },
];

const TeamSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  return (
    <section id="team" ref={ref} className="section-padding t-bg-body relative overflow-hidden" aria-labelledby="team-heading">
      <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden="true" />
      <div className="absolute top-0 left-1/4 w-96 h-96 t-bg-gold-10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 t-bg-teal-10 rounded-full blur-3xl" aria-hidden="true" />
      <img src="/imgs/aboriginal-kangaroo.png" alt="" className="absolute top-20 right-8 w-24 h-24 opacity-10 pointer-events-none" aria-hidden="true" loading="lazy" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4">
            <UserCheck className="w-4 h-4 text-visa-gold" aria-hidden="true" />
            <span className="t-text-secondary text-sm font-medium">MARN Registered</span>
          </div>
          <h2 id="team-heading" className="text-3xl lg:text-4xl font-bold t-text-primary mb-4">
            Meet Our <span className="text-gradient-gold">Team</span>
          </h2>
          <p className="t-text-muted max-w-2xl mx-auto">
            Experienced professionals dedicated to guiding you through every step of your Australian immigration journey.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {team.map((m, i) => (
            <div key={i} className={`glass-card overflow-hidden flex flex-col transition-all duration-700 hover:t-border-gold-20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 150}ms` }}>
              {m.photo ? (
                <div className="relative aspect-square overflow-hidden shrink-0">
                  <img src={m.photo} alt={`${m.name} - ${m.title}`} className="w-full h-full object-cover object-top" width="300" height="300" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-visa-navy via-transparent to-transparent" />
                </div>
              ) : (
                <div className="aspect-square bg-gradient-to-br from-visa-navyLight to-visa-navy flex items-center justify-center relative shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-visa-gold/20 to-visa-teal/20 border-2 t-border-gold-20 flex items-center justify-center">
                    {m.name === 'Denis Kosachev' ? <Scale className="w-10 h-10 t-text-faint" /> : <Headphones className="w-10 h-10 t-text-faint" />}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-visa-navy via-transparent to-transparent" />
                </div>
              )}
              <div className="p-5 -mt-8 relative flex flex-col flex-grow">
                <div className="flex flex-wrap gap-2 mb-3">
                  {m.certs.map((c, j) => (
                    <div key={j} className="inline-flex items-center gap-1.5 glass-card px-3 py-1 t-border-gold-20">
                      <c.icon className="w-3 h-3 text-visa-gold" aria-hidden="true" />
                      <span className="text-visa-gold font-semibold text-xs">{c.label}</span>
                    </div>
                  ))}
                </div>
                <h3 className="text-lg font-bold t-text-primary mb-0.5">{m.name}</h3>
                <p className="text-visa-teal text-sm font-medium mb-2">{m.title}</p>
                <p className="t-text-faint text-xs mb-4">{m.experience || m.qualification}</p>
                {'extra' in m && m.extra && <p className="text-visa-gold/70 text-xs mb-3 font-medium">{m.extra}</p>}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {m.expertise.map((s, j) => <span key={j} className="t-bg-input t-text-faint text-xs px-2.5 py-1 rounded-full border t-border">{s}</span>)}
                </div>
                <div className="mt-auto pt-3 border-t t-border">
                  <a href={`mailto:${m.email}`} className="inline-flex items-center gap-2 text-visa-teal hover:text-visa-gold transition-colors text-sm">
                    <Mail className="w-4 h-4" aria-hidden="true" />{m.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/our-team" className="btn-primary inline-flex items-center gap-2">
            Meet the Full Team <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
