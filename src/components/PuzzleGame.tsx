import React, { useState, useEffect, useRef } from 'react';
import { GameTopic, DifficultyLevel } from './GameLayout';
import { ArrowLeft, Home, Eye } from 'lucide-react';
import VictoryModal from './VictoryModal';

interface PuzzlePiece {
  id: number;
  imageUrl: string;
  correctPosition: number;
  currentPosition: number;
  x: number;
  y: number;
}

interface PuzzleGameProps {
  topic: GameTopic;
  difficulty: DifficultyLevel;
  milestoneId?: string | null;
  onBack: () => void;
  onComplete: (timeInSeconds: number) => void;
  onHome: () => void;
  currentBestTime: number | null;
}

const PuzzleGame: React.FC<PuzzleGameProps> = ({
  topic,
  difficulty,
  milestoneId,
  onBack,
  onComplete,
  onHome,
  currentBestTime
}) => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [currentImage, setCurrentImage] = useState<any>(null);
  
  const previewTimeoutRef = useRef<NodeJS.Timeout>();

  // Sample images for each topic
  const images = {
    history: [
      {
        url: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        title: 'Temple Architecture',
        description: 'Ancient Vietnamese temple showcasing traditional architectural elements and spiritual significance in Vietnamese culture.'
      },
      {
        url: 'https://images.unsplash.com/photo-1551038247-3d9af20df552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        title: 'Historical Building',
        description: 'A beautiful example of colonial architecture that represents the intersection of Vietnamese and French influences.'
      }
    ],
    culture: [
      {
        url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        title: 'Natural Heritage',
        description: 'Vietnamese natural landscapes that have inspired countless works of art and traditional poetry throughout history.'
      },
      {
        url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        title: 'Cultural Landscape',
        description: 'Traditional Vietnamese rural scenery that reflects the harmony between people and nature in Vietnamese philosophy.'
      }
    ]
  };

  // Initialize puzzle
  useEffect(() => {
    const imageSet = images[topic];
    const selectedImage = imageSet[Math.floor(Math.random() * imageSet.length)];
    setCurrentImage(selectedImage);
    
    const totalPieces = difficulty * difficulty;
    const newPieces: PuzzlePiece[] = [];
    
    // Create pieces in order
    for (let i = 0; i < totalPieces; i++) {
      newPieces.push({
        id: i,
        imageUrl: selectedImage.url,
        correctPosition: i,
        currentPosition: i,
        x: (i % difficulty) * (100 / difficulty),
        y: Math.floor(i / difficulty) * (100 / difficulty)
      });
    }
    
    // Shuffle pieces
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = newPieces[i].currentPosition;
      newPieces[i].currentPosition = newPieces[j].currentPosition;
      newPieces[j].currentPosition = temp;
    }
    
    setPieces(newPieces);
    setStartTime(Date.now());
    setIsComplete(false);
    setMoves(0);
  }, [topic, difficulty]);

  // Timer effect
  useEffect(() => {
    if (isComplete) return;
    
    const interval = setInterval(() => {
      setCurrentTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, isComplete]);

  // Check for completion
  useEffect(() => {
    if (pieces.length === 0) return;
    
    const isCompleted = pieces.every(piece => piece.correctPosition === piece.currentPosition);
    if (isCompleted && !isComplete) {
      setIsComplete(true);
      const completionTime = Math.floor((Date.now() - startTime) / 1000);
      onComplete(completionTime);
    }
  }, [pieces, isComplete, startTime, onComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePieceClick = (pieceId: number) => {
    if (isComplete) return;
    
    // Find an empty adjacent spot and move piece
    const piece = pieces.find(p => p.id === pieceId);
    if (!piece) return;
    
    const emptySpot = pieces.find(p => p.currentPosition === pieces.length - 1); // Last position is "empty"
    if (!emptySpot) return;
    
    // Swap positions
    const newPieces = pieces.map(p => {
      if (p.id === pieceId) {
        return { ...p, currentPosition: emptySpot.currentPosition };
      }
      if (p.id === emptySpot.id) {
        return { ...p, currentPosition: piece.currentPosition };
      }
      return p;
    });
    
    setPieces(newPieces);
    setMoves(prev => prev + 1);
  };

  const handleDragStart = (e: React.DragEvent, pieceId: number) => {
    setDraggedPiece(pieceId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetPosition: number) => {
    e.preventDefault();
    if (draggedPiece === null) return;
    
    // Find pieces to swap
    const draggedPieceData = pieces.find(p => p.id === draggedPiece);
    const targetPieceData = pieces.find(p => p.currentPosition === targetPosition);
    
    if (!draggedPieceData || !targetPieceData) return;
    
    // Swap positions
    const newPieces = pieces.map(p => {
      if (p.id === draggedPiece) {
        return { ...p, currentPosition: targetPosition };
      }
      if (p.currentPosition === targetPosition && p.id !== draggedPiece) {
        return { ...p, currentPosition: draggedPieceData.currentPosition };
      }
      return p;
    });
    
    setPieces(newPieces);
    setMoves(prev => prev + 1);
    setDraggedPiece(null);
  };

  const showPreviewImage = () => {
    setShowPreview(true);
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }
    previewTimeoutRef.current = setTimeout(() => {
      setShowPreview(false);
    }, 3000);
  };

  const resetPuzzle = () => {
    const totalPieces = difficulty * difficulty;
    const newPieces = [...pieces];
    
    // Shuffle again
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = newPieces[i].currentPosition;
      newPieces[i].currentPosition = newPieces[j].currentPosition;
      newPieces[j].currentPosition = temp;
    }
    
    setPieces(newPieces);
    setStartTime(Date.now());
    setIsComplete(false);
    setMoves(0);
  };

  if (!currentImage) return null;

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={onHome}
            className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Home className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="flex items-center gap-6 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{formatTime(currentTime)}</div>
            <div className="text-xs text-gray-500">TIME</div>
          </div>
          <div className="w-px h-8 bg-gray-300"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{moves}</div>
            <div className="text-xs text-gray-500">MOVES</div>
          </div>
          {currentBestTime && (
            <>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{formatTime(currentBestTime)}</div>
                <div className="text-xs text-gray-500">BEST</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          {/* Puzzle Grid */}
          <div 
            className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl"
            style={{ width: '500px', height: '500px' }}
          >
            <div 
              className="relative w-full h-full rounded-2xl overflow-hidden"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${difficulty}, 1fr)`,
                gridTemplateRows: `repeat(${difficulty}, 1fr)`,
                gap: '2px'
              }}
            >
              {Array.from({ length: difficulty * difficulty }).map((_, position) => {
                const piece = pieces.find(p => p.currentPosition === position);
                if (!piece) return null;

                return (
                  <div
                    key={position}
                    className={`relative bg-gray-200 tile-hover cursor-pointer ${
                      draggedPiece === piece.id ? 'tile-dragging' : ''
                    }`}
                    onClick={() => handlePieceClick(piece.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, position)}
                    style={{
                      backgroundImage: `url(${piece.imageUrl})`,
                      backgroundSize: `${difficulty * 100}% ${difficulty * 100}%`,
                      backgroundPosition: `${piece.x}% ${piece.y}%`,
                      borderRadius: '8px'
                    }}
                  >
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, piece.id)}
                      className="w-full h-full rounded-lg border-2 border-white/50 hover:border-yellow-400 transition-colors duration-200"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preview Overlay */}
          {showPreview && (
            <div className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center">
              <img
                src={currentImage.url}
                alt="Preview"
                className="max-w-full max-h-full rounded-2xl opacity-75"
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={showPreviewImage}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Eye className="w-5 h-5" />
          <span>Preview</span>
        </button>
        <button
          onClick={resetPuzzle}
          className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          Shuffle Again
        </button>
      </div>

      {/* Victory Modal */}
      {isComplete && currentImage && (
        <VictoryModal
          image={currentImage}
          time={currentTime}
          moves={moves}
          isNewBest={!currentBestTime || currentTime < currentBestTime}
          onReplay={resetPuzzle}
          onHome={onHome}
        />
      )}
    </div>
  );
};

export default PuzzleGame;
