
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register' | 'upgrade';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode }) => {
  const [currentMode, setCurrentMode] = useState(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register, upgradeToAdvantage } = useUser();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let success = false;
      
      if (currentMode === 'login') {
        success = await login(email, password);
      } else if (currentMode === 'register') {
        success = await register(email, password, name);
      } else if (currentMode === 'upgrade') {
        success = await upgradeToAdvantage();
      }

      if (success) {
        onClose();
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (currentMode) {
      case 'login': return 'Welcome Back';
      case 'register': return 'Join Vietnam Puzzle Heritage';
      case 'upgrade': return 'Upgrade to Advantage';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-yellow-500 rounded-t-3xl p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold vietnam-title">{getTitle()}</h2>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentMode === 'upgrade' ? (
            <div className="text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold mb-2">Unlock Historical Campaigns</h3>
                <p className="text-gray-600">
                  Access exclusive historical campaigns with milestone puzzles, deeper educational content, and completion certificates.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-2xl p-4 mb-6">
                <h4 className="font-semibold mb-2">Advantage Features:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 8 Historical Campaigns</li>
                  <li>• 40+ Milestone Puzzles</li>
                  <li>• Completion Certificates</li>
                  <li>• Enhanced Audio Narrations</li>
                </ul>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-yellow-500 text-white rounded-2xl py-3 font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Upgrading...' : 'Upgrade Now - Free Demo'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {currentMode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name (Optional)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-yellow-500 text-white rounded-2xl py-3 font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Please wait...' : (currentMode === 'login' ? 'Sign In' : 'Create Account')}
              </button>

              <div className="text-center text-sm text-gray-600">
                {currentMode === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setCurrentMode('register')}
                      className="text-red-500 hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setCurrentMode('login')}
                      className="text-red-500 hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
