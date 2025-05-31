import React from "react";
import { Routes, Route } from "react-router-dom";

// Importing all page components
import Home from "./pages/Home";
import GuidancePage from "./pages/GuidancePage";
import DiseaseDetectionPage from "./pages/DiseaseDetectionPage";
import AgroMarket from "./pages/AgroMarket";
import AR from "./pages/AR";
import PromotionFormPage from "./pages/PromotionFormPage";
import Terrace from "./pages/Terrace";
import AgriNews from "./pages/AgriNews";
import CropRotation from "./pages/CropRotation";
import YieldPredictor from "./pages/YieldPredictor";
import Weather from "./pages/Weather";
import ChatBotPage from "./pages/ChatBotPage";
import CropGuidancePage from "./pages/CropGuidancePage";
import HomeGrowerGuidancePage from "./pages/HomeGrowerGuidancePage";
import Consultants from "./pages/Consultants";
import ConsultantForm from "./pages/ConsultantForm";
import Agriverse from "./pages/Agriverse";

// import Navbar from "./components/Navbar";

// Clerk authentication components
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  RedirectToSignIn,
} from "@clerk/clerk-react";

// Placeholder components for routes under development
const Marketplace = () => <div>Agro Marketplace Coming Soon...</div>;
const Notifications = () => <div>Notifications Page</div>;
const UserDashboard = () => <div>User Dashboard</div>;

// Main App component
function App() {
  return (
    <>
      {/* Show sign-in button if user is signed out */}
      <SignedOut>
        <SignInButton />
      </SignedOut>

      {/* Show main app routes if user is signed in */}
      <SignedIn>
        {/* <Navbar /> Uncomment to enable navigation bar */}
        <Routes>
          {/* Define all application routes here */}
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/AgroMarket" element={<AgroMarket />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/guidance" element={<GuidancePage />} />
          <Route path="/terrace" element={<Terrace />} />
          <Route path="/AR" element={<AR />} />
          <Route path="/crop-guidance" element={<CropGuidancePage />} />
          <Route
            path="/home-grower-guidance"
            element={<HomeGrowerGuidancePage />}
          />
          <Route path="/promotions" element={<PromotionFormPage />} />
          <Route path="/agri-news" element={<AgriNews />} />
          <Route path="/crop-rotation" element={<CropRotation />} />
          <Route path="/yield-predictor" element={<YieldPredictor />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/chatbot" element={<ChatBotPage />} />
          <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
          <Route path="/consultants" element={<Consultants />} />
          <Route path="/be-consultant" element={<ConsultantForm />} />
          <Route path="/agri" element={<Agriverse />} />
        </Routes>
      </SignedIn>

      {/* Redirect to sign-in page if user is signed out */}
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default App;
