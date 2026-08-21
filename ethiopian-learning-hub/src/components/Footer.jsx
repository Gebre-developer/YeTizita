import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-500 py-8 border-t border-slate-900/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-xs tracking-wide space-y-1">
        <p>
          &copy; {new Date().getFullYear()} Ethiopian Learning Hub. All Rights
          Reserved.
        </p>
        <p className="text-slate-600 font-light">
          Empowering local minds for global technical markets.
        </p>
      </div>
    </footer>
  );
};

// This line allows App.jsx to import it cleanly without runtime crashes
export default Footer;
