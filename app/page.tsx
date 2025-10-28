'use client';
import React, { useState } from 'react';
import './Navbar.css';
import Link from 'next/link';
import Image from 'next/image';


const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className='hero'>
      <div className='my-nav'>
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <a href="/" onClick={closeMenu}>
        Paseo  
          </a>
        </div>

        {/* Navigation Menu */}
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <a href="#home" className="nav-link" onClick={closeMenu}>
              Home
            </a>
          </li>
          <li className="nav-item">
            <a href="#about" className="nav-link" onClick={closeMenu}>
              About
            </a>
          </li>
          <li className="nav-item">
            <a href="#services" className="nav-link" onClick={closeMenu}>
              Services
            </a>
          </li>
          <li className="nav-item">
            <a href="#portfolio" className="nav-link" onClick={closeMenu}>
              Portfolio
            </a>
          </li>
          <li className="nav-item">
            <a href="#contact" className="nav-link" onClick={closeMenu}>
              Contact
            </a>
          </li>
        </ul>

        {/* Call to Action Button */}
        <div className="nav-cta">
          <Link href='/signup' className="cta-button">Get Started</Link>
        </div>
        <div className="nav-toggle" onClick={toggleMenu}>
          <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
        </div>
      </div>
    </nav>
    </div>
   <main>
  <div className="content">
    <h1 className='h1'>Simple. Powerful. Consistent ticket management workflow.</h1>
    <p className='p-1'>
     Our ticket management system helps you stay organized, resolve issues faster, and keep every request in one place. From open to closed, every step is simple, transparent, and built to keep your team focused on what matters most.
    </p>
    <Link href='/signup' id='cta1' className="getStarted">Get Started</Link>
  </div>
<div className='wave-background'>
  <Image 
          src="/wave.svg" 
          alt="wave background" 
          fill 
          className='image'
          // style={{ objectFit: 'cover' }}
          priority
        />
        </div>
             <div className="decorative-circle circle-1"></div>
              <div className="decorative-circle circle-2"></div>

</main>
         <section className="features-section">
        <div className="container">
          <h2 className="features-title">Why Choose TicketMaster Pro?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                 <Image 
          src="/rocket_launch_24dp_A29E91_FILL0_wght400_GRAD0_opsz24.svg" 
          alt="rocket" 
          width={40}
          height={40}
          // style={{ objectFit: 'cover' }}
          priority
        />
              </div>
              <h3>Lightning Fast</h3>
              <p>Create and manage tickets in seconds with our intuitive interface</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                         <Image 
          src="analytics_24dp_A29E91_FILL0_wght400_GRAD0_opsz24.svg" 
          alt="rocket" 
          width={40}
          height={40}
          // style={{ objectFit: 'cover' }}
          priority
        />
              </div>
              <h3>Smart Analytics</h3>
              <p>Track performance with real-time dashboard and detailed reports</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                  <Image 
          src="/lock_24dp_A29E91_FILL0_wght400_GRAD0_opsz24.svg" 
          alt="rocket" 
          width={40}
          height={40}
          // style={{ objectFit: 'cover' }}
          priority
        />
              </div>
              <h3>Secure & Reliable</h3>
              <p>Your data is protected with enterprise-grade security measures</p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
             
              <span className="logo-text">Paseo</span>
            </div>
            <div className="footer-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="footer-copyright">
              © 2024 TicketMaster Pro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;