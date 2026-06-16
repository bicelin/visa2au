import { Link } from 'react-router-dom';
import { Heart, Plane, Briefcase, Users, FileCheck, Award, ArrowRight, Shield, Baby, GraduationCap, Home } from 'lucide-react';
import Layout from '../components/Layout';

const Visas = () => {
  const visaCategories = [
    {
      icon: Heart,
      title: 'Partner Visas',
      description: 'Unite with your loved one in Australia through our comprehensive partner visa services.',
      visas: [
        { name: 'Partner Visa 820/801', desc: 'Onshore partner migration pathway', link: '/visas/partner-visa-820' },
        { name: 'Partner Visa 309/100', desc: 'Offshore partner migration pathway', link: '/visas/partner-visa-309' },
        { name: 'Prospective Marriage 300', desc: 'Fiance visa for those planning marriage', link: '/visas/prospective-marriage-300' },
      ],
      highlight: true,
    },
    {
      icon: Plane,
      title: 'Visitor Visas',
      description: 'Explore Australia for leisure or business with our visitor visa expertise.',
      visas: [
        { name: 'Visitor Visa 600', desc: 'Tourist and business visitor streams', link: '/visas/visitor-visa-600' },
      ],
      highlight: false,
    },
    {
      icon: Briefcase,
      title: 'Employer Sponsored',
      description: 'Secure skilled workers for your business through employer sponsorship.',
      visas: [
        { name: 'Skills in Demand 482', desc: 'Temporary Skill Shortage visa', link: '/visas/skills-in-demand-482' },
        { name: 'Employer Nomination 186', desc: 'Employer Nomination Scheme', link: '/visas/employer-nomination-186' },
      ],
      highlight: false,
    },
    {
      icon: Users,
      title: 'Parent Visas',
      description: 'Bring your parents to Australia to reunite your family.',
      visas: [
        { name: 'Parent Visa 103', desc: 'Contributory and standard parent pathways', link: '/visas/parent-visa-103' },
      ],
      highlight: false,
    },
    {
      icon: GraduationCap,
      title: 'Skilled Migration',
      description: 'Assessment services for skilled migration to Australia.',
      visas: [
        { name: 'Skills Assessment', desc: 'Qualification and experience recognition', link: '/services/skills-assessments' },
      ],
      highlight: false,
    },
    {
      icon: Award,
      title: 'Citizenship',
      description: 'Become an Australian citizen through conferral or descent.',
      visas: [
        { name: 'Australian Citizenship', desc: 'By conferral or descent', link: '/services/citizenship' },
      ],
      highlight: false,
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
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Australian Visa Services
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Comprehensive immigration services covering all major visa categories. From partner and visitor visas to employer sponsorship and skilled migration, we guide you through every step.
            </p>
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              Get Free Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Visa Categories Grid */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-visa-navy mb-4">
              Explore Visa Options
            </h2>
            <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
              Find the right visa pathway for your situation. Click on any category to learn more about specific visa options.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visaCategories.map((category, index) => (
              <div
                key={index}
                className={`rounded-2xl p-6 transition-all duration-300 ${
                  category.highlight
                    ? 'bg-visa-navy text-white shadow-2xl'
                    : 'bg-gray-50 border border-gray-100 hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                  category.highlight ? 'bg-visa-gold/20' : 'bg-visa-teal/10'
                }`}>
                  <category.icon className={`w-7 h-7 ${category.highlight ? 'text-visa-gold' : 'text-visa-teal'}`} />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${category.highlight ? 'text-white' : 'text-visa-navy'}`}>
                  {category.title}
                </h3>
                <p className={`text-sm mb-6 ${category.highlight ? 'text-white/70' : 'text-visa-charcoal/60'}`}>
                  {category.description}
                </p>
                <ul className="space-y-3">
                  {category.visas.map((visa, vIndex) => (
                    <li key={vIndex}>
                      <Link
                        to={visa.link}
                        className={`flex items-center gap-2 text-sm font-medium group ${
                          category.highlight
                            ? 'text-white/90 hover:text-visa-gold'
                            : 'text-visa-navy hover:text-visa-teal'
                        }`}
                      >
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        <span className="font-semibold">{visa.name}</span>
                        <span className={`${category.highlight ? 'text-white/50' : 'text-visa-charcoal/50'}`}>- {visa.desc}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Links */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-visa-navy mb-4">
              Additional Services
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link
              to="/services/skills-assessments"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-center"
            >
              <FileCheck className="w-12 h-12 text-visa-teal mx-auto mb-4" />
              <h3 className="text-lg font-bold text-visa-navy mb-2">Skills Assessments</h3>
              <p className="text-sm text-visa-charcoal/60">Professional skills evaluation for migration</p>
            </Link>
            <Link
              to="/services/visa-refusals"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-center"
            >
              <Shield className="w-12 h-12 text-visa-gold mx-auto mb-4" />
              <h3 className="text-lg font-bold text-visa-navy mb-2">ART & Refusals</h3>
              <p className="text-sm text-visa-charcoal/60">Appeal and refusal assistance</p>
            </Link>
            <Link
              to="/employers"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-center"
            >
              <Briefcase className="w-12 h-12 text-visa-navy mx-auto mb-4" />
              <h3 className="text-lg font-bold text-visa-navy mb-2">Employer Services</h3>
              <p className="text-sm text-visa-charcoal/60">Sponsorship and nomination support</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-visa-navy">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Not Sure Which Visa Is Right For You?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Get a free initial assessment from our experienced migration agents. We'll help you identify the best pathway based on your circumstances.
          </p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
            Book Free Consultation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Visas;