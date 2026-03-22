import { Link } from 'react-router-dom';
import { ChevronRight, Heart, Globe, Users, ArrowRight, CreditCard, Check } from 'lucide-react';
import Layout from '../components/Layout';
import { useState } from 'react';

const Donations = () => {
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const presetAmounts = [25, 50, 100, 250];

  const handleDonate = () => {
    setIsProcessing(true);
    // In production, this would redirect to Stripe checkout
    // For now, show the processing state
    setTimeout(() => {
      alert('Thank you for your interest in donating! Stripe integration would redirect to secure payment here.\n\nFor questions, contact: info@visa2.au');
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-visa-navy py-24 lg:py-32">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-4" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Support</span>
            </nav>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Support Our Community
            </h1>
            <p className="text-xl text-white/80">
              Your generosity helps us continue providing essential immigration services to those in need.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="text-center mb-16">
              <div className="w-20 h-20 bg-visa-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-visa-gold" />
              </div>
              <h2 className="text-3xl font-bold text-visa-navy mb-4">Make a Difference Today</h2>
              <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
                At Visa2AU, we believe everyone deserves access to quality immigration advice.
                Your donations help us provide pro bono consultations and support to vulnerable migrants.
              </p>
            </div>

            {/* Donation Options */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-visa-teal/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-visa-teal" />
                </div>
                <h3 className="text-lg font-bold text-visa-navy mb-3">Pro Bono Services</h3>
                <p className="text-visa-charcoal/60 text-sm mb-4">Fund free consultations for those who cannot afford help.</p>
                <p className="text-visa-gold font-bold">100% to client services</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-visa-navy/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-7 h-7 text-visa-navy" />
                </div>
                <h3 className="text-lg font-bold text-visa-navy mb-3">Refugee Assistance</h3>
                <p className="text-visa-charcoal/60 text-sm mb-4">Support refugees navigating Australia's immigration system.</p>
                <p className="text-visa-gold font-bold">Help families reunite</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-visa-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-7 h-7 text-visa-gold" />
                </div>
                <h3 className="text-lg font-bold text-visa-navy mb-3">Education Programs</h3>
                <p className="text-visa-charcoal/60 text-sm mb-4">Create free resources and workshops for the community.</p>
                <p className="text-visa-gold font-bold">Empower through knowledge</p>
              </div>
            </div>

            {/* Stripe Donation Form */}
            <div className="bg-visa-navy rounded-2xl p-8 mb-16">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Make a Donation with Stripe</h2>
              <div className="max-w-md mx-auto">
                {/* Amount Selection */}
                <div className="mb-6">
                  <p className="text-white/70 text-sm mb-3">Select Amount (AUD)</p>
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    {presetAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount('');
                        }}
                        className={`py-3 rounded-lg font-medium transition-all ${
                          selectedAmount === amount && !customAmount
                            ? 'bg-visa-gold text-white'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">$</span>
                    <input
                      type="number"
                      placeholder="Custom amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(0);
                      }}
                      className="w-full bg-white/10 text-white placeholder-white/40 rounded-lg py-3 pl-8 pr-4 border border-white/20 focus:border-visa-gold focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-white/10 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center text-white">
                    <span>Donation Amount:</span>
                    <span className="text-xl font-bold text-visa-gold">
                      ${customAmount || selectedAmount} AUD
                    </span>
                  </div>
                </div>

                {/* Donate Button */}
                <button
                  onClick={handleDonate}
                  disabled={isProcessing || (!selectedAmount && !customAmount)}
                  className="w-full bg-[#635BFF] hover:bg-[#524DDB] disabled:bg-white/20 disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Donate with Stripe
                    </>
                  )}
                </button>

                {/* Stripe Badge */}
                <div className="flex items-center justify-center gap-2 mt-4 text-white/50 text-xs">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                  </svg>
                  Secure payments powered by Stripe
                </div>

                {/* Alternative Payment Note */}
                <p className="text-center text-white/50 text-xs mt-4">
                  Other payment methods available. Contact us at <a href="mailto:info@visa2.au" className="text-visa-gold hover:underline">info@visa2.au</a>
                </p>
              </div>
            </div>

            {/* What Your Donation Supports */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-16">
              <h3 className="text-xl font-bold text-visa-navy mb-6">What Your Donation Supports</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  'Free immigration consultations for low-income families',
                  'Assistance with visa applications for vulnerable migrants',
                  'Educational workshops on Australian immigration law',
                  'Support services for refugee families',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-visa-teal flex-shrink-0 mt-0.5" />
                    <span className="text-visa-charcoal">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax Deductibility */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-16">
              <h3 className="text-xl font-bold text-visa-navy mb-4">Tax Deductibility Information</h3>
              <p className="text-visa-charcoal/70 mb-4">
                Please note that Visa2AU is not a registered charity. Donations made to Visa2AU are not tax-deductible.
              </p>
              <p className="text-visa-charcoal/70">For tax-deductible options, we recommend registered charities such as:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2 text-visa-charcoal/70">
                <li>Refugee Council of Australia</li>
                <li>Australian Red Cross Refugee Services</li>
                <li>RACS (Refugee Advice and Casework Service)</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-visa-navy mb-4">Questions About Donations?</h3>
              <p className="text-visa-charcoal/70 mb-6">Contact us to discuss donation options.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="mailto:info@visa2.au" className="inline-flex items-center gap-2 text-visa-teal font-semibold hover:text-visa-navy transition-colors">
                  info@visa2.au <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-visa-navy mb-4">Ready to Start Your Journey?</h2>
          <p className="text-visa-charcoal/70 max-w-2xl mx-auto mb-8">Let our expert team guide you through the Australian immigration process.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              Book Consultation <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/visas" className="btn-outline inline-flex items-center gap-2">View Visa Options</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Donations;
