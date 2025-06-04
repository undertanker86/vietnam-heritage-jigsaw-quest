
import React from 'react';
import { ArrowLeft, Play, CheckCircle, Lock } from 'lucide-react';
import { historicalCampaigns, getCompletedMilestones } from '../data/campaigns';
import { DifficultyLevel } from './GameLayout';

interface MilestoneSelectionProps {
  campaignId: string;
  onMilestoneSelect: (milestoneId: string, difficulty: DifficultyLevel) => void;
  onBack: () => void;
}

const MilestoneSelection: React.FC<MilestoneSelectionProps> = ({
  campaignId,
  onMilestoneSelect,
  onBack
}) => {
  const campaign = historicalCampaigns.find(c => c.id === campaignId);
  const completedMilestones = getCompletedMilestones();

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  const isMilestoneUnlocked = (milestoneOrder: number): boolean => {
    if (milestoneOrder === 1) return true;
    
    const previousMilestone = campaign.milestones.find(m => m.order === milestoneOrder - 1);
    return previousMilestone ? completedMilestones.includes(previousMilestone.id) : false;
  };

  const isMilestoneCompleted = (milestoneId: string): boolean => {
    return completedMilestones.includes(milestoneId);
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mr-6"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        
        <div>
          <h1 className="text-4xl font-bold vietnam-title mb-2">{campaign.title}</h1>
          <p className="text-gray-600">{campaign.period} • {campaign.description}</p>
        </div>
      </div>

      {/* Milestones Timeline */}
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-0.5 h-full w-1 bg-gradient-to-b from-red-300 to-yellow-300"></div>

          {campaign.milestones.map((milestone, index) => {
            const isUnlocked = isMilestoneUnlocked(milestone.order);
            const isCompleted = isMilestoneCompleted(milestone.id);
            const isLeft = index % 2 === 0;

            return (
              <div key={milestone.id} className="relative flex items-center mb-12">
                {/* Timeline Node */}
                <div className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-lg ${
                  isCompleted ? 'bg-green-500' : isUnlocked ? 'bg-gradient-to-r from-red-500 to-yellow-500' : 'bg-gray-400'
                }`}>
                  {isCompleted && <CheckCircle className="w-4 h-4 text-white absolute -top-0.5 -left-0.5" />}
                </div>

                {/* Milestone Card */}
                <div className={`w-5/12 ${isLeft ? 'mr-auto pr-8' : 'ml-auto pl-8'}`}>
                  <div className={`bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl transition-all duration-300 ${
                    isUnlocked ? 'hover:shadow-2xl hover:scale-105' : 'opacity-60'
                  }`}>
                    {/* Milestone Image */}
                    <div className="relative mb-4">
                      <img
                        src={milestone.imageUrl}
                        alt={milestone.title}
                        className={`w-full h-32 object-cover rounded-2xl ${!isUnlocked ? 'grayscale' : ''}`}
                      />
                      
                      {/* Status Icons */}
                      {!isUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl">
                          <Lock className="w-8 h-8 text-white" />
                        </div>
                      )}
                      
                      {isCompleted && (
                        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-2">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Milestone Info */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {milestone.description}
                    </p>

                    {/* Difficulty Buttons */}
                    {isUnlocked && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Choose difficulty:</p>
                        <div className="flex gap-2">
                          {[2, 3, 4].map((size) => (
                            <button
                              key={size}
                              onClick={() => onMilestoneSelect(milestone.id, size as DifficultyLevel)}
                              className="flex-1 bg-gradient-to-r from-red-500 to-yellow-500 text-white rounded-xl py-2 px-3 text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1"
                            >
                              <Play className="w-3 h-3" />
                              {size}×{size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {!isUnlocked && (
                      <div className="text-center text-gray-500 text-sm">
                        Complete previous milestone to unlock
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MilestoneSelection;
