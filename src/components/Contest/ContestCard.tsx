import React from 'react';
import { Calendar, Gift, Users, TrendingUp, Image as ImageIcon } from 'lucide-react';
import { Contest } from '../../types';

interface ContestCardProps {
  contest: Contest;
  onClick: () => void;
}

export const ContestCard: React.FC<ContestCardProps> = ({ contest, onClick }) => {
  const getStatusColor = (status: Contest['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ended':
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Fallback image in case the contest doesn't have one
  const contestImage = contest.imageUrl || 'https://i.pinimg.com/736x/fc/6c/cf/fc6ccf6314f207173840e9e368cc20b0.jpg';

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={contestImage} 
          alt={contest.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.src = 'https://i.pinimg.com/736x/99/79/9c/99799ca77ba9bbe6dc33af5ab4a87b02.jpg';
          }}
        />
        
        {/* Status Badge Overlay */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(contest.status)}`}>
            {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
          </span>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Vote Now Banner for Active Contests */}
        {contest.status === 'active' && (
          <div className="absolute bottom-4 left-4 bg-gradient-to-r from-red-600 to-yellow-500 px-4 py-2 rounded-lg">
            <div className="flex items-center text-white font-medium text-sm">
              <span>Vote Now</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{contest.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{contest.description}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-red-500 flex-shrink-0" />
            <span>{formatDate(contest.startDate)} - {formatDate(contest.endDate)}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Gift className="h-4 w-4 mr-2 text-yellow-500 flex-shrink-0" />
            <span className="line-clamp-1">{contest.prize}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
              <span>{contest.participants.length} participants</span>
            </div>
            <div className="flex items-center text-sm font-medium text-gray-900">
              <TrendingUp className="h-4 w-4 mr-1 text-blue-500 flex-shrink-0" />
              <span>{contest.totalVotes} votes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};