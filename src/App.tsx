
// This is a read-only file, so we'll update it carefully within our limits

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "@/components/ui/toaster";
import TabNavigation from "@/components/TabNavigation";
import Dashboard from "@/pages/Dashboard";
import Workouts from "@/pages/Workouts";
import Measurements from "@/pages/Measurements";
import Supplements from "@/pages/Supplements";
import Recovery from "@/pages/Recovery";
import Routines from "@/pages/Routines";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import WeeklyOverview from "@/pages/WeeklyOverview";

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/dashboard"
              element={
                <>
                  <Dashboard />
                  <TabNavigation />
                </>
              }
            />
            <Route
              path="/workouts"
              element={
                <>
                  <Workouts />
                  <TabNavigation />
                </>
              }
            />
            <Route
              path="/weekly"
              element={
                <>
                  <WeeklyOverview />
                  <TabNavigation />
                </>
              }
            />
            <Route
              path="/measurements"
              element={
                <>
                  <Measurements />
                  <TabNavigation />
                </>
              }
            />
            <Route
              path="/supplements"
              element={
                <>
                  <Supplements />
                  <TabNavigation />
                </>
              }
            />
            <Route
              path="/recovery"
              element={
                <>
                  <Recovery />
                  <TabNavigation />
                </>
              }
            />
            <Route
              path="/routines"
              element={
                <>
                  <Routines />
                  <TabNavigation />
                </>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
