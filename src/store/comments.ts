import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Comment } from '../types';

interface CommentStore {
  comments: Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'likedBy'>) => void;
  getCommentsByContest: (contestId: string) => Comment[];
  getCommentsByParticipant: (participantId: string) => Comment[];
  likeComment: (commentId: string, userId: string) => void;
  deleteComment: (commentId: string, userId: string) => void;
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Admin User',
    contestId: '1',
    participantId: '1',
    content: 'Mama Akosua\'s jollof is absolutely amazing! The perfect blend of spices and that smoky flavor is unmatched. Definitely deserves my vote! 🔥',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    likes: 12,
    likedBy: ['1', '2', '3']
  },
  {
    id: '2',
    userId: '2',
    userName: 'Food Lover',
    contestId: '1',
    content: 'This contest is so exciting! All the participants are bringing their A-game. May the best jollof win! 🍚✨',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    likes: 8,
    likedBy: ['1', '4', '5']
  },
  {
    id: '3',
    userId: '3',
    userName: 'Accra Foodie',
    contestId: '1',
    participantId: '3',
    content: 'Uncle Ben\'s Spot has been consistent for years! Their jollof reminds me of my grandmother\'s cooking. Nostalgic and delicious! 👨‍🍳',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    likes: 15,
    likedBy: ['1', '2', '4', '6']
  }
];

export const useCommentStore = create<CommentStore>()(
  persist(
    (set, get) => ({
      comments: mockComments,

      addComment: (commentData) => {
        const comment: Comment = {
          ...commentData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          likes: 0,
          likedBy: []
        };
        
        set(state => ({
          comments: [comment, ...state.comments]
        }));
      },

      getCommentsByContest: (contestId: string) => {
        const { comments } = get();
        return comments
          .filter(comment => comment.contestId === contestId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getCommentsByParticipant: (participantId: string) => {
        const { comments } = get();
        return comments
          .filter(comment => comment.participantId === participantId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      likeComment: (commentId: string, userId: string) => {
        set(state => ({
          comments: state.comments.map(comment =>
            comment.id === commentId
              ? {
                  ...comment,
                  likes: comment.likedBy.includes(userId) 
                    ? comment.likes - 1 
                    : comment.likes + 1,
                  likedBy: comment.likedBy.includes(userId)
                    ? comment.likedBy.filter(id => id !== userId)
                    : [...comment.likedBy, userId]
                }
              : comment
          )
        }));
      },

      deleteComment: (commentId: string, userId: string) => {
        set(state => ({
          comments: state.comments.filter(comment => 
            comment.id !== commentId || comment.userId === userId
          )
        }));
      }
    }),
    {
      name: 'voteupgh-comments'
    }
  )
);