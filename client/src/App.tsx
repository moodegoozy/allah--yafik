import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import AuthGuard from "./components/AuthGuard";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Tracker from "./pages/Tracker";
import Recovery from "./pages/Recovery";
import Exercises from "./pages/Exercises";
import Statistics from "./pages/Statistics";
import Community from "./pages/Community";
import Resources from "./pages/Resources";
import Partners from "./pages/Partners";
import Lectures from "./pages/Lectures";
import LectureView from "./pages/LectureView";
import Achievements from "./pages/Achievements";
import Assessment from "./pages/Assessment";
import SuccessStories from "./pages/SuccessStories";
import JoinPartner from "./pages/JoinPartner";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Account from "./pages/Account";
import AdminDashboard from "./pages/AdminDashboard";
import Chat from "./pages/Chat";
import RehabPlan from "./pages/RehabPlan";
import RehabAssessment from "./pages/RehabAssessment";
import MentalHealthTest from "./pages/MentalHealthTest";
import Settings from "./pages/Settings";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import SOSButton from "./components/SOSButton";
import BottomNav from "./components/BottomNav";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/tracker" component={Tracker} />
      <Route path="/recovery" component={Recovery} />
      <Route path="/exercises" component={Exercises} />
      <Route path="/statistics" component={Statistics} />
      <Route path="/community" component={Community} />
      <Route path="/resources" component={Resources} />
      <Route path="/partners" component={Partners} />
      <Route path="/lectures" component={Lectures} />
      <Route path="/lectures/:id" component={LectureView} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/assessment" component={Assessment} />
      <Route path="/success-stories" component={SuccessStories} />
      <Route path="/join-partner" component={JoinPartner} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/login" component={Login} />
      <Route path="/account" component={Account} />
      <Route path="/settings" component={Settings} />
      <Route path="/admin" component={AdminDashboard} />
      {/* <Route path="/chat" component={Chat} /> */}
      <Route path="/rehab-plan" component={RehabPlan} />
      <Route path="/rehab-assessment" component={RehabAssessment} />
      <Route path="/mental-health-test" component={MentalHealthTest} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsConditions} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster richColors position="top-center" />
          <AuthGuard>
            <Router />
          </AuthGuard>
          <BottomNav />
          <SOSButton />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
