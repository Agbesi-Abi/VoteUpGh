import React, { useState } from 'react';
import { ArrowLeft, BarChart3, Users, Vote, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { useContestStore } from '../../store/contests';

interface AdminDashboardProps {
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const { contests } = useContestStore();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'contests' | 'analytics'>('overview');

  const totalContests = contests.length;
  const activeContests = contests.filter(c => c.status === 'active').length;
  const totalVotes = contests.reduce((sum, contest) => sum + contest.totalVotes, 0);
  const totalParticipants = contests.reduce((sum, contest) => sum + contest.participants.length, 0);

  const tabs = [
    { id: 'overview' as const, name: 'Overview', icon: BarChart3 },
    { id: 'contests' as const, name: 'Contest Management', icon: Calendar },
    { id: 'analytics' as const, name: 'Analytics', icon: TrendingUp }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-red-600 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  selectedTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {selectedTab === 'overview' && (
        <div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Contests</dt>
                    <dd className="text-2xl font-bold text-gray-900">{totalContests}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Contests</dt>
                    <dd className="text-2xl font-bold text-gray-900">{activeContests}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Vote className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Votes</dt>
                    <dd className="text-2xl font-bold text-gray-900">{totalVotes}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Participants</dt>
                    <dd className="text-2xl font-bold text-gray-900">{totalParticipants}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {contests.slice(0, 5).map((contest) => (
                <div key={contest.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{contest.title}</p>
                    <p className="text-sm text-gray-600">{contest.participants.length} participants • {contest.totalVotes} votes</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    contest.status === 'active' ? 'bg-green-100 text-green-800' :
                    contest.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {contest.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'contests' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Contests</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Votes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contests.map((contest) => (
                    <tr key={contest.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{contest.title}</div>
                          <div className="text-sm text-gray-500">{contest.description.substring(0, 60)}...</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          contest.status === 'active' ? 'bg-green-100 text-green-800' :
                          contest.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {contest.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contest.participants.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contest.totalVotes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(contest.endDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contest Performance</h3>
            <div className="space-y-4">
              {contests.map((contest) => (
                <div key={contest.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">{contest.title}</span>
                    <span className="text-sm text-gray-600">{contest.totalVotes} votes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full"
                      style={{ width: `${Math.min((contest.totalVotes / Math.max(...contests.map(c => c.totalVotes), 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Participants</h3>
            <div className="space-y-4">
              {contests
                .flatMap(contest => contest.participants.map(p => ({ ...p, contestTitle: contest.title })))
                .sort((a, b) => b.votes - a.votes)
                .slice(0, 5)
                .map((participant, index) => (
                  <div key={participant.id} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                    }`}>
                      {index + 1}
                    </div>
                    <img src={participant.image} alt={participant.name} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                      <p className="text-xs text-gray-500">{participant.contestTitle}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{participant.votes}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};