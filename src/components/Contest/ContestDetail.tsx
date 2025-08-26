import React, { useState, useEffect } from 'react';
import { ArrowLeft, Gift, Calendar, Users, Clock, Vote } from 'lucide-react';
import { Contest, Participant } from '../../types';
import { useAuthStore } from '../../store/auth';
import { useContestStore } from '../../store/contests';
import { CommentSection } from '../Comments/CommentSection';

interface ContestDetailProps {
  contest: Contest;
  onBack: () => void;
}

export const ContestDetail: React.FC<ContestDetailProps> = ({ contest, onBack }) => {
  const { user, updateVotes } = useAuthStore();
  const { voteForParticipant, getContestById } = useContestStore();
  const [currentContest, setCurrentContest] = useState(contest);
  const [canVote, setCanVote] = useState(false);
  const [timeToNextVote, setTimeToNextVote] = useState(0);

  useEffect(() => {
    const updated = getContestById(contest.id);
    if (updated) {
      setCurrentContest(updated);
    }
  }, [contest.id, getContestById]);

  useEffect(() => {
    if (!user) return;

    const checkVoteEligibility = () => {
      const now = Date.now();
      const timeSinceLastVote = now - user.lastFreeVote;
      const tenMinutes = 10 * 60 * 1000;

      if (user.votesRemaining > 0) {
        setCanVote(true);
        setTimeToNextVote(0);
      } else if (timeSinceLastVote >= tenMinutes) {
        setCanVote(true);
        setTimeToNextVote(0);
      } else {
        setCanVote(false);
        setTimeToNextVote(tenMinutes - timeSinceLastVote);
      }
    };

    checkVoteEligibility();
    const interval = setInterval(checkVoteEligibility, 1000);

    return () => clearInterval(interval);
  }, [user]);

  const handleVote = (participantId: string) => {
    if (!user || !canVote) return;

    voteForParticipant(currentContest.id, participantId);
    
    if (user.votesRemaining > 0) {
      updateVotes(1);
    } else {
      updateVotes(0); // Will set lastFreeVote timestamp
    }

    // Refresh contest data
    const updated = getContestById(contest.id);
    if (updated) {
      setCurrentContest(updated);
    }
  };

  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getVoteButtonText = () => {
    if (!user) return 'Sign in to vote';
    if (user.votesRemaining > 0) return 'Vote Now';
    if (canVote) return 'Free Vote';
    return `Wait ${formatTimeRemaining(timeToNextVote)}`;
  };

  const sortedParticipants = [...currentContest.participants].sort((a, b) => b.votes - a.votes);
  const maxVotes = Math.max(...currentContest.participants.map(p => p.votes), 1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-red-600 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Contests
      </button>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 px-8 py-12 text-white">
          <h1 className="text-4xl font-bold mb-4">{currentContest.title}</h1>
          <p className="text-xl opacity-90 mb-6">{currentContest.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <Gift className="h-6 w-6 mr-3" />
              <div>
                <p className="text-sm opacity-80">Prize</p>
                <p className="font-semibold">{currentContest.prize}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="h-6 w-6 mr-3" />
              <div>
                <p className="text-sm opacity-80">Participants</p>
                <p className="font-semibold">{currentContest.participants.length}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Vote className="h-6 w-6 mr-3" />
              <div>
                <p className="text-sm opacity-80">Total Votes</p>
                <p className="font-semibold">{currentContest.totalVotes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {currentContest.status !== 'active' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-yellow-800 font-medium">
            {currentContest.status === 'upcoming' 
              ? 'This contest has not started yet.' 
              : 'This contest has ended.'}
          </p>
        </div>
      )}

      {!user && currentContest.status === 'active' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-800">
            <strong>Sign in to vote!</strong> You can vote once every 10 minutes for free, or purchase vote packs.
          </p>
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
        
        {sortedParticipants.map((participant, index) => (
          <div key={participant.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                </div>
                
                <img
                  src={participant.image}
                  alt={participant.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900">{participant.name}</h3>
                  <p className="text-gray-600">{participant.bio}</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{participant.votes} votes</span>
                      <span>{((participant.votes / maxVotes) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(participant.votes / maxVotes) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                {currentContest.status === 'active' && (
                  <button
                    onClick={() => handleVote(participant.id)}
                    disabled={!canVote || !user}
                    className={`px-6 py-3 rounded-lg font-bold text-white min-w-[120px] ${
                      canVote && user
                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {getVoteButtonText()}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {currentContest.participants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No participants yet. Check back soon!</p>
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-12">
        <CommentSection 
          contestId={currentContest.id} 
          title="Contest Discussion" 
        />
      </div>
    </div>
  );
};