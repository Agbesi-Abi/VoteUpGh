import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Contest } from '../../types';
import { ContestCard } from './ContestCard';

interface ContestListProps {
  contests: Contest[];
  onContestClick: (contest: Contest) => void;
}

export const ContestList: React.FC<ContestListProps> = ({ contests, onContestClick }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<Contest['status'] | 'all'>('all');

  const filteredContests = contests.filter(contest => {
    const matchesSearch = contest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contest.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contest.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Ghana's Premier Voting Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover exciting contests, support your favorites, and be part of Ghana's vibrant community
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search contests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Contest['status'] | 'all')}
            className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Contests</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="ended">Ended</option>
          </select>
        </div>
      </div>

      {filteredContests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No contests found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredContests.map(contest => (
            <ContestCard
              key={contest.id}
              contest={contest}
              onClick={() => onContestClick(contest)}
            />
          ))}
        </div>
      )}
    </div>
  );
};