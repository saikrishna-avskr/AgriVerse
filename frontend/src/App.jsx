import React from "react";
import { Routes, Route } from "react-router-dom";
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
// import Navbar from "./components/Navbar"; 
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
    <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
  {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/AgroMarket" element={<AgroMarket />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/guidance" element={<GuidancePage />} />
          <Route path="/terrace" element={<Terrace />} />
          <Route path="/AR" element={<AR />} />
          <Route path="/crop-guidance" element={<CropGuidancePage />} />
          <Route path="/home-grower-guidance" element={<HomeGrowerGuidancePage />} />     
          <Route path="/promotions" element={<PromotionFormPage />} />
          <Route path="/agri-news" element={<AgriNews />} />
          <Route path="/crop-rotation" element={<CropRotation />} />
          <Route path="/yield-predictor" element={<YieldPredictor />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/chatbot" element={<ChatBotPage />} />
          <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
          <Route path="/consultants" element={<Consultants />} /> 
          <Route path="/be-consultant" element={<ConsultantForm />} />
        </Routes>
      </SignedIn>
<SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default App;
