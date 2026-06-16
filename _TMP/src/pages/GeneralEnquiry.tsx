import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowLeft, Mail, Phone, Clock } from 'lucide-react';
import Layout from '../components/Layout';

const GeneralEnquiry = () => {
  useEffect(() => {
    window.location.href = 'https://visa2au.mmportal.cloud/assessment/enquiry/general-enquiry#nav-top';
  }, []);

  return (
    <Layout>
      <section className="relative bg-visa-navy py-24 lg:py-32">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ExternalLink className="w-4 h-4" />
              <span className="text-white">General Enquiry Form</span>
            </nav>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">General Enquiry Form</h1>
            <p className="text-xl text-white/80">You're being redirected to our secure enquiry form...</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-visa-navy/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <ExternalLink className="w-10 h-10 text-visa-navy" />
              </div>
              <h2 className="text-2xl font-bold text-visa-navy mb-4">Redirecting to Enquiry Form...</h2>
              <p className="text-visa-charcoal/70 mb-4">If you're not automatically redirected, please click below.</p>
            </div>

            <a href="https://visa2au.mmportal.cloud/assessment/enquiry/general-enquiry#nav-top" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 mb-12">
              Open General Enquiry Form <ExternalLink className="w-5 h-5" />
            </a>

            <div className="border-t border-gray-200 pt-12">
              <h3 className="text-xl font-bold text-visa-navy mb-6">Prefer to Contact Us Directly?</h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="w-10 h-10 bg-visa-teal/10 rounded-lg flex items-center justify-center mb-4">
                    <Phone className="w-5 h-5 text-visa-teal" />
                  </div>
                  <h4 className="font-semibold text-visa-navy mb-2">Call Us</h4>
                  <a href="tel:+61291362462" className="text-visa-teal font-medium hover:text-visa-navy">+61 2 9136 2462</a>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="w-10 h-10 bg-visa-teal/10 rounded-lg flex items-center justify-center mb-4">
                    <Mail className="w-5 h-5 text-visa-teal" />
                  </div>
                  <h4 className="font-semibold text-visa-navy mb-2">Email Us</h4>
                  <a href="mailto:info@visa2.au" className="text-visa-teal font-medium hover:text-visa-navy">info@visa2.au</a>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="w-10 h-10 bg-visa-teal/10 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="w-5 h-5 text-visa-teal" />
                  </div>
                  <h4 className="font-semibold text-visa-navy mb-2">Office Hours</h4>
                  <p className="text-visa-charcoal/60 text-sm">Mon-Fri: 9AM - 5:30PM</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <Link to="/" className="inline-flex items-center gap-2 text-visa-charcoal hover:text-visa-navy transition-colors">
                <ArrowLeft className="w-5 h-5" /> Return to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GeneralEnquiry;
