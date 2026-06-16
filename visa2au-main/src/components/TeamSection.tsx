import { useEffect, useRef, useState } from 'react';
import { User, Award, Phone, Mail } from 'lucide-react';

const TeamSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const team = [
    {
      name: 'Natasha Arens',
      marn: '0534230',
      title: 'Senior Registered Migration Agent',
      experience: '20+ years experience',
      expertise: [
        'Corporate migration',
        'Hospitality & agriculture',
        'Mining & resources',
        'Arts and sports migration',
      ],
      email: 'natasha@visa2.au',
    },
    {
      name: 'Sergey Vinnichenko',
      marn: '2418663',
      title: 'Migration Agent',
      qualification: 'Migration Law and Practice (UTS, 2024)',
      expertise: [
        'Technology sector',
        'Business development',
        'Skilled nominations',
        'Employer sponsorship',
      ],
      email: 'sergey@visa2.au',
    },
  ];

  return (
    <section id="team" ref={sectionRef} className="section-padding bg-gray-50" aria-labelledby="team-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 id="team-heading" className="text-3xl lg:text-4xl font-bold text-visa-navy mb-4">
            Meet Our Migration Agents
          </h2>
          <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
            MARN registered migration agents with decades of combined experience in Australian immigration law.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 shadow-lg card-hover transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="w-32 h-32 bg-visa-navy/10 rounded-full flex items-center justify-center mb-6">
                  <User className="w-16 h-16 text-visa-navy/40" />
                </div>

                {/* Name & Title */}
                <h3 className="text-2xl font-bold text-visa-navy mb-1">{member.name}</h3>
                <p className="text-visa-teal font-medium mb-2">{member.title}</p>

                {/* MARN Badge */}
                <div className="inline-flex items-center gap-2 bg-visa-gold/10 text-visa-gold px-4 py-1 rounded-full mb-4">
                  <Award className="w-4 h-4" />
                  <span className="font-semibold">MARN {member.marn}</span>
                </div>

                {/* Experience/Qualification */}
                <p className="text-visa-charcoal/60 text-sm mb-4">
                  {member.experience || member.qualification}
                </p>

                {/* Expertise */}
                <div className="w-full border-t border-gray-100 pt-6 mb-6">
                  <p className="text-sm font-semibold text-visa-charcoal mb-3">Areas of Expertise:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {member.expertise.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-visa-charcoal/70 text-xs px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-2 text-visa-teal hover:text-visa-navy transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {member.email}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* MARN Registration Note */}
        <div className="text-center mt-10">
          <p className="text-visa-charcoal/50 text-sm">
            All migration agents are registered with the Office of the Migration Agents Registration Authority (MARA).
            <br />
            MARN numbers can be verified at{' '}
            <a href="https://www.mara.gov.au" target="_blank" rel="noopener noreferrer" className="text-visa-teal hover:underline">
              mara.gov.au
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
