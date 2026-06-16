import Layout from '../components/Layout';
import { Shield, FileText, Lock, Mail, ExternalLink, AlertCircle, Scale, HelpCircle, Phone, MapPin } from 'lucide-react';

const sections = [
  {
    id: 'privacy',
    icon: Lock,
    title: 'Privacy Policy',
    content: [
      {
        subtitle: 'Our Commitment',
        text: 'Visa2AU Pty Ltd (ABN: 36 676 512 397) is committed to protecting your privacy in accordance with the Australian Privacy Principles (APPs) under the Privacy Act 1988 (Cth). We collect, use, store, and disclose personal information only for the purpose of providing migration assistance and related support. We do not sell, rent, or trade your personal information to third parties for marketing purposes.',
      },
      {
        subtitle: 'Information We Collect',
        text: 'We collect personal information necessary to assess and prepare your visa application, including: name, date of birth, contact details, passport information, employment history, educational qualifications, health information, character and police check records, family details, financial information, and visa history. We collect this information directly from you or, with your consent, from third parties such as employers, educational institutions, and medical professionals.',
      },
      {
        subtitle: 'How We Use Your Information',
        text: 'Your personal information is used solely for: preparing and lodging visa applications, communicating with the Department of Home Affairs (DoHA) and other relevant authorities on your behalf, providing migration advice and strategy, communicating with you about your application, maintaining our records as required by OMARA, and complying with legal obligations.',
      },
      {
        subtitle: 'Data Security',
        text: 'We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. This includes secure file storage, encrypted digital records, access controls, and regular security assessments. Only our registered migration agents and authorised staff have access to your information. All staff members handling your documents are bound by confidentiality obligations and the MARA Code of Conduct.',
      },
      {
        subtitle: 'Data Retention',
        text: 'In accordance with OMARA requirements, we retain client records for a minimum of 7 years after the conclusion of our services. After this period, records are securely destroyed. You may request access to or correction of your personal information at any time.',
      },
      {
        subtitle: 'Third-Party Disclosure',
        text: 'We may disclose your personal information to: the Department of Home Affairs (DoHA), relevant skills assessing authorities, registered medical practitioners, police and character check agencies, professional translators and interpreters, and legal representatives (with your consent). All third parties are bound by confidentiality obligations.',
      },
      {
        subtitle: 'Overseas Disclosure',
        text: 'Some information may be disclosed to overseas recipients, including foreign government agencies and international organisations, as part of the visa application process. By engaging our services, you consent to such disclosures where necessary for your application.',
      },
      {
        subtitle: 'Electronic Communications',
        text: 'You acknowledge that electronic communications, including email, are not completely secure and may be intercepted, copied, recorded, read, interfered with, delayed, or not delivered. We will not be liable for any loss, harm, or damage suffered by you as a result of interception, unintentional disclosure, delay, non-delivery, or damage to your computer system.',
      },
      {
        subtitle: 'Your Rights',
        text: 'You have the right to: access your personal information, request corrections to inaccurate information, request deletion of your information (where applicable), opt out of marketing communications, and lodge a complaint about our privacy practices. To exercise these rights, contact us at info@visa2.au.',
      },
    ],
  },
  {
    id: 'terms',
    icon: FileText,
    title: 'Terms of Service',
    content: [
      {
        subtitle: 'About Our Company',
        text: 'Visa2AU Pty Ltd (ABN: 36 676 512 397) of Level 17, 1 Denison St, North Sydney NSW 2060, Australia, provides immigration assistance services. All migration agents are registered with the Office of the Migration Agents Registration Authority (OMARA) and comply with the MARA Code of Conduct under the Migration Act 1958 (Cth). Registration can be verified at https://portal.mara.gov.au/search-the-register-of-migration-agents/.',
      },
      {
        subtitle: 'Registered Migration Agents',
        text: 'Natalia (Natasha) Arens - MARN 0534230 (Director and Registered Migration Agent, NAATI Certified Translator CPN0VW21W). Sergey Vinnichenko - MARN 2418663 (Director and Registered Migration Agent).',
      },
      {
        subtitle: 'Professional Fees',
        text: 'Our professional fees are quoted in Australian Dollars (AUD) and include GST. They are separate from government visa application charges. Fees are disclosed in writing before engagement and may be payable in instalments. Government fees are subject to change without notice by the Department of Home Affairs. Additional work beyond the agreed scope is charged at $300 AUD + GST per hour.',
      },
      {
        subtitle: 'No Guarantee of Outcome',
        text: 'We cannot and do not guarantee that your visa application will be successful. Visa decisions are made solely by the Department of Home Affairs based on their assessment of your circumstances against legal requirements. Our role is to provide professional advice and assistance to give your application the best possible chance of success.',
      },
      {
        subtitle: 'Client Obligations',
        text: 'You agree to: provide complete, accurate, and truthful information at all times; disclose all relevant facts and circumstances; notify us immediately of any changes to your circumstances including changes in marital or relationship status, employment, address, criminal charges, health status, or family composition; respond to our communications within 5 business days; attend scheduled appointments; and pay fees as agreed. Providing false or misleading information may result in visa refusal and legal consequences.',
      },
      {
        subtitle: 'Staff Authorisation',
        text: 'You acknowledge and agree that administrative and clerical services may be provided by staff members under the direct supervision of the Registered Migration Agents. Document preparation tasks, including data entry, file organisation, document compilation, and administrative support, may be delegated to authorised personnel. All staff work is supervised and reviewed by a Registered Migration Agent who remains fully responsible for the quality and accuracy of all services provided.',
      },
      {
        subtitle: 'Refund Policy',
        text: 'If you terminate before work commences, you pay only for actual work provided. Any unearned fees will be refunded within 14 days. If you terminate after work has commenced, you pay for all work completed up to the date of termination. If we terminate, you pay only for work completed up to termination date. Government fees are not refundable.',
      },
      {
        subtitle: 'Limitation of Liability',
        text: 'To the extent permitted by law, our total aggregate liability to you for any claim relating to our services is limited to the total amount of professional fees you have paid to us, or AUD $15,000, whichever is greater. This limitation does not apply to fraud or willful misconduct, gross negligence, or breach of statutory obligations that cannot be excluded by law. We will not be liable for changes to immigration law or policy, decisions made by the Department of Home Affairs, actions taken by you in anticipation of visa grant, mistakes made by third parties, or delays in DoHA processing.',
      },
      {
        subtitle: 'Client Indemnification',
        text: 'You agree to indemnify and hold harmless Visa2AU Pty Ltd and its agents against all liabilities, expenses, damages, and costs arising from: inaccurate information provided by you; failure to disclose material facts or changes in circumstances; provision of false, forged, or fraudulent documents; actions taken by you in anticipation of visa grant; delays or errors caused by third parties engaged by you; and any breach by you of this agreement. This indemnification survives termination.',
      },
      {
        subtitle: 'Intellectual Property',
        text: 'Visa2AU Pty Ltd retains all copyright, intellectual property rights, and ownership in all materials, documents, templates, content, emails, messaging, phone calls, and video recordings prepared for or provided to you. Upon full payment of fees, you are granted a limited, non-exclusive, non-transferable licence to use the materials solely for the specific visa application covered by this agreement. You agree not to copy, reproduce, distribute, resell, modify, or create derivative works from the materials.',
      },
      {
        subtitle: 'Termination',
        text: 'You may terminate this agreement at any time by providing written notice. We may terminate this agreement: for breach (if you fail to remedy within 7 days); without cause (upon 7 days written notice, in accordance with Division 57 of the MARA Code of Conduct); or immediately if you provide false information or fraudulent documents. Upon termination, we will provide a Statement of Services within 7 days, you must pay all outstanding fees within 7 days, and we will return all documents within 14 days.',
      },
      {
        subtitle: 'Dispute Resolution',
        text: 'If you have a complaint, contact us directly via email at info@visa2.au. We will acknowledge receipt within 2 business days and provide a response within 14 business days. Regardless of this process, you may at any time contact OMARA (www.mara.gov.au/using-an-agent/complaints-against-agents/, 1300 881 995), ACCC (www.accc.gov.au/contact-us, 1300 302 502), or OAIC (www.oaic.gov.au/privacy/privacy-complaints, 1300 363 992). This agreement is governed by the laws of New South Wales, Australia.',
      },
    ],
  },
  {
    id: 'disclaimer',
    icon: AlertCircle,
    title: 'Disclaimer',
    content: [
      {
        subtitle: 'General Information Only',
        text: 'The information on this website is for general guidance only and does not constitute legal advice. Immigration laws, regulations, and policies change frequently. While we strive for accuracy, we recommend verifying current requirements with the Department of Home Affairs or booking a consultation with one of our registered migration agents for advice specific to your situation.',
      },
      {
        subtitle: 'No Client Relationship',
        text: 'Accessing this website or using our contact form does not establish a client-agent relationship. A formal client agreement must be signed and fees paid before we act on your behalf. Do not provide confidential or sensitive information through unsecured channels.',
      },
      {
        subtitle: 'Third-Party Links',
        text: 'Our website may contain links to third-party websites, including the Department of Home Affairs. We are not responsible for the content, privacy practices, or accuracy of information on third-party sites. Links are provided for convenience and do not imply endorsement.',
      },
    ],
  },
  {
    id: 'conduct',
    icon: Scale,
    title: 'Professional Conduct & OMARA Registration',
    content: [
      {
        subtitle: 'MARA Code of Conduct',
        text: 'All migration agents at Visa2AU are registered with the Office of the Migration Agents Registration Authority (OMARA) and are bound by the MARA Code of Conduct under the Migration Act 1958 (Cth). We act in your best interests, maintain professional competence, and provide services with honesty and integrity. We maintain professional indemnity insurance.',
      },
      {
        subtitle: 'Registered Migration Agents',
        text: 'Natalia (Natasha) Arens - MARN 0534230 (Director and Registered Migration Agent). Sergey Vinnichenko - MARN 2418663 (Director and Registered Migration Agent). MARN numbers can be verified at https://portal.mara.gov.au/search-the-register-of-migration-agents/',
      },
      {
        subtitle: 'Complaints',
        text: 'If you are dissatisfied with our services, please contact us directly to resolve the matter. If the issue cannot be resolved, you may lodge a complaint with OMARA at www.mara.gov.au/using-an-agent/complaints-against-agents/ (phone: 1300 881 995) or with the Office of the Australian Information Commissioner (OAIC) regarding privacy matters (phone: 1300 363 992).',
      },
      {
        subtitle: 'Services Not Included',
        text: 'Unless separately agreed in writing, the following are not included: appeals to the Administrative Review Tribunal (ART), judicial review proceedings in the Federal Court, ministerial intervention requests, skills assessments (we coordinate but you pay the assessing authority directly), health examinations (you arrange and pay directly), police clearances (you arrange and pay directly), translation services, legal advice on non-migration matters, representation at interviews or hearings, and any work required after visa refusal.',
      },
    ],
  },
];

