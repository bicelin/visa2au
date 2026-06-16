import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowRight, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Office Address',
      content: 'Level 17, 1 Denison Street',
      subContent: 'North Sydney NSW 2060',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+61 2 9136 2462',
      subContent: 'Voicemail service',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@visa2.au',
      subContent: 'We reply within 24 hours',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Monday - Friday',
      subContent: '9:00 AM - 5:00 PM AEST',
    },
  ];

  return (
    <section id="contact" ref={sectionRef} className="section-padding t-bg-body relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="absolute top-0 left-1/4 w-96 h-96 t-bg-gold-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 t-bg-teal-10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4">
            <MessageSquare className="w-4 h-4 text-visa-gold" />
            <span className="t-text-secondary text-sm font-medium">Get In Touch</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold t-text-primary mb-4">
            Contact <span className="text-gradient-gold">Visa2AU</span>
          </h2>
          <p className="t-text-muted max-w-2xl mx-auto">
            Ready to start your Australian immigration journey? Get in touch with our team to book a consultation.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div
            className={`glass-panel p-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
          >
            <h3 className="text-xl font-bold t-text-primary mb-6">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="t-text-muted">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="t-bg-input t-border t-text-primary placeholder:t-text-ghost focus:border-visa-gold focus:ring-visa-gold/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="t-text-muted">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="t-bg-input t-border t-text-primary placeholder:t-text-ghost focus:border-visa-gold focus:ring-visa-gold/20"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="t-text-muted">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="t-bg-input t-border t-text-primary placeholder:t-text-ghost focus:border-visa-gold focus:ring-visa-gold/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="t-text-muted">Your Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your visa needs..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="t-bg-input t-border t-text-primary placeholder:t-text-ghost focus:border-visa-gold focus:ring-visa-gold/20 min-h-[120px]"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full btn-primary"
              >
                Send Message
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div
            className={`space-y-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
          >
            {contactInfo.map((info, index) => (
              <div key={index} className="glass-card p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl t-bg-gold-10 border t-border-gold-20 flex items-center justify-center flex-shrink-0">
                  <info.icon className="w-6 h-6 text-visa-gold" />
                </div>
                <div>
                  <h4 className="font-semibold t-text-primary mb-1">{info.title}</h4>
                  <p className="t-text-muted">{info.content}</p>
                  <p className="t-text-faint text-sm">{info.subContent}</p>
                </div>
              </div>
            ))}

            {/* Quick CTA */}
            <div className="glass-panel p-6 t-border-gold-20">
              <h4 className="font-semibold t-text-primary mb-2">Prefer to talk?</h4>
              <p className="t-text-muted text-sm mb-4">
                Book a consultation with one of our migration agents.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-visa-gold hover:text-visa-goldLight font-medium"
              >
                Book Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="t-text-ghost text-xs mt-3">$330 AUD per 1 hour (pro rata fees may apply)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
