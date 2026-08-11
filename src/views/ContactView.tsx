import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, GraduationCap } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-8 rounded-2xl shadow-xl space-y-3 border border-blue-900/40">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
          Contact Platform Administration
        </span>
        <h1 className="text-2xl sm:text-4xl font-black">Get in Touch with KDLH</h1>
        <p className="text-xs sm:text-sm text-blue-200 max-w-2xl">
          Have questions, resource suggestions, or technical support requests for Kizimba Digital Learning Hub?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Contact Form */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-md space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Send Message to KDLH Team</h3>

          {submitted && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Thank you! Your message has been sent to school administration.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
            <div>
              <label className="block text-slate-700 mb-1">Your Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Baraka John"
                required
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Email or Phone Number</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@kizimba.ac.tz or +255..."
                required
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Message / Inquiry</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your feedback or question..."
                required
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs h-28"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-sm"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>

        {/* Contact Info Box */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 shadow-md space-y-4">
            <h3 className="text-lg font-bold text-amber-400">Kizimba Secondary School</h3>
            
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span>Kizimba Secondary School, Bukoba, Kagera Region, Tanzania</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>info@kizimba.ac.tz</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>+255 754 000 111</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-xs space-y-2">
            <h4 className="font-bold text-slate-900 uppercase text-blue-700">Platform Founder</h4>
            <p className="text-slate-700">
              Founded & Developed by <strong>ISAACK EDWARD LUNGWA</strong>
            </p>
            <p className="text-slate-500">
              Founder & Creator of Kizimba Digital Learning Hub (KDLH).
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