const Terms = () => (
  <Layout>
    <section className="relative pt-32 pb-20 t-bg-body overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden="true" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Shield className="w-4 h-4 text-visa-gold" />
            <span className="t-text-primary text-sm font-medium">Legal & Privacy</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">
            Privacy Policy & <span className="text-gradient-gold">Terms of Service</span>
          </h1>
          <p className="t-text-muted max-w-2xl mx-auto">
            Visa2AU Pty Ltd (ABN: 36 676 512 397) is committed to protecting your privacy and providing transparent terms of service.
          </p>
          <p className="t-text-ghost text-sm mt-4">Last updated: {new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
    </section>

    {/* Quick Navigation */}
    <section className="py-6 t-bg-body border-b t-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-3">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="glass-card px-4 py-2 text-sm t-text-muted hover:text-visa-gold hover:border-visa-gold/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <s.icon className="w-4 h-4" />
              {s.title}
            </button>
          ))}
        </div>
      </div>
    </section>

    <section className="section-padding t-bg-body">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          {sections.map((section) => (
            <div key={section.id} id={section.id} className="glass-panel p-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-visa-gold/10 border border-visa-gold/20 flex items-center justify-center shrink-0">
                  <section.icon className="w-5 h-5 text-visa-gold" />
                </div>
                <h2 className="text-2xl font-bold t-text-primary">{section.title}</h2>
              </div>
              <div className="space-y-6">
                {section.content.map((item, i) => (
                  <div key={i}>
                    <h3 className="t-text-primary font-semibold mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-visa-gold shrink-0" />
                      {item.subtitle}
                    </h3>
                    <p className="t-text-muted text-sm leading-relaxed pl-4">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Contact Section */}
          <div className="glass-panel p-8 border-visa-gold/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-visa-gold/10 border border-visa-gold/20 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-visa-gold" />
              </div>
              <h2 className="text-2xl font-bold t-text-primary">Contact Us</h2>
            </div>
            <div className="space-y-3 text-sm">
              <p className="t-text-muted flex items-center gap-2">
                <MapPin className="w-4 h-4 text-visa-gold" />
                Level 17, 1 Denison St, North Sydney NSW 2060, Australia
              </p>
              <p className="t-text-muted flex items-center gap-2">
                <Mail className="w-4 h-4 text-visa-gold" />
                <a href="mailto:info@visa2.au" className="text-visa-gold hover:text-visa-goldLight">info@visa2.au</a>
              </p>
              <p className="t-text-muted flex items-center gap-2">
                <Phone className="w-4 h-4 text-visa-gold" />
                <a href="tel:+61291362462" className="text-visa-gold hover:text-visa-goldLight">+61 2 9136 2462</a>
              </p>
              <p className="t-text-muted flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-visa-gold" />
                OMARA: <a href="https://www.mara.gov.au" target="_blank" rel="noopener noreferrer" className="text-visa-gold hover:text-visa-goldLight">mara.gov.au</a>
              </p>
              <p className="t-text-muted flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-visa-gold" />
                OAIC (privacy complaints): <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" className="text-visa-gold hover:text-visa-goldLight">oaic.gov.au</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Terms;
