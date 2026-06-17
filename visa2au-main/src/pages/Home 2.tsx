import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import StatsStrip from '../components/StatsStrip';
import AudienceCards from '../components/AudienceCards';
import VisaGrid from '../components/VisaGrid';
import WhyChooseUs from '../components/WhyChooseUs';
import TeamSection from '../components/TeamSection';
import ProcessSteps from '../components/ProcessSteps';
import Testimonials from '../components/Testimonials';
import PricingSection from '../components/PricingSection';
import ContactSection from '../components/ContactSection';
import FAQSection from '../components/FAQSection';

const Home = () => {
  return (
    <Layout>
      <Hero />
      <StatsStrip />
      <AudienceCards />
      <VisaGrid />
      <WhyChooseUs />
      <TeamSection />
      <ProcessSteps />
      <Testimonials />
      <PricingSection />
      <ContactSection />
      <FAQSection />
    </Layout>
  );
};

export default Home;