export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  votesRemaining: number;
  lastFreeVote: number;
  createdAt: string;
}

export interface Participant {
  id: string;
  name: string;
  image: string;
  bio: string;
  votes: number;
  contestId: string;
}

export interface Contest {
  imageUrl: string;
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  prize: string;
  organizerId: string;
  status: 'upcoming' | 'active' | 'ended';
  participants: Participant[];
  totalVotes: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  votesReceived: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface VotePack {
  id: string;
  name: string;
  price: number;
  votes: number;
  popular?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  contestId: string;
  participantId?: string;
  content: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
}