import { useState, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Upload, X, FileText, CreditCard, Video, CheckCircle, DollarSign, MonitorPlay } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Layout from '../components/Layout';

const visaTypes = [
  'Partner Visa (820/801)', 'Partner Visa (309/100)', 'Prospective Marriage (300)', 'Parent Visa (103)',
  'Visitor Visa (600)', 'Skills in Demand (482)', 'Employer Nomination (186)', 'Work & Holiday (417/462)',
  'Student Visa (500)', 'Skilled Independent (189)', 'Skilled Nominated (190)', 'Training Visa (407)',
  'Protection Visa (866)', 'Citizenship', 'Skills Assessment', 'Visa Refusal / Appeal (ART)', 'Other / Not Sure',
];

const enquiryTypes = [
  { value: 'general', label: 'General Enquiry' },
  { value: 'visa_application', label: 'Visa Application Assistance' },
  { value: 'consultation', label: 'Book Consultation ($330/hr)' },
  { value: 'urgent', label: 'Urgent / Refused / Cancelled Visa' },
  { value: 'employer', label: 'Employer Sponsorship' },
];

const consultationBenefits = [
  { title: 'Tailored Research', desc: 'We conduct detailed research into your specific circumstances, visa history, and eligibility under current Australian immigration law.' },
  { title: 'Fair Assessment', desc: 'An honest, professional evaluation of your situation — including strengths, risks, and potential challenges in your case.' },
  { title: 'Realistic Prospects', desc: 'Clear guidance on your chances of visa success, based on legislation, policy, and our extensive experience.' },
  { title: 'Right Strategy', desc: 'A personalised roadmap that outlines the best visa pathway, timeline, and steps to maximise your chances of success.' },
];

const consultationMethods = [
  { icon: MonitorPlay, title: 'Video Consultation', desc: 'Online video call via our internal secure video platform. Most popular and convenient. Sessions may be recorded for compliance purposes.' },
  { icon: Phone, title: 'Phone Consultation', desc: 'Audio-only consultation via phone or voice call apps. Suitable for clients who prefer voice-only communication.' },
  { icon: Mail, title: 'Email Consultation', desc: 'Written consultation via email exchange. Ideal for complex cases requiring detailed written analysis.' },
];

const paymentOptions = [
  { method: 'Standard Bank Transfer', detail: 'Payment to our Australian bank account in AUD', note: 'Standard invoice issued' },
  { method: 'International Card (Stripe)', detail: 'Card payment via STRIPE platform', note: 'Subject to additional 4.55% processing fee' },
  { method: 'Russian Bank Account', detail: 'Payment in Rubles to our Russian bank account', note: 'Available in exceptional cases only' },
  { method: 'Crypto Wallet (USDT/USDC)', detail: 'Payment to crypto wallet in USD stablecoin', note: 'Available in exceptional cases only' },
];

