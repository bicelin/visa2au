import { Link } from 'react-router-dom';
import { Check, ArrowRight, Briefcase, Users, FileCheck, Shield, Building, DollarSign, Clock } from 'lucide-react';
import Layout from '../components/Layout';

const Employers = () => {
  const services = [
    {
      icon: Briefcase,
      title: '482 TSS Visa',
      description: 'Temporary Skill Shortage visa for bringing skilled workers to Australia',
      link: '/visas/skills-in-demand-482',
      price: 'From A$3,300',
    },
    {
      icon: Users,
      title: '186 ENS Visa',
      description: 'Employer Nomination Scheme for permanent skilled worker visas',
      link: '/visas/employer-nomination-186',
      price: 'From A$3,300',
    },
  ];

  const benefits = [
    'Fill skilled labor shortages in your business',
    'Access global talent pool',
    'Retain skilled workers long-term',
    'Pathway to permanent residency for workers',
    'Compliance support and advice',
    'Streamlined application process',
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
              Employer Sponsorship Services
            </h1>
            <p className="text-xl text-white/80 mb-6">
              Access skilled workers from overseas to fill positions that cannot be filled by Australian workers. We guide employers through every step of the sponsorship process.
            </p>
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              Get Free Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Our Employer Services</h2>
            <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
              We provide comprehensive support for Australian businesses looking to sponsor skilled workers from overseas.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {services.map((service, index) => (
              <Link
                key={index}
                to={service.link}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="w-14 h-14 bg-visa-teal/10 rounded-xl flex items-center justify-center mb-4">
                  <service.icon className="w-7 h-7 text-visa-teal" />
                </div>
                <h3 className="text-xl font-bold text-visa-navy mb-2">{service.title}</h3>
                <p className="text-visa-charcoal/60 mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-visa-gold font-semibold">{service.price}</span>
                  <span className="text-visa-navy font-medium flex items-center gap-1">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-visa-navy mb-6">Benefits of Employer Sponsorship</h2>
              <p className="text-visa-charcoal/70 mb-6">
                Employer sponsorship allows businesses to access a global talent pool and fill skilled positions that cannot be filled locally. It provides a pathway to permanent residency for skilled workers, helping businesses retain valuable employees long-term.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-visa-teal flex-shrink-0" />
                    <span className="text-visa-charcoal">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-visa-navy rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6">Our Process</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-visa-gold text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                  <div>
                    <p className="font-semibold">Eligibility Check</p>
                    <p className="text-white/60 text-sm">We assess your business and position requirements</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-visa-gold text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                  <div>
                    <p className="font-semibold">Sponsorship Approval</p>
                    <p className="text-white/60 text-sm">We assist with becoming an approved sponsor</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-visa-gold text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                  <div>
                    <p className="font-semibold">Nomination</p>
                    <p className="text-white/60 text-sm">We prepare and lodge the position nomination</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-visa-gold text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
                  <div>
                    <p className="font-semibold">Visa Application</p>
                    <p className="text-white/60 text-sm">We guide the worker through their visa application</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-visa-navy">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Skilled Workers for Your Business?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Contact us to discuss your sponsorship needs. We provide free initial consultations for employers.
          </p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
            Contact Us Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Employers;