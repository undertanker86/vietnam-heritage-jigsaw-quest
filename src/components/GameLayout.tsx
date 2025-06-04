
import React, { useState, useEffect } from 'react';
import HomeScreen from './HomeScreen';
import TopicSelection from './TopicSelection';
import DifficultySelection from './DifficultySelection';
import PuzzleGame from './PuzzleGame';

export type GameTopic = 'history' | 'culture';
export type DifficultyLevel = 2 | 3 | 4;

export interface BestTimes {
  [key: string]: number; // key format: "topic-difficulty" e.g., "history-2"
}

const GameLayout = () => {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'topic' | 'difficulty' | 'puzzle'>('home');
  const [selectedTopic, setSelectedTopic] = useState<GameTopic | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const [bestTimes, setBestTimes] = useState<BestTimes>({});

  // Load best times from localStorage on component mount
  useEffect(() => {
    const savedTimes = localStorage.getItem('vietnam-puzzle-best-times');
    if (savedTimes) {
      setBestTimes(JSON.parse(savedTimes));
    }
  }, []);

  // Save best times to localStorage whenever bestTimes changes
  useEffect(() => {
    localStorage.setItem('vietnam-puzzle-best-times', JSON.stringify(bestTimes));
  }, [bestTimes]);

  const handleTopicSelect = (topic: GameTopic) => {
    setSelectedTopic(topic);
    setCurrentScreen('difficulty');
  };

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
    setCurrentScreen('puzzle');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedTopic(null);
    setSelectedDifficulty(null);
  };

  const handleBackToDifficulty = () => {
    setCurrentScreen('difficulty');
    setSelectedDifficulty(null);
  };

  const handlePuzzleComplete = (timeInSeconds: number) => {
    if (selectedTopic && selectedDifficulty) {
      const key = `${selectedTopic}-${selectedDifficulty}`;
      const currentBest = bestTimes[key];
      
      if (!currentBest || timeInSeconds < currentBest) {
        setBestTimes(prev => ({
          ...prev,
          [key]: timeInSeconds
        }));
      }
    }
  };

  const getCurrentBestTime = (): number | null => {
    if (selectedTopic && selectedDifficulty) {
      const key = `${selectedTopic}-${selectedDifficulty}`;
      return bestTimes[key] || null;
    }
    return null;
  };

  return (
    <div className="min-h-screen watercolor-bg">
      {currentScreen === 'home' && (
        <HomeScreen 
          onTopicSelect={handleTopicSelect}
          bestTimes={bestTimes}
        />
      )}
      
      {currentScreen === 'difficulty' && selectedTopic && (
        <DifficultySelection
          topic={selectedTopic}
          onDifficultySelect={handleDifficultySelect}
          onBack={handleBackToHome}
          bestTimes={bestTimes}
        />
      )}
      
      {currentScreen === 'puzzle' && selectedTopic && selectedDifficulty && (
        <PuzzleGame
          topic={selectedTopic}
          difficulty={selectedDifficulty}
          onBack={handleBackToDifficulty}
          onComplete={handlePuzzleComplete}
          onHome={handleBackToHome}
          currentBestTime={getCurrentBestTime()}
        />
      )}
    </div>
  );
};

export default GameLayout;