const Contact = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', country: '', enquiryType: '', visaType: '', citizenship: '', message: '' });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentError, setAttachmentError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const totalAttachmentSize = () => attachments.reduce((sum, f) => sum + f.size, 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachmentError('');
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    const currentSize = totalAttachmentSize();
    const newSize = newFiles.reduce((sum, f) => sum + f.size, 0);
    const MB = 1024 * 1024;
    if (currentSize + newSize > 20 * MB) {
      setAttachmentError('Total attachments exceed 20 MB limit. Please remove some files.');
      return;
    }
    setAttachments(prev => [...prev, ...newFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
    setAttachmentError('');
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const visaLabel = formData.visaType || 'General';
    const subject = `Website Enquiry: ${visaLabel} - ${fullName}`;
    const attachmentsList = attachments.length > 0 ? `\nAttachments: ${attachments.map(f => f.name).join(', ')}` : '';
    const body = `Name: ${fullName}%0D%0AEmail: ${formData.email}%0D%0APhone: ${formData.phone || 'N/A'}%0D%0ACountry: ${formData.country || 'N/A'}%0D%0AEnquiry Type: ${formData.enquiryType}%0D%0AVisa Type: ${formData.visaType || 'N/A'}%0D%0ACitizenship: ${formData.citizenship || 'N/A'}%0D%0A%0D%0AMessage:%0D%0A${formData.message}%0D%0A${attachmentsList}`;
    window.location.href = `mailto:info@visa2.au?subject=${encodeURIComponent(subject)}&body=${body}`;
    setSubmitted(true);
  };

  const contactInfo = [
    { icon: MapPin, title: 'Office Address', content: 'Level 17, 1 Denison Street', sub: 'North Sydney NSW 2060, Australia' },
    { icon: Mail, title: 'Email', content: 'info@visa2.au', sub: 'We reply within 24 hours' },
    { icon: Clock, title: 'Business Hours', content: 'Monday - Friday', sub: '9:00 AM - 5:00 PM AEST' },
  ];

  return (
    <Layout>
      <section className="relative pt-32 pb-20 t-bg-body overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <img src="/imgs/aboriginal-koala.png" alt="" className="absolute bottom-0 right-10 w-28 h-28 opacity-10 pointer-events-none" loading="lazy" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">Contact <span className="text-gradient-gold">Visa2AU</span></h1>
            <p className="t-text-muted text-lg">Ready to start your Australian immigration journey? Get in touch with our team to book a consultation.</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 t-bg-body border-b t-border">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold t-text-primary text-center mb-8">Benefits of a Professional Consultation</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {consultationBenefits.map((b, i) => (
              <div key={i} className="glass-card p-5 text-center">
                <CheckCircle className="w-6 h-6 text-visa-gold mx-auto mb-3" />
                <h3 className="t-text-primary font-semibold text-sm mb-1">{b.title}</h3>
                <p className="t-text-faint text-xs">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding t-bg-body relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {/* Form */}
            <div className="lg:col-span-3 glass-panel p-6 md:p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-visa-gold/20 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-visa-gold" />
                  </div>
                  <h3 className="text-2xl font-bold t-text-primary mb-2">Enquiry Sent!</h3>
                  <p className="t-text-muted mb-6">Your email client should open shortly. If not, send your enquiry directly to info@visa2.au</p>
                  <button onClick={() => setSubmitted(false)} className="text-visa-gold hover:text-visa-goldLight text-sm">Send another enquiry</button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold t-text-primary mb-6">Send Us an Enquiry</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label htmlFor="firstName" className="t-text-secondary">First Name *</Label>
                        <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className="t-bg-input t-border t-text-primary placeholder:t-text-ghost focus:border-visa-gold" placeholder="John" /></div>
                      <div className="space-y-2"><Label htmlFor="lastName" className="t-text-secondary">Last Name *</Label>
                        <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className="t-bg-input t-border t-text-primary placeholder:t-text-ghost focus:border-visa-gold" placeholder="Smith" /></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label htmlFor="email" className="t-text-secondary">Email Address *</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="t-bg-input t-border t-text-primary placeholder:t-text-ghost focus:border-visa-gold" placeholder="john@example.com" /></div>
                      <div className="space-y-2"><Label htmlFor="phone" className="t-text-secondary">Phone Number</Label>
                        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className="t-bg-input t-border t-text-primary placeholder:t-text-ghost focus:border-visa-gold" placeholder="+1 234 567 890" /></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label htmlFor="country" className="t-text-secondary">Current Country</Label>
                        <Input id="country" name="country" value={formData.country} onChange={handleChange} className="t-bg-input t-border t-text-primary placeholder:t-text-ghost focus:border-visa-gold" placeholder="e.g. Russia, USA, India" /></div>
                      <div className="space-y-2"><Label htmlFor="citizenship" className="t-text-secondary">Citizenship</Label>
                        <Input id="citizenship" name="citizenship" value={formData.citizenship} onChange={handleChange} className="t-bg-input t-border t-text-primary placeholder:t-text-ghost focus:border-visa-gold" placeholder="e.g. Russian, British" /></div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="enquiryType" className="t-text-secondary">Type of Enquiry *</Label>
                      <select id="enquiryType" name="enquiryType" value={formData.enquiryType} onChange={handleChange} required className="w-full h-10 px-3 rounded-md t-bg-input border t-border t-text-primary focus:border-visa-gold outline-none appearance-none">
                        <option value="" className="t-bg-body">Select enquiry type...</option>
                        {enquiryTypes.map(t => <option key={t.value} value={t.label} className="t-bg-body">{t.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visaType" className="t-text-secondary">Visa Type of Interest</Label>
                      <select id="visaType" name="visaType" value={formData.visaType} onChange={handleChange} className="w-full h-10 px-3 rounded-md t-bg-input border t-border t-text-primary focus:border-visa-gold outline-none appearance-none">
                        <option value="" className="t-bg-body">Select visa type...</option>
                        {visaTypes.map((v, i) => <option key={i} value={v} className="t-bg-body">{v}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="t-text-secondary">Your Message *</Label>
                      <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required className="t-bg-input t-border t-text-primary placeholder:t-text-ghost focus:border-visa-gold min-h-[120px]" placeholder="Tell us about your situation, visa needs, timeline, and any specific questions..." />
                    </div>

                    {/* File Attachments - 20 MB total */}
                    <div className="space-y-2">
                      <Label className="t-text-secondary flex items-center gap-2"><Upload className="w-4 h-4" /> Attachments</Label>
                      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="w-full h-10 px-3 rounded-md t-bg-input border border-dashed t-border-hover t-text-ghost hover:border-visa-gold/40 hover:t-text-muted transition-colors text-sm flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4" /> Click to upload files (max 20 MB total)
                      </button>
                      {attachments.length > 0 && (
                        <div className="space-y-1 mt-2">
                          {attachments.map((file, i) => (
                            <div key={i} className="flex items-center justify-between glass-card px-3 py-1.5">
                              <span className="t-text-muted text-xs flex items-center gap-2"><FileText className="w-3 h-3" />{file.name} ({formatSize(file.size)})</span>
                              <button type="button" onClick={() => removeAttachment(i)} className="t-text-ghost hover:text-red-400"><X className="w-3 h-3" /></button>
                            </div>
                          ))}
                          <p className="t-text-ghost text-xs">Total: {formatSize(totalAttachmentSize())} / 20 MB</p>
                        </div>
                      )}
                      {attachmentError && <p className="text-red-400 text-xs">{attachmentError}</p>}
                    </div>

                    <Button type="submit" className="w-full btn-primary"><Send className="w-4 h-4 mr-2" />Send Enquiry</Button>
                    <p className="t-text-ghost text-xs text-center">Opens your email client with a pre-filled message</p>
                  </form>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-5">
              {/* Book Consultation - now first */}
              <div className="glass-panel p-5 border-visa-gold/30">
                <h4 className="font-semibold t-text-primary mb-2">Book a Consultation</h4>
                <p className="t-text-faint text-sm mb-4">Professional advice from a MARN registered migration agent.</p>
                <p className="text-visa-gold font-bold text-lg mb-1">$330 <span className="text-sm font-normal t-text-ghost">AUD / hour</span></p>
                <p className="t-text-ghost text-xs mb-4">pro rata fees may apply</p>
                <p className="t-text-faint text-xs mb-2">Book via email or the enquiry form:</p>
                <a href="mailto:info@visa2.au" className="text-visa-teal text-sm hover:text-visa-gold transition-colors flex items-center gap-2"><Mail className="w-4 h-4" /> info@visa2.au</a>
              </div>

              {contactInfo.map((info, i) => (
                <div key={i} className="glass-card p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-visa-gold/10 border border-visa-gold/20 flex items-center justify-center shrink-0">
                    <info.icon className="w-5 h-5 text-visa-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold t-text-primary text-sm mb-0.5">{info.title}</h4>
                    <p className="t-text-secondary text-sm">{info.content}</p>
                    <p className="t-text-ghost text-xs">{info.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consultation Methods & Payment Options - now at bottom */}
          <div className="max-w-6xl mx-auto mt-12 grid lg:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h4 className="font-semibold t-text-primary text-sm mb-3 flex items-center gap-2"><Video className="w-4 h-4 text-visa-gold" />Consultation Methods</h4>
              <div className="space-y-3">
                {consultationMethods.map((m, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <m.icon className="w-4 h-4 text-visa-teal shrink-0 mt-0.5" />
                    <div>
                      <p className="t-text-secondary text-xs font-medium">{m.title}</p>
                      <p className="t-text-ghost text-xs">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 rounded-lg bg-visa-gold/5 border border-visa-gold/10">
                <p className="t-text-faint text-xs"><span className="text-visa-gold font-semibold">Note:</span> Video calls may be recorded for compliance purposes. All recordings are kept confidential and covered by our <a href="#/terms" className="text-visa-teal hover:text-visa-gold">Privacy Policy</a>.</p>
              </div>
            </div>

            <div className="glass-card p-6">
              <h4 className="font-semibold t-text-primary text-sm mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4 text-visa-gold" />Payment Options</h4>
              <div className="space-y-2">
                {paymentOptions.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 py-1.5 border-b t-border last:border-0">
                    <DollarSign className="w-3 h-3 text-visa-teal shrink-0 mt-0.5" />
                    <div>
                      <p className="t-text-secondary text-xs font-medium">{p.method}</p>
                      <p className="t-text-ghost text-xs">{p.detail}</p>
                      <p className="text-visa-gold/60 text-[10px]">{p.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;