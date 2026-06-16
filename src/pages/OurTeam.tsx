import Layout from '../components/Layout';
import { Award, Mail, Scale, Headphones, UserCheck, Globe, Heart, Shield, Handshake, Leaf, Sparkles } from 'lucide-react';

const OurTeam = () => {
  const team = [
    {
      name: 'Natasha Arens',
      marn: '0534230',
      title: 'Senior Registered Migration Agent',
      experience: '20+ years experience in Australian immigration',
      expertise: ['Corporate migration', 'Hospitality & agriculture', 'Mining & resources', 'Arts and sports migration'],
      email: 'natasha@visa2.au',
      photo: '/imgs/natasha.jpg',
      certifications: [
        { label: 'MARN 0534230', icon: Award },
        { label: 'NAATI CPN0VW21W', icon: Globe },
      ],
      naatiDetail: 'Certified NAATI Translator (Russian-English)',
    },
    {
      name: 'Sergey Vinnichenko',
      marn: '2418663',
      title: 'Migration Agent',
      qualification: 'Migration Law and Practice (UTS, 2024)',
      expertise: ['Technology sector', 'Business development', 'Skilled nominations', 'Employer sponsorship'],
      email: 'sergey@visa2.au',
      photo: '/imgs/sergey.jpg',
      certifications: [
        { label: 'MARN 2418663', icon: Award },
      ],
    },
    {
      name: 'Denis Kosachev',
      title: 'Legal Advocate',
      qualification: 'Licensed Legal Practitioner',
      expertise: ['Legal advocacy', 'Visa applications', 'Administrative law', 'ART representation'],
      email: 'denis@visa2.au',
      photo: '',
      certifications: [
        { label: 'Licensed Advocate', icon: Scale },
      ],
    },
    {
      name: 'Franz',
      title: 'Client Support',
      qualification: 'Administration & Client Relations',
      expertise: ['Client onboarding', 'Document management', 'Case coordination', 'General enquiries'],
      email: 'support@visa2.au',
      photo: '',
      certifications: [
        { label: 'Support Team', icon: Headphones },
      ],
    },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Integrity & Transparency',
      desc: 'We provide honest, evidence-based advice. We will never promise outcomes we cannot deliver, and we ensure every client understands the realistic prospects of their case before proceeding.',
    },
    {
      icon: Heart,
      title: 'Social Responsibility',
      desc: 'We believe in giving back to our community. In select cases, we undertake pro bono work to support individuals and families in genuine need, including victims of domestic violence and those facing humanitarian crises.',
    },
    {
      icon: Handshake,
      title: 'Client Dedication',
      desc: 'Every case receives our full attention and care. We understand that immigration decisions shape lives, families, and futures. We treat your case with the seriousness and compassion it deserves.',
    },
    {
      icon: Leaf,
      title: 'Continuous Learning',
      desc: 'Australian immigration law changes frequently. Our agents maintain continuous professional development to ensure our advice reflects the latest legislation, policy, and case law.',
    },
    {
      icon: Sparkles,
      title: 'Excellence in Service',
      desc: 'We strive for excellence in every aspect of our work — from document preparation to communication with the Department of Home Affairs. Our goal is to give every application the best possible chance of success.',
    },
    {
      icon: Globe,
      title: 'Multicultural Understanding',
      desc: 'Our team speaks English and Russian, and we work with clients from diverse cultural backgrounds. We understand the unique challenges faced by migrants and provide culturally sensitive service.',
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 t-bg-body overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-visa-gold/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
              <UserCheck className="w-4 h-4 text-visa-gold" />
              <span className="t-text-primary text-sm font-medium">Our Team</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">
              Meet Our <span className="text-gradient-gold">Team</span>
            </h1>
            <p className="t-text-muted text-lg leading-relaxed">
              MARN registered migration agents and legal professionals with decades of combined experience in Australian immigration law. We speak English and Russian.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="section-padding t-bg-body relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="glass-card overflow-hidden hover:border-visa-gold/30 transition-all">
                {member.photo ? (
                  <div className="relative aspect-square overflow-hidden">
                    <img src={member.photo} alt={`${member.name} - ${member.title} at Visa2AU`} className="w-full h-full object-cover object-top" width="400" height="400" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-visa-navy via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-visa-navyLight to-visa-navy flex items-center justify-center relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-visa-gold/20 to-visa-teal/20 border-2 border-visa-gold/30 flex items-center justify-center">
                      {member.name === 'Denis Kosachev' ? <Scale className="w-10 h-10 t-text-faint" /> : <Headphones className="w-10 h-10 t-text-faint" />}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-visa-navy via-transparent to-transparent" />
                  </div>
                )}

                <div className="p-5 -mt-8 relative">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {member.certifications.map((cert, i) => (
                      <div key={i} className="inline-flex items-center gap-1.5 glass-card px-3 py-1 border-visa-gold/30">
                        <cert.icon className="w-3 h-3 text-visa-gold" />
                        <span className="text-visa-gold font-semibold text-xs">{cert.label}</span>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-lg font-bold t-text-primary mb-0.5">{member.name}</h3>
                  <p className="text-visa-teal text-sm font-medium mb-2">{member.title}</p>
                  <p className="t-text-faint text-xs mb-4">{member.experience || member.qualification}</p>

                  {'naatiDetail' in member && member.naatiDetail && (
                    <p className="text-visa-gold/70 text-xs mb-3 font-medium">{member.naatiDetail}</p>
                  )}

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {member.expertise.map((skill, i) => (
                      <span key={i} className="t-bg-input t-text-faint text-xs px-2.5 py-1 rounded-full border t-border">{skill}</span>
                    ))}
                  </div>

                  <a href={`mailto:${member.email}`} className="inline-flex items-center gap-2 text-visa-teal hover:text-visa-gold transition-colors text-sm">
                    <Mail className="w-4 h-4" />{member.email}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* MARA Notice */}
          <div className="text-center mt-12 glass-card p-6 max-w-2xl mx-auto">
            <p className="t-text-faint text-sm">
              All migration agents are registered with the Office of the Migration Agents Registration Authority (MARA).
              MARN numbers can be verified at{' '}
              <a href="https://www.mara.gov.au" target="_blank" rel="noopener noreferrer" className="text-visa-teal hover:text-visa-gold transition-colors">mara.gov.au</a>
            </p>
            <p className="t-text-ghost text-xs mt-3">
              Natasha Arens is also a certified NAATI translator (License: CPN0VW21W) for Russian-English translations.
            </p>
          </div>
        </div>
      </section>

      {/* Values & Social Responsibility */}
      <section className="section-padding t-bg-body border-t t-border relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
                <Heart className="w-4 h-4 text-visa-gold" />
                <span className="t-text-primary text-sm font-medium">Our Values</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold t-text-primary mb-4">
                Values & <span className="text-gradient-gold">Social Responsibility</span>
              </h2>
              <p className="t-text-muted max-w-2xl mx-auto">
                At Visa2AU, we are driven by more than business success. We are committed to making a positive impact on the lives of our clients and our community.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {values.map((v, i) => (
                <div key={i} className="glass-card p-6">
                  <div className="w-12 h-12 rounded-xl bg-visa-gold/10 border border-visa-gold/20 flex items-center justify-center mb-4">
                    <v.icon className="w-6 h-6 text-visa-gold" />
                  </div>
                  <h3 className="t-text-primary font-semibold mb-2">{v.title}</h3>
                  <p className="t-text-faint text-sm">{v.desc}</p>
                </div>
              ))}
            </div>

            {/* Pro Bono Section */}
            <div className="mt-12 glass-panel p-8 border-visa-teal/20 max-w-3xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-visa-teal/10 border border-visa-teal/20 flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6 text-visa-teal" />
                </div>
                <div>
                  <h3 className="text-xl font-bold t-text-primary mb-2">Pro Bono Work</h3>
                  <p className="t-text-muted text-sm mb-4">
                    We recognise that not everyone has the means to access professional migration assistance. In select cases, we undertake pro bono work to support individuals and families in our community who are in genuine need.
                  </p>
                  <p className="t-text-muted text-sm mb-4">
                    This includes support for victims of domestic violence seeking protection visas, individuals facing humanitarian crises, and members of vulnerable communities who cannot afford professional fees.
                  </p>
                  <p className="t-text-faint text-sm">
                    If you believe your circumstances may qualify for pro bono assistance, please contact us at{' '}
                    <a href="mailto:info@visa2.au" className="text-visa-gold hover:text-visa-goldLight">info@visa2.au</a>
                    {' '}with details of your situation. All pro bono enquiries are treated with the same confidentiality and care as our fee-paying clients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OurTeam;
