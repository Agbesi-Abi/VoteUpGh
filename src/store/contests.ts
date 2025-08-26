
import { create } from 'zustand';
import { Contest, Participant } from '../types';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  increment,
  setDoc
} from 'firebase/firestore';

interface ContestStore {
  contests: Contest[];
  fetchContests: () => Promise<void>;
  addContest: (contest: Omit<Contest, 'id' | 'createdAt' | 'totalVotes'>) => Promise<void>;
  getActiveContests: () => Contest[];
  getContestById: (id: string) => Contest | undefined;
  addParticipant: (contestId: string, participant: Omit<Participant, 'id' | 'votes' | 'contestId'>) => Promise<void>;
  voteForParticipant: (contestId: string, participantId: string) => Promise<void>;
}



export const useContestStore = create<ContestStore>()((set, get) => ({
  contests: [],

  fetchContests: async () => {
    const querySnapshot = await getDocs(collection(db, 'contests'));
    const contests: Contest[] = [];
    querySnapshot.forEach(docSnap => {
      contests.push({ id: docSnap.id, ...docSnap.data() } as Contest);
    });
    set({ contests });
  },

  addContest: async (contestData) => {
    const docRef = await addDoc(collection(db, 'contests'), {
      ...contestData,
      createdAt: new Date().toISOString(),
      totalVotes: 0,
      participants: [],
    });
    await get().fetchContests();
  },

  getActiveContests: () => {
    const { contests } = get();
    return contests.filter(contest => contest.status === 'active');
  },

  getContestById: (id: string) => {
    const { contests } = get();
    return contests.find(contest => contest.id === id);
  },

  addParticipant: async (contestId, participantData) => {
    const contestRef = doc(db, 'contests', contestId);
    const contestSnap = await getDoc(contestRef);
    if (!contestSnap.exists()) return;
    const participant: Participant = {
      ...participantData,
      id: Date.now().toString(),
      votes: 0,
      contestId
    };
    const prevParticipants = contestSnap.data().participants || [];
    await updateDoc(contestRef, {
      participants: arrayUnion(participant)
    });
    await get().fetchContests();
  },

  voteForParticipant: async (contestId, participantId) => {
    const contestRef = doc(db, 'contests', contestId);
    const contestSnap = await getDoc(contestRef);
    if (!contestSnap.exists()) return;
    const contest = contestSnap.data();
    const participants: Participant[] = contest.participants || [];
    const updatedParticipants = participants.map((p: Participant) =>
      p.id === participantId ? { ...p, votes: (p.votes || 0) + 1 } : p
    );
    await updateDoc(contestRef, {
      participants: updatedParticipants,
      totalVotes: (contest.totalVotes || 0) + 1
    });
    await get().fetchContests();
  }
}));