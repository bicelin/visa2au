import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FileText, Shield, Cookie, CreditCard, Database, Globe } from 'lucide-react';
import Layout from '../components/Layout';

const Terms = () => {
  const [activeSection, setActiveSection] = useState<string | null>('terms');

  const sections = [
    { id: 'terms', label: 'Terms and Conditions', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'cookies', label: 'Cookie Policy', icon: Cookie },
    { id: 'payment', label: 'Payment Policy', icon: CreditCard },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'gdpr', label: 'GDPR Notice', icon: Globe },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-visa-navy py-24 lg:py-32">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-4" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Legal</span>
            </nav>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Legal Information
            </h1>
            <p className="text-xl text-white/80">
              Important policies and terms governing your use of Visa2AU services.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-bold text-visa-navy mb-4">On This Page</h2>
                <nav className="space-y-2" aria-label="Policy sections">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveSection(section.id);
                        document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                        activeSection === section.id
                          ? 'bg-visa-navy text-white'
                          : 'text-visa-charcoal hover:bg-gray-100'
                      }`}
                    >
                      <section.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{section.label}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Terms and Conditions */}
              <div id="terms" className="bg-white rounded-2xl p-8 shadow-sm scroll-mt-24">
                <h2 className="text-2xl font-bold text-visa-navy mb-6 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-visa-gold" />
                  Terms and Conditions
                </h2>
                <div className="prose prose-visa max-w-none text-visa-charcoal/80 space-y-6">
                  <p className="text-sm text-visa-charcoal/60">Last updated: March 2025</p>
                  <h3 className="text-lg font-semibold text-visa-navy">1. Agreement to Terms</h3>
                  <p>By accessing or using the Visa2AU website and services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.</p>
                  <h3 className="text-lg font-semibold text-visa-navy">2. Services Description</h3>
                  <p>Visa2AU provides immigration consulting and migration agent services to assist individuals and organizations with Australian visa applications and related matters.</p>
                  <h3 className="text-lg font-semibold text-visa-navy">3. Professional Conduct</h3>
                  <p>All services are provided by registered migration agents in accordance with the Migration Act 1958 and the Migration Agents Registration Authority (MARA) Code of Conduct.</p>
                  <h3 className="text-lg font-semibold text-visa-navy">4. Client Responsibilities</h3>
                  <p>Clients are responsible for providing accurate information, submitting genuine documentation, responding promptly to requests, and paying applicable fees.</p>
                  <h3 className="text-lg font-semibold text-visa-navy">5. Limitation of Liability</h3>
                  <p>While we provide professional advice based on our expertise, visa outcomes are determined solely by the Department of Home Affairs. We cannot guarantee specific outcomes.</p>
                  <h3 className="text-lg font-semibold text-visa-navy">6. Governing Law</h3>
                  <p>These terms are governed by the laws of New South Wales, Australia. Contact us at info@visa2.au for questions.</p>
                </div>
              </div>

              {/* Privacy Policy */}
              <div id="privacy" className="bg-white rounded-2xl p-8 shadow-sm scroll-mt-24">
                <h2 className="text-2xl font-bold text-visa-navy mb-6 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-visa-gold" />
                  Privacy Policy
                </h2>
                <div className="prose prose-visa max-w-none text-visa-charcoal/80 space-y-6">
                  <p className="text-sm text-visa-charcoal/60">Last updated: March 2025</p>
                  <h3 className="text-lg font-semibold text-visa-navy">1. Information We Collect</h3>
                  <p>We collect personal information including name, contact details, passport information, immigration history, and financial information necessary for providing our services.</p>
                  <h3 className="text-lg font-semibold text-visa-navy">2. How We Use Your Information</h3>
                  <p>Your information is used to provide immigration consulting services, prepare and lodge visa applications, communicate regarding your case, and comply with legal obligations.</p>
                  <h3 className="text-lg font-semibold text-visa-navy">3. Information Sharing</h3>
                  <p>We may share information with the Department of Home Affairs, other government agencies, and service providers who assist in our operations. We do not sell or rent personal information.</p>
                  <h3 className="text-lg font-semibold text-visa-navy">4. Your Rights</h3>
                  <p>Under Australian Privacy Principles, you have the right to access, correct, and request deletion of your personal information. Contact us at info@visa2.au.</p>
                </div>
              </div>

              {/* Cookie Policy */}
              <div id="cookies" className="bg-white rounded-2xl p-8 shadow-sm scroll-mt-24">
                <h2 className="text-2xl font-bold text-visa-navy mb-6 flex items-center gap-3">
                  <Cookie className="w-6 h-6 text-visa-gold" />
                  Cookie Policy
                </h2>
                <div className="prose prose-visa max-w-none text-visa-charcoal/80 space-y-6">
                  <p className="text-sm text-visa-charcoal/60">Last updated: March 2025</p>
                  <h3 className="text-lg font-semibold text-visa-navy">1. Types of Cookies We Use</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                    <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
                  </ul>
                  <h3 className="text-lg font-semibold text-visa-navy">2. Managing Cookies</h3>
                  <p>You can control cookie settings through your browser preferences. Disabling certain cookies may affect website functionality.</p>
                </div>
              </div>

              {/* Payment Policy */}
              <div id="payment" className="bg-white rounded-2xl p-8 shadow-sm scroll-mt-24">
                <h2 className="text-2xl font-bold text-visa-navy mb-6 flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-visa-gold" />
                  Payment Policy
                </h2>
                <div className="prose prose-visa max-w-none text-visa-charcoal/80 space-y-6">
                  <p className="text-sm text-visa-charcoal/60">Last updated: March 2025</p>
                  <h3 className="text-lg font-semibold text-visa-navy">1. Fee Structure</h3>
                  <p>Our professional fees are quoted in Australian Dollars (AUD) and may vary depending on the complexity of your case.</p>
                  <h3 className="text-lg font-semibold text-visa-navy">2. Payment Methods</h3>
                  <p>We accept bank transfer (EFT), credit card (Visa, Mastercard), and PayPal.</p>
                  <h3 className="text-lg font-semibold text-visa-navy">3. Refund Policy</h3>
                  <p>Refunds are considered on a case-by-case basis. Uncommenced work may be eligible for partial refund. Government fees are non-refundable once paid.</p>
                </div>
              </div>

              {/* Data Management */}
              <div id="data" className="bg-white rounded-2xl p-8 shadow-sm scroll-mt-24">
                <h2 className="text-2xl font-bold text-visa-navy mb-6 flex items-center gap-3">
                  <Database className="w-6 h-6 text-visa-gold" />
                  Data Management
                </h2>
                <div className="prose prose-visa max-w-none text-visa-charcoal/80 space-y-6">
                  <p className="text-sm text-visa-charcoal/60">Last updated: March 2025</p>
                  <h3 className="text-lg font-semibold text-visa-navy">1. Data Retention</h3>
                  <p>Client records are retained for the duration of service plus 7 years in accordance with legal requirements.</p>
                  <h3 className="text-lg font-semibold text-visa-navy">2. Data Security</h3>
                  <p>Your data is stored securely using industry-standard encryption and access controls.</p>
                </div>
              </div>

              {/* GDPR Notice */}
              <div id="gdpr" className="bg-white rounded-2xl p-8 shadow-sm scroll-mt-24">
                <h2 className="text-2xl font-bold text-visa-navy mb-6 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-visa-gold" />
                  GDPR Notice for EU Residents
                </h2>
                <div className="prose prose-visa max-w-none text-visa-charcoal/80 space-y-6">
                  <p className="text-sm text-visa-charcoal/60">Last updated: March 2025</p>
                  <h3 className="text-lg font-semibold text-visa-navy">1. Your GDPR Rights</h3>
                  <p>As an EU/EEA resident, you have rights to access, rectify, erase, restrict processing, and port your personal data.</p>
                  <h3 className="text-lg font-semibold text-visa-navy">2. International Transfers</h3>
                  <p>Your data may be transferred outside the EU/EEA, including to Australia, using appropriate safeguards such as Standard Contractual Clauses.</p>
                </div>
              </div>

              {/* Contact CTA */}
              <div className="bg-visa-navy rounded-2xl p-8 text-center">
                <h3 className="text-xl font-bold text-white mb-4">Questions About Our Policies?</h3>
                <p className="text-white/70 mb-6">Our team is here to help with any questions.</p>
                <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                  Contact Us <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
