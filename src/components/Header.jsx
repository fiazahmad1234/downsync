// src/components/Header.jsx

import React, { useState } from 'react';

// Progley jaisa minimalistic Logo Component
const ProgleyLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
    <rect width="40" height="40" rx="10" fill="#0EA5E9"/>
    <path d="M12.5 13.5L19.5 20.5L12.5 27.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22.5 13.5L29.5 20.5L22.5 27.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5"/>
  </svg>
);

function Header() {
  const [activeLink, setActiveLink] = useState('Home');

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Registration', path: '/registration' },
    { name: 'Login', path: '/login' },
  ];

  return (
    // Is div main main tab changes hue hain
    <div className="relative z-50"> 
      {/* Header section with modern tweaks, fixed to top */}
      <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-100 transition-all duration-300 shadow-[0_1px_15px_-3px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Brand/Logo Section (Clean and Modern) */}
          <a href="/" className="flex items-center group">
            <ProgleyLogo />
            <h1 className="text-3xl font-extrabold text-[#0D1B2A] tracking-tighter group-hover:text-blue-600 transition-colors">
              React App
            </h1>
          </a>

          {/* Navigation Section (Clean & Minimal) */}
          <nav className="flex items-center gap-2">
            {navLinks.map((link, index) => (
              <a 
                key={index}
                href={link.path} 
                onClick={() => setActiveLink(link.name)}
                // Modern link styling with hover effects
                className={`text-sm font-medium px-4 py-2 rounded-lg relative overflow-hidden group
                  ${activeLink === link.name ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'} 
                  transition-all duration-300
                `}
              
              >
                {link.name}
                
                {/* Subtle hover underline effect */}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${activeLink === link.name ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </a>
            ))}
          </nav>

          {/* Call to Action Section (Similar to Progley's button) */}
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">
              Forgot Password?
            </a>
            <a href="/registration" className="bg-[#0EA5E9] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-sm hover:shadow-lg">
              Create Account
            </a>
          </div>

        </div>
      </header>

      {/* Ye spacer div bohot zaruri hai */}
      {/* Kyunki header main elements cover karega, spacer main content ko niche push karega */}
      <div className="h-[80px]"></div> {/* 80px is Header's approx height (py-4 is ~16px each side, text is 36px, padding adds up) */}
    </div>
  );
}

export default Header;