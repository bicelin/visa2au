import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Award, Users, Target, Building2 } from 'lucide-react';
import Layout from '../components/Layout';

const Team = () => {
  const team = [
    {
      name: 'Natasha Arens',
      title: 'Principal Migration Agent',
      marn: '0534230',
      bio: 'Natasha has over 15 years of experience in Australian migration law. She specializes in partner visas, employer sponsorship, and complex case management. Based in Sydney with regular consultations in Brisbane and Cairns.',
      expertise: ['Partner Visas', 'Employer Sponsorship', 'Complex Cases', 'ART Appeals'],
      locations: ['Sydney', 'Brisbane', 'Cairns'],
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    },
    {
      name: 'Sergey Vinnichenko',
      title: 'Senior Migration Agent',
      marn: '2418663',
      bio: 'Sergey brings 10+ years of migration experience with expertise in skilled migration, visitor visas, and citizenship applications. Available for consultations in Melbourne and Sydney.',
      expertise: ['Skilled Migration', 'Visitor Visas', 'Citizenship', 'Skills Assessments'],
      locations: ['Melbourne', 'Sydney'],
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    },
  ];

  const cities = [
    {
      name: 'Sydney',
      description: 'Head office and primary consultation location',
      services: 'Full range of visa services',
    },
    {
      name: 'Melbourne',
      description: 'Victoria hub for skilled migrations',
      services: 'Skilled assessments & nominations',
    },
    {
      name: 'Brisbane',
      description: 'Queensland partner and family visas',
      services: 'Partner visas & parent applications',
    },
    {
      name: 'Cairns',
      description: 'Regional Queensland consultations',
      services: 'Regional sponsorship options',
    },
  ];

  const expertiseAreas = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Partner & Family Visas',
      description: '820/801, 309/100, 300 Prospective Marriage, and Parent visas for family reunification.',
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Skilled Migration',
      description: 'Skills in Demand (482), Employer Nomination (186), and points-tested visas.',
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: 'Employer Services',
      description: 'Business sponsorship, labour market testing, and standard business sponsorship.',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-visa-navy py-24 lg:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-visa-navy via-visa-navyDark to-visa-navy"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Our Team
            </h1>
            <p className="text-xl text-white/80 mb-6">
              Meet our experienced team of registered migration agents committed to helping you achieve your Australian immigration goals.
            </p>
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              Contact Our Team
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg">
                <div className="aspect-square bg-gray-200 relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-visa-gold" />
                    <span className="text-sm text-visa-charcoal/60">MARN: {member.marn}</span>
                  </div>
                  <h3 className="text-xl font-bold text-visa-navy mb-1">{member.name}</h3>
                  <p className="text-visa-gold font-medium mb-4">{member.title}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-visa-teal" />
                    <div className="flex flex-wrap gap-2">
                      {member.locations.map((loc, i) => (
                        <span key={i} className="text-xs bg-visa-teal/10 text-visa-teal px-2 py-1 rounded-full">{loc}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-visa-charcoal/70 text-sm mb-4">{member.bio}</p>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs font-semibold text-visa-charcoal/60 uppercase tracking-wider mb-2">Areas of Expertise</p>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((exp, i) => (
                        <span key={i} className="text-xs bg-visa-navy/5 text-visa-navy px-2 py-1 rounded">{exp}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities of Operation */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Nationwide Coverage</h2>
            <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
              We serve clients across Australia with consultations available in multiple cities. Remote services available nationwide.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {cities.map((city, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-visa-navy/5 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-visa-navy" />
                </div>
                <h3 className="text-lg font-bold text-visa-navy mb-2">{city.name}</h3>
                <p className="text-sm text-visa-charcoal/70 mb-2">{city.description}</p>
                <p className="text-xs text-visa-gold font-medium">{city.services}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas of Expertise */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Our Expertise</h2>
            <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
              Comprehensive immigration services backed by years of experience and in-depth knowledge of Australian migration law.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {expertiseAreas.map((area, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-visa-navy/5 transition-colors">
                <div className="w-14 h-14 bg-visa-gold/10 rounded-xl flex items-center justify-center mb-4 text-visa-gold">
                  {area.icon}
                </div>
                <h3 className="text-lg font-bold text-visa-navy mb-3">{area.title}</h3>
                <p className="text-visa-charcoal/70 text-sm">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Info */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Registered Migration Agents</h2>
            <p className="text-visa-charcoal/70 mb-6">
              All Visa2AU migration agents are registered with the Migration Agents Registration Authority (MARA). This registration ensures we adhere to the highest professional and ethical standards in immigration services.
            </p>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-visa-charcoal/70 text-sm">
                <strong>MARA Registration ensures:</strong>
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                {[
                  'Professional indemnity insurance',
                  'Code of conduct compliance',
                  'Ongoing professional development',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-visa-teal" />
                    <span className="text-visa-charcoal text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-visa-navy">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Work With Us?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Contact our team today to discuss your immigration needs.
          </p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
            Get in Touch
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Team;