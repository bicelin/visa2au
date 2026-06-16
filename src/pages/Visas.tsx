import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Heart, Plane, Briefcase, Award, FileCheck, ArrowRight, Sparkles, Building2, Shield, Route } from 'lucide-react';

const Visas = () => {
  const visaCategories = [
    {
      title: 'Partner & Family Visas',
      description: 'Reunite with your loved ones in Australia',
      visas: [
        { name: 'Partner Visa 820/801', link: '/visas/partner-visa-820', description: 'For partners of Australian citizens or permanent residents (onshore)' },
        { name: 'Partner Visa 309/100', link: '/visas/partner-visa-309', description: 'For partners applying from outside Australia (offshore)' },
        { name: 'Prospective Marriage 300', link: '/visas/prospective-marriage-300', description: 'For fiances of Australian citizens - travel to Australia to marry' },
        { name: 'Parent Visa 103', link: '/visas/parent-visa-103', description: 'For parents of Australian citizens and permanent residents' },
      ],
      icon: Heart,
      color: 'visa-gold',
    },
    {
      title: 'Work & Employer Sponsorship',
      description: 'Build your career in Australia through employer sponsorship',
      visas: [
        { name: 'Skills in Demand 482 (SID)', link: '/visas/skills-in-demand-482', description: 'Temporary skilled worker visa - Core Skills & Specialist Skills streams' },
        { name: 'Skilled Employer Regional 494', link: '/visas/skilled-regional-494', description: '5-year provisional visa for regional employer sponsorship' },
        { name: 'Employer Nomination 186 (ENS)', link: '/visas/employer-nomination-186', description: 'Permanent employer-sponsored residency' },
        { name: 'Work & Holiday 417/462', link: '/visas/work-holiday-417', description: 'For young adults from eligible countries' },
      ],
      icon: Briefcase,
      color: 'visa-teal',
    },
    {
      title: 'Skilled & Points-Tested Visas',
      description: 'Independent pathways to permanent residency',
      visas: [
        { name: 'Skilled Independent 189', link: '/visas/skilled-independent-189', description: 'Points-tested permanent visa - no sponsor required' },
        { name: 'Skilled Nominated 190', link: '/visas/skilled-independent-189', description: 'State-nominated points-tested permanent visa' },
      ],
      icon: Award,
      color: 'visa-gold',
    },
    {
      title: 'Visitor & Short Stay',
      description: 'Short-term stays and temporary activities in Australia',
      visas: [
        { name: 'Visitor Visa 600', link: '/visas/visitor-visa-600', description: 'For tourism, business, or visiting family' },
        { name: 'Short Stay Activity 400', link: '/visas/short-stay-400', description: 'Short-term specialised work and activities' },
        { name: 'Temporary Activity 408', link: '/visas/short-stay-400', description: 'Research, entertainment, training, and other temporary activities' },
      ],
      icon: Plane,
      color: 'visa-teal',
    },
    {
      title: 'Protection & Special Visas',
      description: 'Humanitarian and protection pathways',
      visas: [
        { name: 'Protection Visa 866', link: '/services/protection-visa-866', description: 'Permanent protection for refugees and those in need of complementary protection' },
      ],
      icon: Shield,
      color: 'visa-gold',
    },
  ];

  const services = [
    { name: 'Skills Assessment', link: '/services/skills-assessments', icon: FileCheck, description: 'Get your qualifications and experience recognised' },
    { name: 'Australian Citizenship', link: '/services/citizenship', icon: Award, description: 'Become an Australian citizen' },
    { name: 'Visa Refusals & ART Appeals', link: '/services/visa-refusals', icon: Sparkles, description: 'Challenge visa decisions through the Administrative Review Tribunal' },
    { name: 'Bridging Visas', link: '/services/bridging-visas', icon: Route, description: 'Maintain lawful status between visa applications' },
  ];

  const employerServices = [
    { name: 'Employer Hub & DAMA', link: '/employers', icon: Building2, description: 'Sponsorship, DAMA arrangements, and labour agreements' },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 t-bg-body overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-visa-gold/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-visa-gold" />
              <span className="t-text-primary text-sm font-medium">All Visa Services</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">
              Australian <span className="text-gradient-gold">Visa Services</span>
            </h1>
            <p className="t-text-muted text-lg leading-relaxed">
              Comprehensive immigration solutions for individuals, families, employers, and skilled workers. 
              Explore our full range of visa services and find the right pathway for your Australian journey.
            </p>
          </div>
        </div>
      </section>

      {/* Visa Categories */}
      <section className="section-padding t-bg-body relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="space-y-16">
            {visaCategories.map((category, index) => (
              <div key={index}>
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-14 h-14 rounded-2xl bg-${category.color}/10 border border-${category.color}/20 flex items-center justify-center`}>
                    <category.icon className={`w-7 h-7 text-${category.color}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold t-text-primary">{category.title}</h2>
                    <p className="t-text-faint">{category.description}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {category.visas.map((visa, vIndex) => (
                    <Link
                      key={vIndex}
                      to={visa.link}
                      className="glass-card p-6 group hover:border-visa-gold/30 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold t-text-primary mb-2 group-hover:text-visa-gold transition-colors">
                            {visa.name}
                          </h3>
                          <p className="t-text-faint text-sm">{visa.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 t-text-ghost group-hover:text-visa-gold group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Employer Services */}
          <div className="mt-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-visa-teal/10 border border-visa-teal/20 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-visa-teal" />
              </div>
              <div>
                <h2 className="text-2xl font-bold t-text-primary">Employer Services</h2>
                <p className="t-text-faint">Sponsorship solutions for Australian businesses</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {employerServices.map((service, index) => (
                <Link
                  key={index}
                  to={service.link}
                  className="glass-card p-6 group hover:border-visa-gold/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-visa-teal/10 border border-visa-teal/20 flex items-center justify-center shrink-0">
                      <service.icon className="w-6 h-6 text-visa-teal" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold t-text-primary mb-2 group-hover:text-visa-gold transition-colors">{service.name}</h3>
                      <p className="t-text-faint text-sm">{service.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Additional Services */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold t-text-primary mb-8">Additional Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <Link
                  key={index}
                  to={service.link}
                  className="glass-card p-6 group hover:border-visa-gold/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-visa-gold/10 border border-visa-gold/20 flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-visa-gold" />
                  </div>
                  <h3 className="text-lg font-semibold t-text-primary mb-2 group-hover:text-visa-gold transition-colors">
                    {service.name}
                  </h3>
                  <p className="t-text-faint text-sm">{service.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Visas;
