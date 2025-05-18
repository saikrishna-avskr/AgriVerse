import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GuidancePage from "./pages/GuidancePage";
import DiseaseDetectionPage from "./pages/DiseaseDetectionPage";
import AgroMarket from "./pages/AgroMarket";
<<<<<<< HEAD
import PromotionForm from "./pages/PromotionForm";
import Terrace from "./pages/Terrace";
import AR from "./pages/AR";
=======
import PromotionFormPage from "./pages/PromotionFormPage";
import Terrace from "./pages/Terrace";
import AgriNews from "./pages/AgriNews";
import CropRotation from "./pages/CropRotation";
import YieldPredictor from "./pages/YieldPredictor";
import Weather from "./pages/Weather";
import ChatBotPage from "./pages/ChatBotPage";
>>>>>>> a056ec38c6655065e4e9e7ae59c0d21ac6296257
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
          <Route path="/AgroMarket" element={<AgroMarket />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/guidance" element={<GuidancePage />} />
          <Route path="/terrace" element={<Terrace />} />
<<<<<<< HEAD
          <Route path="/AR" element={<AR />} />
         <Route path="/promotions" element={<PromotionForm />} />

=======
          <Route path="/promotions" element={<PromotionFormPage />} />
          <Route path="/agri-news" element={<AgriNews />} />
          <Route path="/crop-rotation" element={<CropRotation />} />
          <Route path="/yield-predictor" element={<YieldPredictor />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/chatbot" element={<ChatBotPage />} />
          
>>>>>>> a056ec38c6655065e4e9e7ae59c0d21ac6296257
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
