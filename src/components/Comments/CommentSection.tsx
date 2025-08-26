import React, { useState } from 'react';
import { MessageCircle, Heart, Trash2, Send, User } from 'lucide-react';
import { useCommentStore } from '../../store/comments';
import { useAuthStore } from '../../store/auth';
import { Comment } from '../../types';

interface CommentSectionProps {
  contestId: string;
  participantId?: string;
  title?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ 
  contestId, 
  participantId, 
  title = "Comments" 
}) => {
  const { user } = useAuthStore();
  const { comments, addComment, getCommentsByContest, getCommentsByParticipant, likeComment, deleteComment } = useCommentStore();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const relevantComments = participantId 
    ? getCommentsByParticipant(participantId)
    : getCommentsByContest(contestId);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      addComment({
        userId: user.id,
        userName: user.name,
        contestId,
        participantId,
        content: newComment.trim()
      });
      
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = (commentId: string) => {
    if (!user) return;
    likeComment(commentId, user.id);
  };

  const handleDeleteComment = (commentId: string) => {
    if (!user) return;
    deleteComment(commentId, user.id);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="h-6 w-6 text-red-600" />
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
          {relevantComments.length}
        </span>
      </div>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={participantId ? "Share your thoughts about this participant..." : "Share your thoughts about this contest..."}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={3}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {newComment.length}/500 characters
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-center">
          <p className="text-gray-600">
            <strong>Sign in to join the conversation!</strong> Share your thoughts and engage with other voters.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {relevantComments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          relevantComments.map((comment) => (
            <div key={comment.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {comment.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900">{comment.userName}</p>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed mb-3">{comment.content}</p>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      disabled={!user}
                      className={`flex items-center space-x-1 text-sm transition-colors ${
                        user && comment.likedBy.includes(user.id)
                          ? 'text-red-600 hover:text-red-700'
                          : 'text-gray-500 hover:text-red-600'
                      } ${!user ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          user && comment.likedBy.includes(user.id) ? 'fill-current' : ''
                        }`} 
                      />
                      <span>{comment.likes}</span>
                    </button>
                    
                    {user && comment.userId === user.id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {relevantComments.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Showing {relevantComments.length} comment{relevantComments.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};