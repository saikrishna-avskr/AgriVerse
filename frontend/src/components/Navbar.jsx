import { Link } from 'react-router-dom';
import './Navbar.css'; // Import custom styles
import logo from '../assets/logo.png'; // Adjust if path differs

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="AgriVerse Logo" className="navbar-logo" />
        <span className="navbar-title">AgriVerse</span>
      </div>
      <div className="navbar-links">
        <Link to="/marketplace">Agro Marketplace</Link>
        <Link to="/notifications">🔔</Link>
        <Link to="/dashboard">👤</Link>
      </div>
    </nav>
  );
};

export default Navbar;
