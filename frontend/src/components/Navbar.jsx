import { Link } from 'react-router-dom';
import './Navbar.css';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo-link">
          <span className="navbar-title">AgriVerse</span>
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/promotions" className="navbar-link">MarketPlace</Link>
        <Link to="/AgroMarket" className="navbar-link">Agro Marketplace</Link>
        <Link to="/consultants" className="navbar-link">Consulatation</Link>
        <Link to="/notifications" className="navbar-link">🔔</Link>
        <Link to="/dashboard" className="navbar-link">👤</Link>
        <Link to="/chatbot" className="navbar-link">ChatBot</Link>

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
