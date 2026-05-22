/** @format */

import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { Lock, User, ArrowRight } from 'lucide-react';
import AnimatedLogo from '../../shared/components/AnimatedLogo';

/** LoginPage - Login page with animated branding and username/password form */
const LoginPage = () => {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('admin@hirewise.com');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(username, password);
    if (error) setError(error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[var(--bg-primary)]">
      <div className="absolute inset-0">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-[var(--accent-glow)] rounded-full blur-[120px] opacity-20 animate-pulse-slow" />
        <div
          className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-[var(--accent-glow-secondary)] rounded-full blur-[120px] opacity-15 animate-pulse-slow"
          style={{ animationDelay: '2s' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[var(--accent-glow)] rounded-full blur-[100px] opacity-10" />
        <div className="absolute top-[15%] left-[10%] w-2 h-2 bg-[var(--accent-text)] rounded-full opacity-20 animate-float" />
        <div
          className="absolute top-[25%] right-[15%] w-3 h-3 bg-[var(--accent-text)] rounded-full opacity-15 animate-float"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute bottom-[20%] left-[20%] w-1.5 h-1.5 bg-[var(--accent-text)] rounded-full opacity-25 animate-float"
          style={{ animationDelay: '3s' }}
        />
        <div
          className="absolute bottom-[30%] right-[10%] w-2.5 h-2.5 bg-[var(--accent-text)] rounded-full opacity-10 animate-float"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 border animate-float bg-[var(--accent-bg-subtle)] border-[var(--accent-border)]">
            <AnimatedLogo size={32} showText={false} />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Hire
            <span className="bg-gradient-to-r from-[var(--accent-gradient-from)] to-[var(--accent-gradient-to)] bg-clip-text text-transparent">
              Wise
            </span>
          </h1>
          <p className="text-[var(--text-tertiary)] mt-2">JD Editor & Resume Ranker</p>
        </div>

        <div className="relative">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-[var(--accent-gradient-from)] via-[var(--accent-gradient-to)] to-[var(--accent-gradient-from)] rounded-2xl opacity-20 animate-border-rotate" />
          <form
            onSubmit={handleSubmit}
            className="relative bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-2xl p-6 sm:p-8 shadow-2xl"
          >
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl pl-11 pr-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-quaternary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] focus:border-[var(--accent-border)] transition-all"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl pl-11 pr-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-quaternary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] focus:border-[var(--accent-border)] transition-all"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white font-semibold rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--accent-shadow)] hover:shadow-[var(--accent-shadow-hover)]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
              <p className="text-center text-xs text-[var(--text-quaternary)]">
                Default credentials: admin@hirewise.com / admin
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
