import React, { useState } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useContestStore } from '../../store/contests';
import { useAuthStore } from '../../store/auth';

interface CreateContestProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CreateContest: React.FC<CreateContestProps> = ({ onBack, onSuccess }) => {
  const { addContest } = useContestStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    prize: ''
  });
  
  const [participants, setParticipants] = useState([
    { name: '', bio: '', image: '' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const contest = {
      ...formData,
      organizerId: user.id,
      status: new Date(formData.startDate) > new Date() ? 'upcoming' as const : 'active' as const,
      participants: participants
        .filter(p => p.name && p.bio)
        .map((p, index) => ({
          ...p,
          image: p.image || `https://images.pexels.com/photos/${1640777 + index}/pexels-photo-${1640777 + index}.jpeg?auto=compress&cs=tinysrgb&w=300`
        }))
    };

    addContest(contest);
    onSuccess();
  };

  const addParticipant = () => {
    setParticipants([...participants, { name: '', bio: '', image: '' }]);
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const updateParticipant = (index: number, field: string, value: string) => {
    const updated = participants.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    );
    setParticipants(updated);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-red-600 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Contest</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contest Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prize Information
              </label>
              <input
                type="text"
                value={formData.prize}
                onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., GHS 1,000 + Trophy"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Participants</h3>
              <button
                type="button"
                onClick={addParticipant}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                <Plus className="h-4 w-4" />
                <span>Add Participant</span>
              </button>
            </div>

            <div className="space-y-4">
              {participants.map((participant, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Participant {index + 1}</h4>
                    {participants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeParticipant(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={participant.name}
                        onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL (optional)
                      </label>
                      <input
                        type="url"
                        value={participant.image}
                        onChange={(e) => updateParticipant(index, 'image', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio/Description
                    </label>
                    <textarea
                      value={participant.bio}
                      onChange={(e) => updateParticipant(index, 'bio', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium"
            >
              Create Contest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};