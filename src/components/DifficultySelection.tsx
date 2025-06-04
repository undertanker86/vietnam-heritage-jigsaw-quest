
import React from 'react';
import { GameTopic, DifficultyLevel, BestTimes } from './GameLayout';
import { ArrowLeft } from 'lucide-react';

interface DifficultySelectionProps {
  topic: GameTopic;
  onDifficultySelect: (difficulty: DifficultyLevel) => void;
  onBack: () => void;
  bestTimes: BestTimes;
}

const DifficultySelection: React.FC<DifficultySelectionProps> = ({
  topic,
  onDifficultySelect,
  onBack,
  bestTimes
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBestTime = (difficulty: DifficultyLevel) => {
    const key = `${topic}-${difficulty}`;
    return bestTimes[key] ? formatTime(bestTimes[key]) : null;
  };

  const difficulties = [
    { level: 2 as DifficultyLevel, pieces: 4, label: 'Beginner', description: 'Perfect for a quick puzzle' },
    { level: 3 as DifficultyLevel, pieces: 9, label: 'Intermediate', description: 'A balanced challenge' },
    { level: 4 as DifficultyLevel, pieces: 16, label: 'Advanced', description: 'For puzzle masters' }
  ];

  const topicInfo = {
    history: {
      title: 'Historical Vietnam',
      description: 'Explore iconic landmarks and moments from Vietnam\'s rich past',
      icon: '🏛️',
      color: 'from-red-500 to-red-700'
    },
    culture: {
      title: 'Vietnamese Culture',
      description: 'Discover traditional arts, festivals, and cultural treasures',
      icon: '🎭',
      color: 'from-yellow-500 to-orange-600'
    }
  };

  const currentTopic = topicInfo[topic];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </button>

      {/* Topic Header */}
      <div className="text-center mb-12 animate-gentle-float">
        <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${currentTopic.color} rounded-full flex items-center justify-center shadow-lg`}>
          <div className="text-white text-3xl">{currentTopic.icon}</div>
        </div>
        <h1 className="text-5xl font-bold vietnam-title mb-4">
          {currentTopic.title}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {currentTopic.description}
        </p>
      </div>

      {/* Difficulty Options */}
      <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
        {difficulties.map((diff, index) => {
          const bestTime = getBestTime(diff.level);
          
          return (
            <div
              key={diff.level}
              onClick={() => onDifficultySelect(diff.level)}
              className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 ${
                index === 1 ? 'transform md:scale-110' : ''
              }`}
            >
              <div className="text-center">
                {/* Difficulty Grid Visual */}
                <div className="mb-6 flex justify-center">
                  <div className={`grid grid-cols-${diff.level} gap-1 w-16 h-16`}>
                    {Array.from({ length: diff.pieces }).map((_, i) => (
                      <div
                        key={i}
                        className={`bg-gradient-to-br ${currentTopic.color} rounded-sm animate-sparkle`}
                        style={{ animationDelay: `${i * 0.1}s` }}
                      ></div>
                    ))}
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-2">{diff.label}</h2>
                <p className="text-4xl font-bold text-gray-900 mb-3">{diff.level}×{diff.level}</p>
                <p className="text-lg text-gray-600 mb-3">{diff.pieces} pieces</p>
                <p className="text-sm text-gray-500 mb-4">{diff.description}</p>

                {/* Best Time Display */}
                {bestTime && (
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-full px-4 py-2 inline-block">
                    <span className="text-sm font-semibold text-green-700">
                      Best: {bestTime}
                    </span>
                  </div>
                )}
              </div>

              {/* Hover Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${currentTopic.color.replace('to-', 'to-transparent opacity-0 group-hover:opacity-10')} rounded-3xl transition-opacity duration-300`}></div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-8 text-gray-600">
        <p>Choose your puzzle size: fewer pieces for a quick solve, more pieces for a challenge</p>
      </div>
    </div>
  );
};

export default DifficultySelection;
