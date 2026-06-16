import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';

// Only Home is eagerly loaded - all other routes are lazy-loaded
import Home from './pages/Home';

// Lazy-load all other pages for code splitting
const Visas = lazy(() => import('./pages/Visas'));
const VisitorVisa600 = lazy(() => import('./pages/VisitorVisa600'));
const SkillsInDemand482 = lazy(() => import('./pages/SkillsInDemand482'));
const EmployerNomination186 = lazy(() => import('./pages/EmployerNomination186'));
const PartnerVisa820 = lazy(() => import('./pages/PartnerVisa820'));
const PartnerVisa309 = lazy(() => import('./pages/PartnerVisa309'));
const ProspectiveMarriage300 = lazy(() => import('./pages/ProspectiveMarriage300'));
const ParentVisa103 = lazy(() => import('./pages/ParentVisa103'));
const WorkHoliday417 = lazy(() => import('./pages/WorkHoliday417'));
const Employers = lazy(() => import('./pages/Employers'));
const SkillsAssessment = lazy(() => import('./pages/SkillsAssessment'));
const Citizenship = lazy(() => import('./pages/Citizenship'));
const VisaRefusals = lazy(() => import('./pages/VisaRefusals'));
const SkilledRegional494 = lazy(() => import('./pages/SkilledRegional494'));
const SkilledIndependent189 = lazy(() => import('./pages/SkilledIndependent189'));
const ShortStay400 = lazy(() => import('./pages/ShortStay400'));
const BridgingVisas = lazy(() => import('./pages/BridgingVisas'));
const ProtectionVisa866 = lazy(() => import('./pages/ProtectionVisa866'));
const StudentVisa500 = lazy(() => import('./pages/StudentVisa500'));
const TrainingVisa407 = lazy(() => import('./pages/TrainingVisa407'));
const OurTeam = lazy(() => import('./pages/OurTeam'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Contact = lazy(() => import('./pages/Contact'));
const Terms = lazy(() => import('./pages/Terms'));
const Donations = lazy(() => import('./pages/Donations'));
const GeneralEnquiry = lazy(() => import('./pages/GeneralEnquiry'));
const Questionnaire = lazy(() => import('./pages/Questionnaire'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const AdminSubmissions = lazy(() => import('./pages/AdminSubmissions'));

// Scroll to top component on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Minimal loading fallback - no spinner to avoid layout shift
function PageLoader() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-body, #0a0f1c)' }} aria-hidden="true" />
  );
}

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/visas" element={<Visas />} />
          <Route path="/visas/visitor-visa-600" element={<VisitorVisa600 />} />
          <Route path="/visas/skills-in-demand-482" element={<SkillsInDemand482 />} />
          <Route path="/visas/employer-nomination-186" element={<EmployerNomination186 />} />
          <Route path="/visas/partner-visa-820" element={<PartnerVisa820 />} />
          <Route path="/visas/partner-visa-309" element={<PartnerVisa309 />} />
          <Route path="/visas/prospective-marriage-300" element={<ProspectiveMarriage300 />} />
          <Route path="/visas/parent-visa-103" element={<ParentVisa103 />} />
          <Route path="/visas/work-holiday-417" element={<WorkHoliday417 />} />
          <Route path="/visas/skilled-regional-494" element={<SkilledRegional494 />} />
          <Route path="/visas/skilled-independent-189" element={<SkilledIndependent189 />} />
          <Route path="/visas/short-stay-400" element={<ShortStay400 />} />
          <Route path="/visas/student-visa-500" element={<StudentVisa500 />} />
          <Route path="/visas/training-visa-407" element={<TrainingVisa407 />} />
          <Route path="/employers" element={<Employers />} />
          <Route path="/services/skills-assessments" element={<SkillsAssessment />} />
          <Route path="/services/citizenship" element={<Citizenship />} />
          <Route path="/services/visa-refusals" element={<VisaRefusals />} />
          <Route path="/services/bridging-visas" element={<BridgingVisas />} />
          <Route path="/services/protection-visa-866" element={<ProtectionVisa866 />} />
          <Route path="/our-team" element={<OurTeam />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/forms/general-enquiry" element={<GeneralEnquiry />} />
          <Route path="/forms/questionnaire" element={<Questionnaire />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/admin/submissions" element={<AdminSubmissions />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
