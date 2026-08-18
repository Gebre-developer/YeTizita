import { useState } from 'react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleMessageSend = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      
      {/* Informational Column */}
      <div className="space-y-6">
        <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          Get in Touch
        </span>
        <h1 className="text-4xl font-black text-white tracking-tight">Need assistance? Contact our team.</h1>
        <p className="text-slate-400 leading-relaxed text-sm md:text-base">
          Have queries regarding structural syllabus sequences, profile authorization blockers, or enterprise training paths? Contact us directly.
        </p>

        <div className="space-y-4 pt-4">
          <div className="flex items-center space-x-4">
            <span className="text-xl bg-slate-900 p-3 rounded-xl border border-slate-800">📍</span>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Main Headquarters Campus</p>
              <p className="text-sm font-semibold text-white">Bole Sub-City, Addis Ababa, Ethiopia</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xl bg-slate-900 p-3 rounded-xl border border-slate-800">✉️</span>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Inquiry Channels</p>
              <p className="text-sm font-semibold text-white">support@ethiopianlearninghub.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Communications Form Canvas Wrapper */}
      <div className="glass-card p-8 rounded-3xl transition duration-300 hover:border-slate-800">
        <form onSubmit={handleMessageSend} className="space-y-5">
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Full Name</label>
            <input type="text" required placeholder="Abebe Balcha" className="glass-input" />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
            <input type="email" required placeholder="name@domain.com" className="glass-input" />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Detailed Message Message Description</label>
            <textarea rows="4" required placeholder="Describe your request in detail..." className="glass-input resize-none"></textarea>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:brightness-110 text-white font-bold py-3.5 rounded-xl transition duration-300 text-sm uppercase tracking-wider shadow-md">
            Send Message Securely
          </button>

          {submitted && (
            <p className="text-emerald-400 text-xs font-medium text-center animate-pulse pt-2">
              ✓ Message dispatched successfully! Our team will respond shortly.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contact;
