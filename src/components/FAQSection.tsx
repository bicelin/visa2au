import { useEffect, useRef, useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
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

  const faqs = [
    {
      question: 'How long does a visa application take?',
      answer:
        'Processing times vary significantly depending on the visa type, complexity of your case, and current government processing queues. Partner visas typically take 12-24 months, visitor visas may be processed within weeks to months, and skilled visas can range from 6-18 months. We can provide you with an estimated timeframe during your consultation.',
    },
    {
      question: 'What is an MARN number?',
      answer:
        'MARN stands for Migration Agent Registration Number. In Australia, migration agents must be registered with the Office of the Migration Agents Registration Authority (MARA) to legally provide immigration advice. All our agents hold current MARN registrations, which you can verify at mara.gov.au.',
    },
    {
      question: 'Do I need a lawyer or a migration agent?',
      answer:
        'While not legally required, using a registered migration agent significantly improves your chances of a successful application. Migration agents specialize specifically in immigration law and procedures, staying updated with policy changes. We can help you avoid common mistakes, prepare stronger applications, and navigate complex situations like refusals or appeals.',
    },
    {
      question: 'How much does a visa cost?',
      answer:
        'Visa costs vary widely depending on the visa category. Government application charges range from hundreds to thousands of dollars. Our service fees are transparent and competitive. We provide detailed quotes during consultations that outline all costs, including government fees, so you can budget accordingly.',
    },
    {
      question: 'Can you help with visa refusals?',
      answer:
        'Yes, we specialize in helping clients who have received visa refusals. We can review your case, identify reasons for refusal, and advise on options including Administrative Review Tribunal (ART) appeals, fresh applications, or alternative visa pathways. Early intervention is crucial for the best outcomes.',
    },
    {
      question: 'What documents do I need for a partner visa?',
      answer:
        'Partner visa applications require extensive documentation including proof of identity, relationship evidence (financial, social, household aspects), character documents, and health examinations. We provide a comprehensive document checklist during your consultation tailored to your specific relationship circumstances.',
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" ref={sectionRef} className="section-padding bg-white" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 id="faq-heading" className="text-3xl lg:text-4xl font-bold text-visa-navy mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-visa-charcoal/70 max-w-2xl mx-auto">
            Find answers to common questions about Australian immigration and our services.
          </p>
        </div>

        <div className="max-w-3xl mx-auto" role="list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
              role="listitem"
            >
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <h3>
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <div className="flex items-center gap-4">
                      <HelpCircle className="w-5 h-5 text-visa-teal flex-shrink-0" aria-hidden="true" />
                      <span className="font-semibold text-visa-navy">{faq.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-visa-charcoal transition-transform duration-300 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                >
                  <p className="px-6 py-5 text-visa-charcoal/70 leading-relaxed bg-white">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <p className="text-visa-charcoal/70 mb-4">Still have questions?</p>
          <a href="#contact" className="inline-flex items-center gap-2 text-visa-teal font-semibold hover:gap-3 transition-all">
            Contact Us for More Information
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
