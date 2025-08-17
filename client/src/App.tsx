import { Switch, Route } from "wouter";
// import ExternalSite from "@/pages/ExternalSite";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NavBar from "@/components/ui/NavBar";
import Assessment from "@/pages/assessment";
import Routines from "@/pages/routines";
import Poses from "@/pages/poses";
import StartRoutine from "@/pages/start-routine";
import PoseDetails from "@/pages/pose-details";
import Login from "@/pages/login";
import SignUp from "@/pages/signup";
import NotFound from "@/pages/not-found";
import Profile from "@/pages/profile";
import LiveDetection from "@/pages/live-detection";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/assessment" component={Assessment} />
      <Route path="/routines" component={Routines} />
      <Route path="/poses" component={Poses} />
      <Route path="/start-routine" component={StartRoutine} />
      <Route path="/pose/:slug" component={PoseDetails} />
      <Route path="/profile" component={Profile} />
  <Route path="/live-detection" component={LiveDetection} />
      {/* <Route path="/external-site" component={ExternalSite} /> */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <NavBar />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
