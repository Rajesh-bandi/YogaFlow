import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Assessment from "@/pages/assessment";
import Routines from "@/pages/routines";
import Poses from "@/pages/poses";
import StartRoutine from "@/pages/start-routine";
import PoseDetails from "@/pages/pose-details";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/assessment" component={Assessment} />
      <Route path="/routines" component={Routines} />
      <Route path="/poses" component={Poses} />
      <Route path="/start-routine" component={StartRoutine} />
      <Route path="/pose/:id" component={PoseDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
