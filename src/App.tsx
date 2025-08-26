import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { AuthForm } from './components/Auth/AuthForm';
import { ContestList } from './components/Contest/ContestList';
import { ContestDetail } from './components/Contest/ContestDetail';
import { CreateContest } from './components/Contest/CreateContest';
import { VotePacksPage } from './components/VotePacks/VotePacksPage';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { useAuthStore } from './store/auth';
import { useContestStore } from './store/contests';
import { Contest } from './types';

type Page = 'home' | 'auth' | 'contest-detail' | 'create-contest' | 'vote-packs' | 'admin';

function App() {
  const { isAuthenticated } = useAuthStore();
  const { contests } = useContestStore();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    if (page !== 'contest-detail') {
      setSelectedContest(null);
    }
  };

  const handleContestClick = (contest: Contest) => {
    setSelectedContest(contest);
    setCurrentPage('contest-detail');
  };

  const handleAuthSuccess = () => {
    setCurrentPage('home');
  };

  const handleContestCreated = () => {
    setCurrentPage('home');
  };

  if (!isAuthenticated && currentPage !== 'home') {
    return <AuthForm onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage !== 'auth' && (
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
      )}

      {currentPage === 'auth' && (
        <AuthForm onSuccess={handleAuthSuccess} />
      )}

      {currentPage === 'home' && (
        <ContestList
          contests={contests}
          onContestClick={handleContestClick}
        />
      )}

      {currentPage === 'contest-detail' && selectedContest && (
        <ContestDetail
          contest={selectedContest}
          onBack={() => handleNavigate('home')}
        />
      )}

      {currentPage === 'create-contest' && (
        <CreateContest
          onBack={() => handleNavigate('home')}
          onSuccess={handleContestCreated}
        />
      )}

      {currentPage === 'vote-packs' && (
        <VotePacksPage onBack={() => handleNavigate('home')} />
      )}

      {currentPage === 'admin' && (
        <AdminDashboard onBack={() => handleNavigate('home')} />
      )}
    </div>
  );
}

export default App;