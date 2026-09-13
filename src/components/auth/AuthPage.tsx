import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  Briefcase,
  Building,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  School,
  Clock,
  ShieldAlert,
  KeyRound,
  Check,
  Copy,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { useAlumni } from '../../context/AlumniContext';
import { UserRole, UserProfile } from '../../types';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface AuthPageProps {
  initialMode?: 'login' | 'register' | 'forgot';
  onLoginSuccess?: (role: string) => void;
  onBackToApp?: () => void;
}

// Local storage keys for persistent login rate-limiting / lockout timer
const LOCKOUT_STORAGE_KEYS = {
  UNTIL: 'sc_alumni_login_lockout_until',
  ATTEMPTS: 'sc_alumni_login_failed_attempts',
  CYCLE: 'sc_alumni_login_lockout_cycle'
};

// Lockout duration math:
// First 1-3 attempts = 1 min (60s)
// Subsequent 1-3 attempts = +2 mins each trial (Trial 2 = 3m, Trial 3 = 5m, etc.)
const getLockoutDurationSeconds = (cycle: number): number => {
  return (1 + Math.max(0, cycle - 1) * 2) * 60;
};

const formatSecondsToMMSS = (totalSeconds: number): string => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onLoginSuccess,
  onBackToApp
}) => {
  const { login, register, users, resetUserPasswordByEmail, loginWithGoogle } = useAlumni();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [loginMethod, setLoginMethod] = useState<'email' | 'studentId'>('email');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [staySignedIn, setStaySignedIn] = useState(true);
  const [loginError, setLoginError] = useState('');

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(initialMode === 'forgot');
  const [forgotEmail, setForgotEmail] = useState('');

  const handleOpenForgotPassword = () => {
    if (loginIdentifier && loginIdentifier.includes('@')) {
      setForgotEmail(loginIdentifier.trim());
    }
    setShowForgotModal(true);
  };

  const handlePasswordResetSuccess = (email: string, newPassword?: string) => {
    // Clear any lockout constraints upon identity verification & password reset
    try {
      localStorage.removeItem(LOCKOUT_STORAGE_KEYS.UNTIL);
      localStorage.removeItem(LOCKOUT_STORAGE_KEYS.ATTEMPTS);
      localStorage.removeItem(LOCKOUT_STORAGE_KEYS.CYCLE);
    } catch {
      // ignore
    }
    setFailedAttempts(0);
    setLockoutCycle(1);
    setLockoutSecondsRemaining(0);
    setLoginError('');

    // Prepopulate sign-in form with newly reset credentials
    setLoginMethod('email');
    setLoginIdentifier(email);
    if (newPassword) {
      setLoginPassword(newPassword);
    }
    setShowForgotModal(false);
  };

  // Failed login rate-limiting / lockout timer state
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCKOUT_STORAGE_KEYS.ATTEMPTS);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [lockoutCycle, setLockoutCycle] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCKOUT_STORAGE_KEYS.CYCLE);
      return saved ? Math.max(1, parseInt(saved, 10)) : 1;
    } catch {
      return 1;
    }
  });

  const [lockoutSecondsRemaining, setLockoutSecondsRemaining] = useState<number>(() => {
    try {
      const savedUntil = localStorage.getItem(LOCKOUT_STORAGE_KEYS.UNTIL);
      if (!savedUntil) return 0;
      const untilMs = parseInt(savedUntil, 10);
      const diff = Math.ceil((untilMs - Date.now()) / 1000);
      return diff > 0 ? diff : 0;
    } catch {
      return 0;
    }
  });

  // Countdown timer effect for login lockout
  useEffect(() => {
    if (lockoutSecondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setLockoutSecondsRemaining((prev) => {
        if (prev <= 1) {
          try {
            localStorage.removeItem(LOCKOUT_STORAGE_KEYS.UNTIL);
          } catch {
            // ignore
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutSecondsRemaining]);

  const isLockedOut = lockoutSecondsRemaining > 0;

  // Registration multi-step state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>('alumni');

  // Step 1: Account Details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step1Error, setStep1Error] = useState('');

  // Step 2: Role-specific details
  const [studentId, setStudentId] = useState('');
  const [batch, setBatch] = useState('2024');
  const [course, setCourse] = useState('B.S. Information Technology');
  const [location, setLocation] = useState('Cebu, Philippines');
  const [headline, setHeadline] = useState('');
  const [phone, setPhone] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('College of Computer Studies');
  const [designation, setDesignation] = useState('');
  const [step2Error, setStep2Error] = useState('');

  // Step 3: Terms & Agreement
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // Password requirements validation
  const hasMinLength = regPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(regPassword);
  const hasNumber = /[0-9]/.test(regPassword);
  const isPasswordValid = hasMinLength && hasUppercase && hasNumber;

  // Handle Login submission with strict rate-limiting and progressive lockout timers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (isLockedOut) {
      setLoginError(
        `Account temporarily locked due to failed attempts. Please wait ${formatSecondsToMMSS(
          lockoutSecondsRemaining
        )} before attempting to sign in again.`
      );
      return;
    }

    if (!loginIdentifier.trim()) {
      setLoginError(loginMethod === 'email' ? 'Please enter your email address.' : 'Please enter your Student ID.');
      return;
    }

    const trimmed = loginIdentifier.trim().toLowerCase();
    const matchedUser = users.find(
      (u) =>
        u.email.toLowerCase() === trimmed ||
        (u.studentId && u.studentId.toLowerCase() === trimmed) ||
        (u.employeeId && u.employeeId.toLowerCase() === trimmed)
    );

    const success = login(loginIdentifier.trim(), loginPassword);
    if (success) {
      // Clear all lockout state on successful authentication
      try {
        localStorage.removeItem(LOCKOUT_STORAGE_KEYS.UNTIL);
        localStorage.removeItem(LOCKOUT_STORAGE_KEYS.ATTEMPTS);
        localStorage.removeItem(LOCKOUT_STORAGE_KEYS.CYCLE);
      } catch {
        // ignore
      }
      setFailedAttempts(0);
      setLockoutCycle(1);
      setLockoutSecondsRemaining(0);

      const userRole = matchedUser?.role || 'alumni';
      if (onLoginSuccess) {
        onLoginSuccess(userRole);
      } else if (onBackToApp) {
        onBackToApp();
      }
    } else {
      // Failed login attempt tracking
      const newAttempts = failedAttempts + 1;

      if (newAttempts >= 3) {
        // Reached 3 failed attempts in current trial -> trigger lockout
        const durationSec = getLockoutDurationSeconds(lockoutCycle);
        const untilMs = Date.now() + durationSec * 1000;
        const nextCycle = lockoutCycle + 1;

        try {
          localStorage.setItem(LOCKOUT_STORAGE_KEYS.UNTIL, untilMs.toString());
          localStorage.setItem(LOCKOUT_STORAGE_KEYS.ATTEMPTS, '0');
          localStorage.setItem(LOCKOUT_STORAGE_KEYS.CYCLE, nextCycle.toString());
        } catch {
          // ignore
        }

        setLockoutSecondsRemaining(durationSec);
        setFailedAttempts(0);
        setLockoutCycle(nextCycle);
        setLoginError('');
      } else {
        // 1st or 2nd failed attempt in current trial
        setFailedAttempts(newAttempts);
        try {
          localStorage.setItem(LOCKOUT_STORAGE_KEYS.ATTEMPTS, newAttempts.toString());
        } catch {
          // ignore
        }
        const trialDurationMins = Math.round(getLockoutDurationSeconds(lockoutCycle) / 60);
        const attemptsRemaining = 3 - newAttempts;
        setLoginError(
          `Invalid email/Student ID or password. (${newAttempts} of 3 attempts used). Warning: ${attemptsRemaining} attempt${
            attemptsRemaining > 1 ? 's' : ''
          } remaining before a ${trialDurationMins}-minute account lockout.`
        );
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setLoginError('');
    try {
      const success = await loginWithGoogle();
      if (success) {
        try {
          localStorage.removeItem(LOCKOUT_STORAGE_KEYS.UNTIL);
          localStorage.removeItem(LOCKOUT_STORAGE_KEYS.ATTEMPTS);
          localStorage.removeItem(LOCKOUT_STORAGE_KEYS.CYCLE);
        } catch {
          // ignore
        }
        setFailedAttempts(0);
        setLockoutCycle(1);
        setLockoutSecondsRemaining(0);

        if (onLoginSuccess) {
          onLoginSuccess('alumni');
        } else if (onBackToApp) {
          onBackToApp();
        }
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Failed to sign in with Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Step 1 Validation
  const handleNextToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep1Error('');

    if (!firstName.trim() || !lastName.trim()) {
      setStep1Error('First and Last Name are required.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setStep1Error('A valid email address is required.');
      return;
    }
    if (!isPasswordValid) {
      setStep1Error('Please ensure password satisfies all security requirements.');
      return;
    }
    if (regPassword !== confirmPassword) {
      setStep1Error('Passwords do not match.');
      return;
    }

    setStep(2);
  };

  // Step 2 Validation
  const handleNextToStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep2Error('');

    if (selectedRole === 'alumni') {
      if (!course.trim()) {
        setStep2Error('Please provide your Degree or Program.');
        return;
      }
    } else {
      if (!department.trim()) {
        setStep2Error('Department / Office assignment is required.');
        return;
      }
    }

    setStep(3);
  };

  // Step 3 Submit Registration
  const handleCompleteRegistration = () => {
    if (!agreedToTerms) {
      alert('Please agree to the Cecilian Honor Code and Portal Terms.');
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const generatedHeadline = headline.trim() || (selectedRole === 'alumni' ? `${course} Graduate • Class of ${batch}` : `${designation || selectedRole.toUpperCase()} • ${department}`);

    register({
      name: fullName,
      email: regEmail.trim(),
      password: regPassword,
      role: selectedRole,
      batch: selectedRole === 'alumni' ? batch : 'N/A',
      course: selectedRole === 'alumni' ? course : department,
      location: location.trim() || 'Cebu, Philippines',
      headline: generatedHeadline,
      phone: phone.trim() || '+63 917 123 4567',
      studentId: selectedRole === 'alumni' ? (studentId.trim() || `SC-${batch}-${Math.floor(1000 + Math.random() * 9000)}`) : undefined,
      employeeId: selectedRole !== 'alumni' ? (employeeId.trim() || `EMP-${Date.now().toString().slice(-4)}`) : undefined,
      department: selectedRole !== 'alumni' ? department : undefined
    });

    setRegistrationComplete(true);
    setTimeout(() => {
      if (onLoginSuccess) {
        onLoginSuccess(selectedRole);
      } else if (onBackToApp) {
        onBackToApp();
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex bg-stone-900 text-stone-800 font-sans">
      
      {/* ================= LEFT HALF: DARK ARCHITECTURE HERO ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 text-white overflow-hidden">
        {/* Background Image with Dark Vignette - St. Cecilia's College Building Photo */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/landing-building-2.jpg"
            alt="St. Cecilia's College Architecture"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-45 filter contrast-110 brightness-80 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/50" />
        </div>

        {/* Top Bar: Back Button */}
        <div className="relative z-10">
          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="inline-flex items-center gap-1.5 text-stone-300 hover:text-white text-xs font-semibold tracking-wider uppercase transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Public Page</span>
            </button>
          )}
        </div>

        {/* Center Hero Content */}
        <div className="relative z-10 max-w-lg my-auto py-8">
          {/* Eyebrow with Team Seal */}
          <div className="flex items-center gap-2.5 mb-4">
            <img
              src="/assets/cecilians-seal.jpg"
              alt="Alumni Cecilian's Logo"
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover border border-white/20 shadow-sm"
            />
            <span className="w-5 h-[2px] bg-[#991B1B]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#fca5a5]">
              ST. CECILIA'S • ALUMNI
            </span>
          </div>

          {/* Large Serif Heading */}
          <h1 className="font-serif text-5xl xl:text-6xl font-normal text-white tracking-tight leading-[1.1] mb-5">
            {mode === 'login' ? 'Welcome Back.' : 'Join the Network.'}
          </h1>

          {/* Subtitle */}
          <p className="text-stone-300 text-base xl:text-lg leading-relaxed font-light mb-8">
            {mode === 'login'
              ? 'Sign in to access your alumni network, events, and career opportunities.'
              : "Apply for exclusive access to the St. Cecilia's alumni community."}
          </p>

          {/* Stepper (Only on Register Mode) */}
          {mode === 'register' && (
            <div className="space-y-4 pt-4 border-t border-white/10 max-w-xs">
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === 1
                      ? 'bg-white text-stone-950 shadow-md'
                      : step > 1
                      ? 'bg-[#8B181B] text-white'
                      : 'border border-white/40 text-white/50'
                  }`}
                >
                  {step > 1 ? '✓' : '1'}
                </div>
                <span
                  className={`text-sm font-medium ${
                    step === 1 ? 'text-white font-bold' : step > 1 ? 'text-stone-300' : 'text-stone-500'
                  }`}
                >
                  Account
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === 2
                      ? 'bg-white text-stone-950 shadow-md'
                      : step > 2
                      ? 'bg-[#8B181B] text-white'
                      : 'border border-white/40 text-white/50'
                  }`}
                >
                  {step > 2 ? '✓' : '2'}
                </div>
                <span
                  className={`text-sm font-medium ${
                    step === 2 ? 'text-white font-bold' : step > 2 ? 'text-stone-300' : 'text-stone-500'
                  }`}
                >
                  Personal Info
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === 3
                      ? 'bg-white text-stone-950 shadow-md'
                      : 'border border-white/40 text-white/50'
                  }`}
                >
                  3
                </div>
                <span
                  className={`text-sm font-medium ${
                    step === 3 ? 'text-white font-bold' : 'text-stone-500'
                  }`}
                >
                  Review
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Notes */}
        <div className="relative z-10 text-xs text-stone-400 font-light flex items-center gap-2">
          <span>St. Cecilia's College Global Alumni Association</span>
          <span>•</span>
          <span>Institutional Portal</span>
        </div>
      </div>

      {/* ================= RIGHT HALF: CLEAN WHITE FORM ================= */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-6 sm:px-12 xl:px-20 py-12 overflow-y-auto max-h-screen">
        
        {/* Mobile Header (When screen is small) */}
        <div className="lg:hidden mb-6 pb-4 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/assets/cecilians-seal.jpg"
                alt="Alumni Cecilian's Logo"
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-stone-200"
              />
              <span className="text-xs font-bold uppercase tracking-wider text-[#991B1B]">
                St. Cecilia's Alumni
              </span>
            </div>
            {onBackToApp && (
              <button
                onClick={onBackToApp}
                className="text-xs text-stone-500 hover:text-stone-800"
              >
                Back to App
              </button>
            )}
          </div>
        </div>

        {/* ========================================================
            VIEW A: SIGN IN FORM (Matches Screenshot 2)
            ======================================================== */}
        {mode === 'login' && (
          <div className="max-w-md w-full mx-auto">
            {/* Form Title & Subtitle */}
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight mb-2">
              Sign In
            </h2>
            <p className="text-sm text-stone-500 font-normal mb-6">
              Enter your credentials to access the portal.
            </p>

            {/* Prominent Live Countdown Lockout Banner or Error State */}
            {isLockedOut ? (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-300 text-red-900 shadow-sm animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-100 text-red-700 shrink-0 mt-0.5">
                    <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-red-900 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-red-600" />
                        Account Temporarily Locked
                      </h4>
                      <span className="font-mono text-sm font-black px-2.5 py-0.5 rounded-md bg-red-600 text-white tracking-widest shadow-xs">
                        {formatSecondsToMMSS(lockoutSecondsRemaining)}
                      </span>
                    </div>
                    <p className="text-xs text-red-700 mt-1.5 leading-relaxed">
                      Too many consecutive failed sign-in attempts (3 of 3). For security, sign-in is suspended. Please wait until the timer finishes before trying again.
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-red-200 text-[11px] text-red-700 flex items-center justify-between flex-wrap gap-2">
                      <span>Rate limit rule: 1st trial = 1 min (+2 mins each subsequent trial)</span>
                      <button
                        type="button"
                        onClick={handleOpenForgotPassword}
                        className="font-bold underline text-red-900 hover:text-red-950 cursor-pointer"
                      >
                        Reset Credentials via Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : loginError ? (
              <div className="mb-4 p-3.5 rounded-xl bg-red-50 text-red-800 text-xs border border-red-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium leading-relaxed">{loginError}</p>
                </div>
              </div>
            ) : failedAttempts > 0 ? (
              <div className="mb-4 p-3 rounded-xl bg-amber-50 text-amber-800 text-xs border border-amber-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-[11px] font-medium">
                  {failedAttempts} of 3 attempts used in this trial. {3 - failedAttempts} attempt{3 - failedAttempts > 1 ? 's' : ''} remaining before temporary lockout.
                </span>
              </div>
            ) : null}

            {/* Email / Student ID Pill Toggle */}
            <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl mb-6 text-xs font-semibold">
              <button
                type="button"
                disabled={isLockedOut}
                onClick={() => setLoginMethod('email')}
                className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  loginMethod === 'email'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                } ${isLockedOut ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <Mail className={`w-3.5 h-3.5 ${loginMethod === 'email' ? 'text-[#8B181B]' : ''}`} />
                <span>Email</span>
              </button>

              <button
                type="button"
                disabled={isLockedOut}
                onClick={() => setLoginMethod('studentId')}
                className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  loginMethod === 'studentId'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                } ${isLockedOut ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <GraduationCap className={`w-3.5 h-3.5 ${loginMethod === 'studentId' ? 'text-[#8B181B]' : ''}`} />
                <span>Student ID</span>
              </button>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Identifier Field */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                  {loginMethod === 'email' ? 'EMAIL ADDRESS' : 'STUDENT ID NUMBER'}
                </label>
                <input
                  type={loginMethod === 'email' ? 'email' : 'text'}
                  required
                  disabled={isLockedOut}
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder={loginMethod === 'email' ? 'e.g. juan@email.com' : 'e.g. SC-2020-0192'}
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#8B181B]/20 focus:border-[#8B181B] transition-all disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed"
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    PASSWORD
                  </label>
                  <button
                    type="button"
                    onClick={handleOpenForgotPassword}
                    className="text-xs text-[#8B181B] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    disabled={isLockedOut}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-4 pr-10 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#8B181B]/20 focus:border-[#8B181B] transition-all disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    disabled={isLockedOut}
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 disabled:opacity-50"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Stay Signed In */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="staySignedIn"
                  disabled={isLockedOut}
                  checked={staySignedIn}
                  onChange={(e) => setStaySignedIn(e.target.checked)}
                  className="w-4 h-4 text-[#8B181B] rounded border-stone-300 focus:ring-[#8B181B] disabled:cursor-not-allowed"
                />
                <label htmlFor="staySignedIn" className="text-xs text-stone-600 select-none">
                  Stay signed in
                </label>
              </div>

              {/* Red Submit Button with dynamic lockout countdown */}
              <button
                type="submit"
                disabled={isLockedOut}
                className={`w-full py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all shadow-md ${
                  isLockedOut
                    ? 'bg-stone-300 text-stone-600 cursor-not-allowed shadow-none'
                    : 'bg-[#8B181B] hover:bg-[#721316] text-white hover:shadow-lg cursor-pointer'
                }`}
              >
                {isLockedOut
                  ? `LOCKED — TRY AGAIN IN ${formatSecondsToMMSS(lockoutSecondsRemaining)}`
                  : 'SIGN IN'}
              </button>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-stone-200"></div>
                <span className="flex-shrink mx-4 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  or
                </span>
                <div className="flex-grow border-t border-stone-200"></div>
              </div>

              {/* Google Sign-In Button */}
              <button
                type="button"
                disabled={isLockedOut || isGoogleLoading}
                onClick={handleGoogleSignIn}
                className="w-full py-3 px-4 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm flex items-center justify-center gap-3 transition-colors shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <div className="w-5 h-5 border-2 border-[#8B181B] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Sign in with Google</span>
              </button>

              {/* Firebase Live Badge */}
              <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 text-[11px] text-emerald-800 bg-emerald-50/90 border border-emerald-200 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Firebase Authentication & Firestore Database Connected</span>
              </div>

              {/* Bottom Switcher */}
              <div className="text-center pt-2 text-xs text-stone-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setStep(1);
                  }}
                  className="text-[#8B181B] font-bold hover:underline"
                >
                  Apply Now
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================
            VIEW B: MULTI-STEP REGISTRATION (Matches Screenshot 1)
            ======================================================== */}
        {mode === 'register' && (
          <div className="max-w-md w-full mx-auto">
            {registrationComplete ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Welcome to St. Cecilia's Alumni!
                </h3>
                <p className="text-sm text-stone-500 mt-2">
                  Your profile has been generated successfully. Redirecting you to the portal...
                </p>
              </div>
            ) : (
              <>
                {/* STEP 1: ACCOUNT DETAILS */}
                {step === 1 && (
                  <div>
                    <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight mb-1">
                      Account Details
                    </h2>
                    <p className="text-sm text-stone-500 font-normal mb-5">
                      Create your login credentials for the alumni portal.
                    </p>

                    {/* Role Selector: Alumni, Staff, Registrar, Moderator, Admin */}
                    <div className="mb-4">
                      <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                        SELECT YOUR ROLE / AFFILIATION
                      </label>
                      <div className="grid grid-cols-5 gap-1 p-1 bg-stone-100 rounded-xl text-[11px] font-semibold text-center">
                        {(['alumni', 'staff', 'registrar', 'moderator', 'admin'] as UserRole[]).map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setSelectedRole(r)}
                            className={`py-1.5 rounded-lg capitalize transition-all ${
                              selectedRole === r
                                ? 'bg-white text-[#8B181B] font-bold shadow-xs'
                                : 'text-stone-500 hover:text-stone-900'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-stone-400 mt-1">
                        Selected: <span className="font-bold text-stone-700 uppercase">{selectedRole}</span>. Form fields in step 2 will adapt to your role.
                      </p>
                    </div>

                    {step1Error && (
                      <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-800 text-xs border border-red-200">
                        {step1Error}
                      </div>
                    )}

                    <form onSubmit={handleNextToStep2} className="space-y-4">
                      {/* First Name & Last Name */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                            FIRST NAME
                          </label>
                          <input
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Juan"
                            className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:border-[#8B181B] focus:ring-1 focus:ring-[#8B181B]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                            LAST NAME
                          </label>
                          <input
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Dela Cruz"
                            className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:border-[#8B181B] focus:ring-1 focus:ring-[#8B181B]"
                          />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                          EMAIL ADDRESS
                        </label>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="juan@email.com"
                          className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:border-[#8B181B] focus:ring-1 focus:ring-[#8B181B]"
                        />
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                          PASSWORD
                        </label>
                        <div className="relative">
                          <input
                            type={showRegPassword ? 'text' : 'password'}
                            required
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full pl-4 pr-10 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:border-[#8B181B] focus:ring-1 focus:ring-[#8B181B]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                          >
                            {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Password Bullets Requirements (From Screenshot 1) */}
                        <div className="mt-2 space-y-1 text-xs text-stone-500">
                          <div className={`flex items-center gap-2 ${hasMinLength ? 'text-emerald-600 font-medium' : ''}`}>
                            <span className="w-2.5 h-2.5 rounded-full border border-current flex items-center justify-center text-[8px]">
                              {hasMinLength ? '✓' : '○'}
                            </span>
                            <span>At least 8 characters</span>
                          </div>
                          <div className={`flex items-center gap-2 ${hasUppercase ? 'text-emerald-600 font-medium' : ''}`}>
                            <span className="w-2.5 h-2.5 rounded-full border border-current flex items-center justify-center text-[8px]">
                              {hasUppercase ? '✓' : '○'}
                            </span>
                            <span>One uppercase letter</span>
                          </div>
                          <div className={`flex items-center gap-2 ${hasNumber ? 'text-emerald-600 font-medium' : ''}`}>
                            <span className="w-2.5 h-2.5 rounded-full border border-current flex items-center justify-center text-[8px]">
                              {hasNumber ? '✓' : '○'}
                            </span>
                            <span>One number</span>
                          </div>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                          CONFIRM PASSWORD
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full pl-4 pr-10 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:border-[#8B181B] focus:ring-1 focus:ring-[#8B181B]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Next Button */}
                      <button
                        type="submit"
                        className="w-full py-3.5 bg-[#8B181B] hover:bg-[#721316] text-white rounded-xl text-xs font-bold tracking-widest uppercase shadow-md hover:shadow-lg transition-all"
                      >
                        NEXT: PERSONAL INFO
                      </button>

                      {/* Link to Sign In */}
                      <div className="text-center pt-2 text-xs text-stone-500">
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => setMode('login')}
                          className="text-[#8B181B] font-bold hover:underline"
                        >
                          Sign In
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* STEP 2: PERSONAL & ROLE SPECIFIC DETAILS */}
                {step === 2 && (
                  <div>
                    <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight mb-1">
                      {selectedRole === 'alumni' ? 'Academic & Personal' : 'Institutional Credentials'}
                    </h2>
                    <p className="text-sm text-stone-500 font-normal mb-5">
                      {selectedRole === 'alumni'
                        ? 'Verify your Cecilian student record and degree history.'
                        : `Provide your ${selectedRole.toUpperCase()} credentials at St. Cecilia's College.`}
                    </p>

                    {step2Error && (
                      <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-800 text-xs border border-red-200">
                        {step2Error}
                      </div>
                    )}

                    <form onSubmit={handleNextToStep3} className="space-y-4">
                      {/* For Alumni Role */}
                      {selectedRole === 'alumni' && (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                                STUDENT ID NUMBER
                              </label>
                              <input
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                placeholder="SC-2020-0192"
                                className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                                GRADUATION BATCH
                              </label>
                              <input
                                type="text"
                                value={batch}
                                onChange={(e) => setBatch(e.target.value)}
                                placeholder="2024"
                                className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                              COURSE / DEGREE PROGRAM
                            </label>
                            <input
                              type="text"
                              required
                              value={course}
                              onChange={(e) => setCourse(e.target.value)}
                              placeholder="B.S. Information Technology"
                              className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                              CURRENT RESIDENCE / CITY
                            </label>
                            <input
                              type="text"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              placeholder="Cebu, Philippines"
                              className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                              PROFESSIONAL HEADLINE (OPTIONAL)
                            </label>
                            <input
                              type="text"
                              value={headline}
                              onChange={(e) => setHeadline(e.target.value)}
                              placeholder="Associate Software Engineer @ Tech Solutions"
                              className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm"
                            />
                          </div>
                        </>
                      )}

                      {/* For Staff, Registrar, Moderator, Admin Roles */}
                      {selectedRole !== 'alumni' && (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                                EMPLOYEE / OFFICER ID
                              </label>
                              <input
                                type="text"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                placeholder="EMP-2024-001"
                                className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                                DESIGNATION
                              </label>
                              <input
                                type="text"
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                                placeholder="Department Officer"
                                className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                              DEPARTMENT / CAMPUS OFFICE
                            </label>
                            <input
                              type="text"
                              required
                              value={department}
                              onChange={(e) => setDepartment(e.target.value)}
                              placeholder="Office of the Registrar / Alumni Relations"
                              className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                              OFFICE LOCATION / CAMPUS BUILDING
                            </label>
                            <input
                              type="text"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              placeholder="Main Administration Building, 2nd Floor"
                              className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm"
                            />
                          </div>
                        </>
                      )}

                      {/* Phone Contact */}
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                          CONTACT PHONE NUMBER
                        </label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+63 917 123 4567"
                          className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm"
                        />
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="w-1/3 py-3 border border-stone-300 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-700"
                        >
                          BACK
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-[#8B181B] hover:bg-[#721316] text-white rounded-xl text-xs font-bold tracking-widest uppercase shadow-md"
                        >
                          NEXT: REVIEW
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* STEP 3: REVIEW & CONFIRM */}
                {step === 3 && (
                  <div>
                    <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight mb-1">
                      Review Application
                    </h2>
                    <p className="text-sm text-stone-500 font-normal mb-5">
                      Confirm your credentials before submitting to St. Cecilia's portal.
                    </p>

                    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3 text-xs mb-5">
                      <div className="flex justify-between border-b border-stone-200 pb-2">
                        <span className="text-stone-500">Applicant Name</span>
                        <span className="font-bold text-stone-900">{firstName} {lastName}</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-200 pb-2">
                        <span className="text-stone-500">Account Role</span>
                        <span className="font-bold uppercase text-[#8B181B] bg-red-50 px-2 py-0.5 rounded">
                          {selectedRole}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-stone-200 pb-2">
                        <span className="text-stone-500">Email Address</span>
                        <span className="font-semibold text-stone-800">{regEmail}</span>
                      </div>

                      {selectedRole === 'alumni' ? (
                        <>
                          <div className="flex justify-between border-b border-stone-200 pb-2">
                            <span className="text-stone-500">Program / Batch</span>
                            <span className="font-semibold text-stone-800">{course} ({batch})</span>
                          </div>
                          {studentId && (
                            <div className="flex justify-between border-b border-stone-200 pb-2">
                              <span className="text-stone-500">Student ID</span>
                              <span className="font-mono text-stone-800">{studentId}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex justify-between border-b border-stone-200 pb-2">
                          <span className="text-stone-500">Department</span>
                          <span className="font-semibold text-stone-800">{department}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-stone-500">Location</span>
                        <span className="text-stone-800">{location || 'Cebu, Philippines'}</span>
                      </div>
                    </div>

                    {/* Honor Code & Verification Agreement */}
                    <div className="flex items-start gap-2.5 p-3 bg-red-50/50 border border-red-100 rounded-xl mb-6">
                      <input
                        type="checkbox"
                        id="honorCode"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="w-4 h-4 text-[#8B181B] rounded border-stone-300 mt-0.5 focus:ring-[#8B181B]"
                      />
                      <label htmlFor="honorCode" className="text-xs text-stone-700 leading-relaxed select-none">
                        I certify that I am a graduate, staff, or affiliate of <span className="font-semibold">St. Cecilia's College</span> and agree to adhere to the alumni community guidelines and privacy policy.
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-1/3 py-3.5 border border-stone-300 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-700"
                      >
                        BACK
                      </button>
                      <button
                        type="button"
                        disabled={!agreedToTerms}
                        onClick={handleCompleteRegistration}
                        className={`flex-1 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase shadow-md transition-all ${
                          agreedToTerms
                            ? 'bg-[#8B181B] hover:bg-[#721316] text-white cursor-pointer'
                            : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        SUBMIT APPLICATION
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* FORGOT PASSWORD MODAL */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        initialEmail={forgotEmail || (loginIdentifier.includes('@') ? loginIdentifier.trim() : '')}
        onClose={() => setShowForgotModal(false)}
        onSuccess={handlePasswordResetSuccess}
      />
    </div>
  );
};
