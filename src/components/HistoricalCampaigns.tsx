
import React from 'react';
import { ArrowLeft, CheckCircle, Trophy } from 'lucide-react';
import { historicalCampaigns, getCampaignProgress } from '../data/campaigns';
import { useUser } from '../contexts/UserContext';

interface HistoricalCampaignsProps {
  onCampaignSelect: (campaignId: string) => void;
  onBack: () => void;
  onUpgrade: () => void;
}

const HistoricalCampaigns: React.FC<HistoricalCampaignsProps> = ({
  onCampaignSelect,
  onBack
}) => {
  const { user } = useUser();

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold vietnam-title mb-2">Historical Campaigns</h1>
          <p className="text-gray-600">Journey through Vietnam's heroic past</p>
        </div>
        
        <div className="w-12"></div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {historicalCampaigns.map((campaign) => {
          const progress = getCampaignProgress(campaign);
          const isCompleted = progress.completed === progress.total;

          return (
            <div
              key={campaign.id}
              className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl cursor-pointer hover:scale-105"
              onClick={() => onCampaignSelect(campaign.id)}
            >
              {/* Campaign Image */}
              <div className="relative mb-4">
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="w-full h-32 object-cover rounded-2xl"
                />
                
                {/* Completion Badge */}
                {isCompleted && (
                  <div className="absolute top-2 right-2 bg-green-500 rounded-full p-2">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Campaign Info */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{campaign.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{campaign.period}</p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {campaign.description}
                </p>

                {/* Progress Bar */}
                <div className="bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                  ></div>
                </div>

                {/* Progress Text */}
                <p className="text-xs text-gray-500">
                  {progress.completed}/{progress.total} milestones completed
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-yellow-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoricalCampaigns;
