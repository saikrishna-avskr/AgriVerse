import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo-link">
          <img src={logo} alt="AgriVerse Logo" className="navbar-logo" />
          <span className="navbar-title">AgriVerse</span>
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/agrifeed" className="navbar-link">AgriFeed</Link>
        <Link to="/AgroMarket" className="navbar-link">Agro Marketplace</Link>
        <Link to="/notifications" className="navbar-link">🔔</Link>
        <Link to="/dashboard" className="navbar-link">👤</Link>
      </div>
    </nav>
  );
};

export default Navbar;
