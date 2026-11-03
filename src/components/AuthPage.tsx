import React, { useState } from 'react';
import {
  ShoppingBasket,
  Mail,
  Lock,
  User,
  MapPin,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Phone,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserAccount, UserLocation } from '../types/grocery';

interface AuthPageProps {
  onLoginSuccess: (user: UserAccount) => void;
  registeredUsers: UserAccount[];
  onRegisterUser: (newUser: UserAccount) => void;
  onContinueAsGuest: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  registeredUsers,
  onRegisterUser,
  onContinueAsGuest
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Signup Form State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPincode, setSignupPincode] = useState('400050');
  const [signupCity, setSignupCity] = useState('Mumbai');
  const [signupArea, setSignupArea] = useState('Bandra West');

  // Error & Status Feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quick fill helper for the reviewer/user
  const handleFillDemo = (email: string) => {
    setLoginEmail(email);
    setLoginPassword('password123');
    setErrorMessage(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailTrimmed = loginEmail.trim().toLowerCase();

    // 1. Basic format validation
    if (!emailTrimmed) {
      setErrorMessage('Please enter your email ID or username.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setErrorMessage('Invalid Email Format: Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    // 2. Check if user account exists (verification of login id)
    const existingUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === emailTrimmed
    );

    if (!existingUser) {
      setErrorMessage(
        `Login ID Not Found: No account is registered with "${loginEmail}". Please check your spelling or click "Create New Account" below.`
      );
      return;
    }

    // 3. Verify password
    if (existingUser.password !== loginPassword) {
      setErrorMessage('Incorrect Password: The password you entered does not match our records. Please try again.');
      return;
    }

    // Success
    setSuccessMessage(`Welcome back, ${existingUser.name}! Logging you in...`);
    setTimeout(() => {
      onLoginSuccess(existingUser);
    }, 600);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailTrimmed = signupEmail.trim().toLowerCase();

    if (!signupName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Check if email already registered
    const emailExists = registeredUsers.some(
      (u) => u.email.toLowerCase() === emailTrimmed
    );
    if (emailExists) {
      setErrorMessage(`An account with "${signupEmail}" already exists. Please log in instead.`);
      return;
    }

    if (signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (!signupPincode || signupPincode.trim().length !== 6) {
      setErrorMessage('Please enter a valid 6-digit location PIN code.');
      return;
    }

    const newUser: UserAccount = {
      id: 'user-' + Date.now(),
      name: signupName.trim(),
      email: emailTrimmed,
      password: signupPassword,
      phone: signupPhone.trim() || undefined,
      pincode: signupPincode.trim(),
      city: signupCity.trim() || 'My City',
      area: signupArea.trim() || 'Locality',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onRegisterUser(newUser);
    setSuccessMessage(`Account created successfully for ${newUser.name}! Logging you in...`);
    setTimeout(() => {
      onLoginSuccess(newUser);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="auth-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#ffffff" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Lockup */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 mb-3 border border-emerald-400/30">
            <ShoppingBasket className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            SmartBasket
          </h1>
          <p className="text-xs text-emerald-400 font-semibold tracking-wide uppercase mt-1">
            Same groceries, lower prices, smarter shopping!
          </p>
        </div>

        {/* Auth Box Container */}
        <div className="mt-7 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
          {/* Segmented Auth Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                authMode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                authMode === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign Up (Register)
            </button>
          </div>

          {/* Validation Feedback Banner */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-semibold">{successMessage}</div>
            </div>
          )}

          {/* MODE 1: LOGIN */}
          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Login ID (Email Address):
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="e.g. aairaa2026@gmail.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password:
                  </label>
                  <span className="text-[11px] text-slate-400">Demo: password123</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-colors mt-2"
              >
                <span>Verify & Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo Accounts Quick-Fill Picker */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center">
                  Or One-Click Demo Login
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleFillDemo('aairaa2026@gmail.com')}
                    className="p-2 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-left text-[11px] transition-colors"
                  >
                    <div className="font-bold text-slate-800 truncate">Aairaa Sharma</div>
                    <div className="text-slate-500 truncate">aairaa2026@gmail.com</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('user@smartbasket.in')}
                    className="p-2 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-left text-[11px] transition-colors"
                  >
                    <div className="font-bold text-slate-800 truncate">Rahul Verma</div>
                    <div className="text-slate-500 truncate">user@smartbasket.in</div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* MODE 2: SIGN UP / REGISTRATION */
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email ID (Your Login ID):
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone (Optional):
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="+91 98200..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password (min 6 chars):
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location & PIN Code required by Step 1 of spec */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Your Delivery Location (Required for Store Pricing)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={signupPincode}
                    onChange={(e) => setSignupPincode(e.target.value)}
                    placeholder="PIN Code"
                    maxLength={6}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                  <input
                    type="text"
                    value={signupCity}
                    onChange={(e) => setSignupCity(e.target.value)}
                    placeholder="City"
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                  <input
                    type="text"
                    value={signupArea}
                    onChange={(e) => setSignupArea(e.target.value)}
                    placeholder="Area / Locality"
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-colors mt-3"
              >
                <span>Create Account & Start Comparing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Continue as Guest option */}
          <div className="mt-5 pt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium underline"
            >
              Skip login and browse as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
