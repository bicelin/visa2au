import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Pages
import Home from './pages/Home';
import Visas from './pages/Visas';
import VisitorVisa600 from './pages/VisitorVisa600';
import SkillsInDemand482 from './pages/SkillsInDemand482';
import EmployerNomination186 from './pages/EmployerNomination186';
import PartnerVisa820 from './pages/PartnerVisa820';
import PartnerVisa309 from './pages/PartnerVisa309';
import ProspectiveMarriage300 from './pages/ProspectiveMarriage300';
import ParentVisa103 from './pages/ParentVisa103';
import WorkHoliday417 from './pages/WorkHoliday417';
import Employers from './pages/Employers';
import SkillsAssessment from './pages/SkillsAssessment';
import Citizenship from './pages/Citizenship';
import VisaRefusals from './pages/VisaRefusals';
import OurTeam from './pages/OurTeam';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Donations from './pages/Donations';
import GeneralEnquiry from './pages/GeneralEnquiry';
import Questionnaire from './pages/Questionnaire';
import Blog from './pages/Blog';

// Scroll to top component on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Visas Hub */}
        <Route path="/visas" element={<Visas />} />

        {/* Visa Detail Pages */}
        <Route path="/visas/visitor-visa-600" element={<VisitorVisa600 />} />
        <Route path="/visas/skills-in-demand-482" element={<SkillsInDemand482 />} />
        <Route path="/visas/employer-nomination-186" element={<EmployerNomination186 />} />
        <Route path="/visas/partner-visa-820" element={<PartnerVisa820 />} />
        <Route path="/visas/partner-visa-309" element={<PartnerVisa309 />} />
        <Route path="/visas/prospective-marriage-300" element={<ProspectiveMarriage300 />} />
        <Route path="/visas/parent-visa-103" element={<ParentVisa103 />} />
        <Route path="/visas/work-holiday-417" element={<WorkHoliday417 />} />

        {/* Employers */}
        <Route path="/employers" element={<Employers />} />

        {/* Services */}
        <Route path="/services/skills-assessments" element={<SkillsAssessment />} />
        <Route path="/services/citizenship" element={<Citizenship />} />
        <Route path="/services/visa-refusals" element={<VisaRefusals />} />

        {/* Our Team (Combined Page) */}
        <Route path="/our-team" element={<OurTeam />} />

        {/* Static Pages */}
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/donations" element={<Donations />} />
        <Route path="/forms/general-enquiry" element={<GeneralEnquiry />} />
        <Route path="/forms/questionnaire" element={<Questionnaire />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
