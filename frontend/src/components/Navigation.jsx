// components/Navigation.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authService } from '../services/auth';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(authService.isAuthenticated() && !authService.isTokenExpired());
    };
    
    checkAuth();
    
    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close mobile menu when resizing to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo/Brand */}
        <div className="nav-logo">
          <Link href="/" className="nav-logo-link">
            Alishba
          </Link>
        </div>

        {/* Navigation menu */}
        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link
              href="/"
              className={`nav-link ${pathname === '/' ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          
          {/* Show login/register or logout based on auth status */}
          {!isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link
                  href="/login"
                  className={`nav-link ${pathname === '/login' ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/register"
                  className={`nav-link ${pathname === '/register' ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link
                  href="/dashboard"
                  className={`nav-link ${pathname.startsWith('/dashboard') ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="nav-link nav-logout"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>

        {/* Mobile menu toggle - keeping for mobile responsiveness */}
        <button
          className={`nav-toggle ${isOpen ? 'active' : ''}`}
          id="mobile-menu"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;