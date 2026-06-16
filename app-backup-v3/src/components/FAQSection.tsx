import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle, MessageCircle, ArrowRight } from 'lucide-react';

const FAQSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef(null);

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

  const faqs = [
    {
      question: 'How long does the visa application process take?',
      answer: 'Processing times vary depending on the visa type. Partner visas typically take 12-24 months, employer-sponsored visas 6-12 months, and visitor visas 2-4 weeks. We provide estimated timelines during your initial consultation.',
    },
    {
      question: 'What documents do I need for a partner visa?',
      answer: 'Partner visa applications require evidence of your relationship, including joint financial documents, proof of cohabitation, photos together, statutory declarations from friends/family, and identity documents. We provide a comprehensive checklist tailored to your situation.',
    },
    {
      question: 'Can you help with visa refusals and appeals?',
      answer: 'Yes, we specialize in handling visa refusals and AAT (Administrative Appeals Tribunal) appeals. Our experienced agents can review your case, identify issues, and represent you throughout the appeal process.',
    },
    {
      question: 'How much do your services cost?',
      answer: 'Our fees vary based on the complexity of your case. Consultations are $330 AUD per 1 hour (pro rata fees may apply). View our pricing page for detailed information on common visa types.',
    },
    {
      question: 'Are you registered migration agents?',
      answer: 'Yes, all our migration agents are registered with the Office of the Migration Agents Registration Authority (MARA). You can verify our registration at mara.gov.au. Our MARN numbers are: 0534230 (N. Arens) and 2418663 (S. Vinnichenko).',
    },
  ];

  return (
    <section ref={sectionRef} className="section-padding t-bg-body relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="absolute top-1/4 left-0 w-96 h-96 t-bg-gold-10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 t-bg-teal-10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4">
            <HelpCircle className="w-4 h-4 text-visa-gold" />
            <span className="t-text-secondary text-sm font-medium">Common Questions</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold t-text-primary mb-4">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h2>
          <p className="t-text-muted max-w-2xl mx-auto">
            Find answers to common questions about Australian immigration and our services.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`glass-card transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <span className="font-semibold t-text-primary pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-visa-gold flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-6 t-text-muted leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* More Questions CTA */}
          <div className="mt-10 text-center">
            <div className="glass-panel p-8 inline-block">
              <MessageCircle className="w-10 h-10 text-visa-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold t-text-primary mb-2">Still have questions?</h3>
              <p className="t-text-muted mb-6 max-w-md">
                Can&apos;t find the answer you&apos;re looking for? Our team is here to help with any immigration questions.
              </p>
              <Link
                to="/contact"
                className="btn-primary inline-flex items-center gap-2"
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
