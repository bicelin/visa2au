import { Link } from 'react-router-dom';
import { Check, ArrowRight, Award, Users, Clock, MapPin, Phone, Mail } from 'lucide-react';
import Layout from '../components/Layout';

const About = () => {
  const values = [
    {
      icon: Award,
      title: 'Expertise',
      description: 'Over 20 years of combined experience in Australian migration law',
    },
    {
      icon: Users,
      title: 'Client Focus',
      description: 'Personalized service tailored to your unique circumstances',
    },
    {
      icon: Clock,
      title: 'Responsiveness',
      description: 'Quick turnaround times and proactive communication',
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
              About Visa2AU
            </h1>
            <p className="text-xl text-white/80 mb-6">
              Your trusted Australian immigration experts. We simplify the complexity of migration law and help individuals, families, and employers achieve their Australian dreams.
            </p>
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              Get in Touch
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-visa-navy mb-6">Our Story</h2>
              <p className="text-visa-charcoal/70 mb-4">
                Visa2AU was founded with a simple mission: to make Australian immigration accessible and understandable. We believe that everyone deserves the opportunity to build their future in Australia, whether they're coming for work, family, or a new beginning.
              </p>
              <p className="text-visa-charcoal/70 mb-4">
                Our team of registered migration agents brings decades of combined experience in all areas of Australian migration law. We've helped thousands of clients successfully obtain visas and build new lives in Australia.
              </p>
              <p className="text-visa-charcoal/70">
                Registered with the Migration Agents Registration Authority (MARA), we adhere to the highest professional standards and are committed to providing ethical, honest, and effective immigration services.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-visa-navy mb-6">Our Values</h3>
              <div className="space-y-6">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-visa-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-6 h-6 text-visa-teal" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-visa-navy mb-1">{value.title}</h4>
                      <p className="text-visa-charcoal/60 text-sm">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-visa-navy mb-4">Why Choose Visa2AU?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'MARA Registered', desc: 'All agents are registered with the Migration Agents Registration Authority' },
              { title: '20+ Years Experience', desc: 'Combined experience in Australian migration law' },
              { title: 'Thousands Served', desc: 'Successfully helped thousands of clients obtain visas' },
              { title: 'Personal Service', desc: 'Dedicated case managers for each client' },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <Check className="w-10 h-10 text-visa-gold mx-auto mb-3" />
                <h3 className="font-semibold text-visa-navy mb-2">{item.title}</h3>
                <p className="text-visa-charcoal/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-visa-navy mb-6">Contact Us</h2>
              <p className="text-visa-charcoal/70 mb-6">
                We're here to help. Contact our team for a free initial consultation about your immigration needs.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-visa-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-visa-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-visa-navy">Address</h3>
                    <p className="text-visa-charcoal/60 text-sm">Level 17, 1 Denison Street<br />North Sydney NSW 2060</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-visa-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-visa-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-visa-navy">Phone</h3>
                    <p className="text-visa-charcoal/60 text-sm">+61 2 9136 2462</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-visa-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-visa-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-visa-navy">Email</h3>
                    <p className="text-visa-charcoal/60 text-sm">info@visa2.au</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-visa-navy rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6">Office Hours</h3>
              <div className="space-y-3 text-white/80">
                <p>Monday - Friday: 9:00 AM - 5:30 PM</p>
                <p>Saturday: By appointment</p>
                <p>Sunday: Closed</p>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-white/60 text-sm">
                  All consultations are by appointment only. Contact us to schedule your free initial consultation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-visa-navy">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Contact us today for a free initial assessment of your immigration needs.
          </p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
            Book Consultation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default About;