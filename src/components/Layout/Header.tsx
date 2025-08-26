import React from 'react';
import { User, LogOut, Plus, BarChart3 } from 'lucide-react';
import { useAuthStore } from '../../store/auth';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-lg border-b-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 via-yellow-500 to-green-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">VoteUpGH</h1>
              <p className="text-xs text-gray-600">Ghana's Voting Platform</p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 'home'
                  ? 'text-red-600 bg-red-50'
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              Contests
            </button>
            <button
              onClick={() => onNavigate('vote-packs')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 'vote-packs'
                  ? 'text-red-600 bg-red-50'
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              Buy Votes
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'admin'
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                Admin
              </button>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-green-600">{user.votesRemaining} votes available</p>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('create-contest')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Create Contest</span>
                </button>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-red-600 p-2"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};