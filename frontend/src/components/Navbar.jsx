import { Link } from "react-router-dom"; // For navigation between routes
import "./Navbar.css"; // Navbar styling
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/clerk-react"; // Clerk authentication components

// Navbar component for site-wide navigation
const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Left section: Logo and title */}
      <div className="navbar-left">
        <Link to="/" className="navbar-logo-link">
          <span className="navbar-title">AgriVerse</span>
        </Link>
      </div>

      {/* Right section: Navigation links and authentication */}
      <div className="navbar-links">
        {/* Navigation links */}
        <Link to="/agri" className="navbar-link">
          MarketPlace
        </Link>
        <Link to="/promotions" className="navbar-link">
          Promotions
        </Link>
        <Link to="/AgroMarket" className="navbar-link">
          Agro Marketplace
        </Link>
        <Link to="/consultants" className="navbar-link">
          Consulatation
        </Link>
        <Link to="/chatbot" className="navbar-link">
          ChatBot
        </Link>

        {/* Show user button if signed in, otherwise show sign in button */}
        <SignedIn>
          <div className="user-button">
            <UserButton />
          </div>
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;
