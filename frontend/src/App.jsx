import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GuidancePage from "./pages/GuidancePage";
import DiseaseDetectionPage from "./pages/DiseaseDetectionPage";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  RedirectToSignIn,
} from "@clerk/clerk-react";

// Placeholder components
const Marketplace = () => <div>Agro Marketplace Coming Soon...</div>;
const Notifications = () => <div>Notifications Page</div>;
const UserDashboard = () => <div>User Dashboard</div>;

function App() {
  return (
    <>
      <header
        style={{
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <SignedIn>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/guidance" element={<GuidancePage />} />
          <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
        </Routes>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default App;
