
import React, { useState } from 'react';
import { BestTimes, GameTopic } from './GameLayout';
import { User } from '../contexts/UserContext';
import { LogIn, Crown } from 'lucide-react';

interface HomeScreenProps {
  onTopicSelect: (topic: GameTopic) => void;
  bestTimes: BestTimes;
  onLogin: () => void;
  user: User | null;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onTopicSelect, bestTimes, onLogin, user }) => {
  const [showBestTimes, setShowBestTimes] = useState(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBestTimeDisplay = (topic: string, difficulty: number) => {
    const key = `${topic}-${difficulty}`;
    return bestTimes[key] ? formatTime(bestTimes[key]) : '--:--';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Login Button */}
      {!user && (
        <div className="absolute top-6 right-6">
          <button
            onClick={onLogin}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        </div>
      )}

      <div className="text-center mb-12 animate-gentle-float">
        <h1 className="text-6xl md:text-7xl font-bold vietnam-title mb-4">
          Vietnam Puzzle Heritage
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover Vietnam's rich history and vibrant culture through beautiful jigsaw puzzles
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12 w-full max-w-4xl">
        {/* History Topic */}
        <div 
          onClick={() => onTopicSelect('history')}
          className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
        >
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 relative">
              <div className="text-white text-4xl">🏛️</div>
              <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1">
                <Crown className="w-4 h-4 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              History
              <span className="text-yellow-500 ml-2">👑</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Explore Vietnam's historical campaigns with milestone puzzles and certificates
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Culture Topic */}
        <div 
          onClick={() => onTopicSelect('culture')}
          className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
        >
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <div className="text-white text-4xl">🎭</div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Culture</h2>
            <p className="text-gray-600 leading-relaxed">
              Immerse yourself in Vietnam's traditional arts, festivals, cuisine, and cultural treasures
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

      {/* Best Times Section */}
      <div className="w-full max-w-md">
        <button
          onClick={() => setShowBestTimes(!showBestTimes)}
          className="w-full bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 mb-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-700">Best Times</span>
            <span className={`transform transition-transform duration-300 ${showBestTimes ? 'rotate-180' : ''}`}>
              ⬇️
            </span>
          </div>
        </button>

        {showBestTimes && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">History</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>2×2:</span>
                    <span className="font-mono">{getBestTimeDisplay('history', 2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>3×3:</span>
                    <span className="font-mono">{getBestTimeDisplay('history', 3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>4×4:</span>
                    <span className="font-mono">{getBestTimeDisplay('history', 4)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Culture</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>2×2:</span>
                    <span className="font-mono">{getBestTimeDisplay('culture', 2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>3×3:</span>
                    <span className="font-mono">{getBestTimeDisplay('culture', 3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>4×4:</span>
                    <span className="font-mono">{getBestTimeDisplay('culture', 4)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
