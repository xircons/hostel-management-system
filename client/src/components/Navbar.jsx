import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo" aria-label="pppwtk">
            <img src="/img/logo.jpg" alt="pppwtk logo" className="logo-img" />
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-nav desktop-nav">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/rooms" 
              className={`nav-link ${isActive('/rooms') ? 'active' : ''}`}
            >
              Rooms
            </Link>
            <Link 
              to="/booking" 
              className={`nav-link ${isActive('/booking') ? 'active' : ''}`}
            >
              Book Now
            </Link>
            <Link 
              to="/login" 
              className={`nav-link ${isActive('/login') ? 'active' : ''}`}
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
          <Link 
            to="/" 
            className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/rooms" 
            className={`mobile-nav-link ${isActive('/rooms') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Rooms
          </Link>
          <Link 
            to="/booking" 
            className={`mobile-nav-link ${isActive('/booking') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Book Now
          </Link>
          <Link 
            to="/login" 
            className={`mobile-nav-link ${isActive('/login') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
