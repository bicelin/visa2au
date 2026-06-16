import { ChevronDown, CheckCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-label="Hero section">
      {/* Background Image - LCP optimized: no lazy loading for above-fold */}
      <div className="absolute inset-0 z-0">
        <img
          src="/imgs/hero-sydney.jpg"
          alt="Sydney Opera House and Harbour Bridge at sunset - Visa2AU Australian immigration services"
          className="w-full h-full object-cover"
          width="1920"
          height="1080"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-visa-gold" />
            <span className="text-white text-sm font-medium">MARN Registered Migration Agents</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in delay-100">
            Simplifying the Complexity of{' '}
            <span className="text-visa-gold">Australian Immigration</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto animate-fade-in delay-200">
            Expert migration support for individuals, families and employers. Navigate your journey to Australia with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-300">
            <a href="#contact" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
              Book a Consultation
            </a>
            <a href="#services" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
              Explore Visa Services
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/70 text-sm animate-fade-in delay-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-visa-gold" />
              <span>20+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-visa-gold" />
              <span>2000+ Completed Cases</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-visa-gold" />
              <span>99.8% Satisfaction Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <a
        href="#stats"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/60 hover:text-white transition-colors animate-bounce"
        aria-label="Scroll to content"
      >
        <ChevronDown className="w-8 h-8" />
      </a>
    </section>
  );
};

export default Hero;
