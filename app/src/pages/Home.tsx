import { lazy, Suspense } from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';

// Lazy-load all sections below the fold
const StatsStrip = lazy(() => import('../components/StatsStrip'));
const AudienceCards = lazy(() => import('../components/AudienceCards'));
const UrgentHelp = lazy(() => import('../components/UrgentHelp'));
const VisaGrid = lazy(() => import('../components/VisaGrid'));
const WhyChooseUs = lazy(() => import('../components/WhyChooseUs'));
const TeamSection = lazy(() => import('../components/TeamSection'));
const ProcessSteps = lazy(() => import('../components/ProcessSteps'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const ContactSection = lazy(() => import('../components/ContactSection'));
const FAQSection = lazy(() => import('../components/FAQSection'));

// Invisible placeholder to prevent layout shift
const SectionPlaceholder = () => (
  <div style={{ minHeight: '60vh' }} aria-hidden="true" />
);

const Home = () => (
  <Layout>
    <Hero />
    <Suspense fallback={<SectionPlaceholder />}>
      <StatsStrip />
    </Suspense>
    <Suspense fallback={<SectionPlaceholder />}>
      <AudienceCards />
    </Suspense>
    <Suspense fallback={<SectionPlaceholder />}>
      <UrgentHelp />
    </Suspense>
    <Suspense fallback={<SectionPlaceholder />}>
      <VisaGrid />
    </Suspense>
    <Suspense fallback={<SectionPlaceholder />}>
      <WhyChooseUs />
    </Suspense>
    <Suspense fallback={<SectionPlaceholder />}>
      <TeamSection />
    </Suspense>
    <Suspense fallback={<SectionPlaceholder />}>
      <ProcessSteps />
    </Suspense>
    <Suspense fallback={<SectionPlaceholder />}>
      <Testimonials />
    </Suspense>
    <Suspense fallback={<SectionPlaceholder />}>
      <ContactSection />
    </Suspense>
    <Suspense fallback={<SectionPlaceholder />}>
      <FAQSection />
    </Suspense>
  </Layout>
);

export default Home;
