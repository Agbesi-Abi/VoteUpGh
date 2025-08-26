import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '../types';
import { auth, db } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateVotes: (votesUsed: number) => void;
  addVotes: (votesToAdd: number) => void;
}

// Remove mock users database

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: async (email: string, password: string) => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const fbUser = userCredential.user;
          const user: User = {
            id: fbUser.uid,
            email: fbUser.email || '',
            name: fbUser.displayName || fbUser.email?.split('@')[0] || '',
            role: 'user',
            votesRemaining: 0,
            lastFreeVote: 0,
            createdAt: fbUser.metadata.creationTime || new Date().toISOString()
          };
          const token = await fbUser.getIdToken();
          set({ user, isAuthenticated: true, token });
          return true;
        } catch (error) {
          return false;
        }
      },

      register: async (email: string, password: string, name: string) => {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const fbUser = userCredential.user;
          if (auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: name });
          }
          // Create user document in Firestore
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userData: User = {
            id: fbUser.uid,
            email: fbUser.email || '',
            name: name,
            role: 'user',
            votesRemaining: 0,
            lastFreeVote: 0,
            createdAt: fbUser.metadata.creationTime || new Date().toISOString()
          };
          await setDoc(userDocRef, userData, { merge: true });
          const token = await fbUser.getIdToken();
          set({ user: userData, isAuthenticated: true, token });
          return true;
        } catch (error) {
          return false;
        }
      },

      logout: async () => {
        await signOut(auth);
        set({ user: null, isAuthenticated: false, token: null });
      },

      updateVotes: (votesUsed: number) => {
        const { user } = get();
        if (user) {
          const updatedUser = {
            ...user,
            votesRemaining: Math.max(0, user.votesRemaining - votesUsed),
            lastFreeVote: Date.now()
          };
          set({ user: updatedUser });
        }
      },

      addVotes: (votesToAdd: number) => {
        const { user } = get();
        if (user) {
          const updatedUser = {
            ...user,
            votesRemaining: user.votesRemaining + votesToAdd
          };
          set({ user: updatedUser });
        }
      }
    }),
    {
      name: 'voteupgh-auth'
    }
  )
);