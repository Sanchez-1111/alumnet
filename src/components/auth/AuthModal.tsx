import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  MapPin,
  BookOpen,
  Calendar,
  Shield,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useAlumni } from '../../context/AlumniContext';
import { UserRole } from '../../types';

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { login, register, users } = useAlumni();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('alumni');
  const [batch, setBatch] = useState('2022');
  const [course, setCourse] = useState('B.S. Computer Science');
  const [location, setLocation] = useState('San Francisco, CA');
  const [headline, setHeadline] = useState('Software Engineer & Alum');

  const [resetSent, setResetSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please provide both email and password');
      return;
    }
    const success = login(email, password);
    if (success) {
      onClose();
    } else {
      setErrorMsg('Account not found or invalid password.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setErrorMsg('Please complete all required fields');
      return;
    }
    register({
      email,
      password,
      name,
      role,
      batch,
      course,
      location,
      headline
    });
    onClose();
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setMode('login');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-md max-h-[95vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-6 pb-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white"
          >
            ✕
          </button>
          <div className="relative mx-auto mb-2 w-14 h-14">
            <img
              src="/assets/cecilians-seal.jpg"
              alt="St. Cecilia's Seal"
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover border-2 border-white/40 shadow-md"
            />
          </div>
          <h2 className="text-xl font-bold">St. Cecilia's Alumni Network</h2>
          <p className="text-xs text-blue-100 mt-0.5">
            {mode === 'login'
              ? 'Sign in to access your alumni hub'
              : mode === 'register'
              ? 'Join the official global alumni network'
              : 'Recover your account password'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 border border-red-200">
              {errorMsg}
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alumni@university.edu"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-stone-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 text-xs"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2 text-stone-500">
                New alumnus or faculty member?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg('');
                  }}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Create Account
                </button>
              </div>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Account Role *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-semibold uppercase text-stone-700"
                  >
                    <option value="alumni">Alumni</option>
                    <option value="admin">Admin</option>
                    <option value="registrar">Registrar</option>
                    <option value="staff">Staff</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Graduation Batch *</label>
                  <input
                    type="text"
                    required
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    placeholder="2023"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Course / Degree *</label>
                <input
                  type="text"
                  required
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="B.S. Computer Science"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Seattle, WA"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Product Manager"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.chen@alumni.edu"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition-colors mt-2"
              >
                Register Alumni Profile
              </button>

              <div className="text-center pt-2 text-stone-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                  }}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleReset} className="space-y-4">
              {resetSent ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="font-bold">Password Reset Dispatched</p>
                  <p className="text-xs text-emerald-700 mt-1">
                    Check your email inbox for instructions to reset your account credentials.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-stone-600 leading-relaxed">
                    Enter the email associated with your alumni profile. We will email you a secure link to reset your password.
                  </p>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@alumni.edu"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs"
                  >
                    Send Recovery Link
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-stone-500 hover:text-stone-800"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
