
import React, { useState, useEffect } from 'react';
import { Home, RotateCcw, Play } from 'lucide-react';

interface VictoryModalProps {
  image: {
    url: string;
    title: string;
    description: string;
  };
  time: number;
  moves: number;
  isNewBest: boolean;
  onReplay: () => void;
  onHome: () => void;
}

const VictoryModal: React.FC<VictoryModalProps> = ({
  image,
  time,
  moves,
  isNewBest,
  onReplay,
  onHome
}) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayAudio = () => {
    setIsPlaying(true);
    // Simulate audio playback
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                background: ['#fbbf24', '#ef4444', '#10b981', '#3b82f6'][Math.floor(Math.random() * 4)]
              }}
            />
          ))}
        </div>
      )}

      {/* Modal Content */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-yellow-500 rounded-t-3xl p-6 text-white text-center">
          <h1 className="text-4xl font-bold mb-2 vietnam-title">Congratulations!</h1>
          <div className="flex items-center justify-center gap-4 text-lg">
            <span>🎉</span>
            <span>Puzzle Completed</span>
            <span>🎉</span>
          </div>
        </div>

        {/* Completed Image */}
        <div className="p-6">
          <div className="relative mb-6">
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-64 object-cover rounded-2xl shadow-lg"
              style={{
                border: '4px solid',
                borderImage: 'linear-gradient(45deg, #fbbf24, #ef4444) 1'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-2xl font-bold">{image.title}</h2>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center bg-gray-50 rounded-2xl p-4">
              <div className="text-2xl font-bold text-gray-800">{formatTime(time)}</div>
              <div className="text-sm text-gray-500">Time</div>
              {isNewBest && (
                <div className="text-xs text-green-600 font-semibold mt-1">🏆 New Best!</div>
              )}
            </div>
            <div className="text-center bg-gray-50 rounded-2xl p-4">
              <div className="text-2xl font-bold text-gray-800">{moves}</div>
              <div className="text-sm text-gray-500">Moves</div>
            </div>
            <div className="text-center bg-gray-50 rounded-2xl p-4">
              <div className="text-2xl">⭐</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">About this image:</h3>
            <p className="text-gray-600 leading-relaxed">{image.description}</p>
          </div>

          {/* Audio Section */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlayAudio}
                disabled={isPlaying}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  isPlaying
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-500 to-yellow-500 text-white hover:shadow-lg hover:scale-105'
                }`}
              >
                <Play className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
                <span>{isPlaying ? 'Playing...' : 'Listen to Story'}</span>
              </button>
              <div className="text-sm text-gray-500">
                {isPlaying ? (
                  <span className="animate-pulse">🎵 Playing Vietnamese narration...</span>
                ) : (
                  <span>Hear about this piece of Vietnamese heritage</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onReplay}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl py-4 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Play Again</span>
            </button>
            <button
              onClick={onHome}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl py-4 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictoryModal;
