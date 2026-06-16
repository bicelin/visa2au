import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Send, ExternalLink, ArrowRight } from 'lucide-react';

const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    visaType: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for your enquiry! We will contact you shortly.');
      setFormData({ name: '', email: '', phone: '', visaType: '', message: '' });
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const visaTypes = [
    'Select visa type...',
    'Partner Visa (820/801)',
    'Partner Visa (309/100)',
    'Visitor Visa (600)',
    'Skilled Visa (189/190/491)',
    'Employer Sponsorship (482/186)',
    'Parent Visa (103)',
    'Student Visa (500)',
    'Citizenship Application',
    'Skills Assessment',
    'ART Appeal',
    'Other',
  ];

  return (
    <section id="contact" ref={sectionRef} className="section-padding bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-visa-navy mb-4">
            Get in Touch
          </h2>
          <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
            Ready to start your migration journey? Contact us for a consultation.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div
            className={`bg-white rounded-2xl p-8 shadow-lg transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
          >
            <h3 className="text-xl font-bold text-visa-navy mb-6">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-visa-charcoal mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visa-teal focus:border-transparent transition-all"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-visa-charcoal mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visa-teal focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-visa-charcoal mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visa-teal focus:border-transparent transition-all"
                  placeholder="+61 400 000 000"
                />
              </div>

              <div>
                <label htmlFor="visaType" className="block text-sm font-medium text-visa-charcoal mb-1">
                  Visa Type
                </label>
                <select
                  id="visaType"
                  name="visaType"
                  value={formData.visaType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visa-teal focus:border-transparent transition-all bg-white"
                >
                  {visaTypes.map((type, index) => (
                    <option key={index} value={index === 0 ? '' : type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-visa-charcoal mb-1">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visa-teal focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about your situation..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
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
          </div>

          {/* Contact Info */}
          <div
            className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
          >
            <div className="bg-visa-navy rounded-2xl p-8 text-white h-full">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-visa-gold" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Phone</p>
                    <a href="tel:+61291362462" className="text-white/70 hover:text-visa-gold transition-colors">
                      +61 2 9136 2462
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-visa-gold" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Email</p>
                    <a href="mailto:info@visa2.au" className="text-white/70 hover:text-visa-gold transition-colors">
                      info@visa2.au
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-visa-gold" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Office</p>
                    <p className="text-white/70">
                      Level 17, 1 Denison Street<br />
                      North Sydney NSW 2060
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-visa-gold" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Hours</p>
                    <p className="text-white/70">By Appointment Only</p>
                  </div>
                </div>
              </div>

              {/* Appointment Badge */}
              <div className="mt-8 p-4 bg-visa-gold/20 rounded-xl border border-visa-gold/30">
                <p className="text-sm text-visa-gold font-medium">
                  All consultations are by appointment only.
                  Please contact us to schedule your visit.
                </p>
              </div>

              {/* Form CTA Buttons */}
              <div className="mt-6 space-y-3">
                <Link
                  to="/forms/general-enquiry"
                  className="flex items-center justify-center gap-2 w-full bg-visa-gold text-visa-navy font-semibold py-3 px-4 rounded-xl hover:bg-visa-goldLight transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  General Enquiry Form
                </Link>
                <Link
                  to="/forms/questionnaire"
                  className="flex items-center justify-center gap-2 w-full bg-white/10 text-white font-semibold py-3 px-4 rounded-xl hover:bg-white/20 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  Complete Visa Questionnaire
                </Link>
              </div>

              {/* Map Placeholder */}
              <div className="mt-6 h-48 bg-white/10 rounded-xl flex items-center justify-center">
                <div className="text-center text-white/50">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">North Sydney, NSW 2060</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
