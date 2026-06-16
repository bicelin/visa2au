import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle, ExternalLink, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    visaType: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
              Contact Us
            </h1>
            <p className="text-xl text-white/80 mb-6">
              Get in touch with our team for a free initial consultation. We're here to help with all your Australian immigration needs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-visa-navy mb-6">Send Us a Message</h2>
              {submitted ? (
                <div className="bg-green-50 rounded-xl p-8 border border-green-200 text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-700 mb-4">
                    Thank you for contacting Visa2AU. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-green-700 font-medium hover:text-green-800"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-visa-charcoal mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-visa-teal focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-visa-charcoal mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-visa-teal focus:border-transparent transition-all"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-visa-charcoal mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-visa-teal focus:border-transparent transition-all"
                        placeholder="+61 xxx xxx xxx"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="visaType" className="block text-sm font-medium text-visa-charcoal mb-2">
                      Visa Type of Interest
                    </label>
                    <select
                      id="visaType"
                      name="visaType"
                      value={formData.visaType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-visa-teal focus:border-transparent transition-all"
                    >
                      <option value="">Select a visa type</option>
                      <option value="visitor">Visitor Visa 600</option>
                      <option value="partner-820">Partner Visa 820/801</option>
                      <option value="partner-309">Partner Visa 309/100</option>
                      <option value="prospective-marriage">Prospective Marriage 300</option>
                      <option value="employer-482">Skills in Demand 482</option>
                      <option value="employer-186">Employer Nomination 186</option>
                      <option value="parent">Parent Visa 103</option>
                      <option value="skills-assessment">Skills Assessment</option>
                      <option value="citizenship">Citizenship</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-visa-charcoal mb-2">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-visa-teal focus:border-transparent transition-all resize-none"
                      placeholder="Tell us about your situation and how we can help..."
                    />
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin">
                          <Clock className="w-5 h-5" />
                        </span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-visa-navy mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-visa-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-visa-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-visa-navy mb-1">Address</h3>
                    <p className="text-visa-charcoal/70">
                      Level 17, 1 Denison Street<br />
                      North Sydney NSW 2060<br />
                      Australia
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-visa-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-visa-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-visa-navy mb-1">Phone (Voicemail)</h3>
                    <a href="tel:+61291362462" className="text-visa-charcoal/70 hover:text-visa-teal transition-colors">
                      +61 2 9136 2462
                    </a>
                    <p className="text-xs text-visa-gold mt-1">Note: This is a voicemail service. For immediate assistance, please email us.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-visa-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-visa-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-visa-navy mb-1">Email</h3>
                    <a href="mailto:info@visa2.au" className="text-visa-charcoal/70 hover:text-visa-teal transition-colors">
                      info@visa2.au
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-visa-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-visa-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-visa-navy mb-1">Office Hours</h3>
                    <p className="text-visa-charcoal/70">
                      Monday - Friday: 9:00 AM - 5:30 PM<br />
                      Saturday: By appointment<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-visa-navy mb-3">Important Notice</h3>
                <p className="text-visa-charcoal/70 text-sm">
                  All consultations are by appointment only. Please contact us to schedule your free initial consultation before visiting our office.
                </p>
              </div>

              {/* Quick Links */}
              <div className="mt-8">
                <h3 className="font-semibold text-visa-navy mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link to="/visas" className="block text-visa-teal hover:text-visa-navy transition-colors">
                    View Visa Services
                  </Link>
                  <Link to="/pricing" className="block text-visa-teal hover:text-visa-navy transition-colors">
                    View Pricing
                  </Link>
                  <Link to="/team" className="block text-visa-teal hover:text-visa-navy transition-colors">
                    Meet Our Team
                  </Link>
                </div>
              </div>

              {/* Online Forms CTA */}
              <div className="mt-8">
                <h3 className="font-semibold text-visa-navy mb-4">Complete Online Forms</h3>
                <div className="space-y-3">
                  <Link
                    to="/forms/general-enquiry"
                    className="flex items-center justify-between p-4 bg-visa-navy text-white rounded-xl hover:bg-visa-navyDark transition-colors"
                  >
                    <span className="font-medium">General Enquiry</span>
                    <ExternalLink className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/forms/questionnaire"
                    className="flex items-center justify-between p-4 bg-visa-teal text-white rounded-xl hover:bg-visa-teal/90 transition-colors"
                  >
                    <span className="font-medium">Visa Questionnaire</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;