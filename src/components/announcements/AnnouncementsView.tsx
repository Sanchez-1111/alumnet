import React, { useState, useMemo } from 'react';
import {
  Megaphone,
  AlertCircle,
  Plus,
  Trash2,
  X,
  Sparkles,
  Calendar,
  UserCheck,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { useAlumni } from '../../context/AlumniContext';
import { Announcement } from '../../types';

export const AnnouncementsView: React.FC = () => {
  const {
    currentUser,
    announcements,
    createAnnouncement,
    deleteAnnouncement,
    permissions
  } = useAlumni();

  const [filterType, setFilterType] = useState<'all' | 'important'>('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'general' | 'academic' | 'career' | 'campus' | 'reunion'>('general');
  const [isImportant, setIsImportant] = useState(false);

  const filteredAnnouncements = useMemo(() => {
    return announcements
      .filter((a) => (filterType === 'important' ? a.isImportant : true))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [announcements, filterType]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    createAnnouncement({
      title,
      content,
      category,
      isImportant
    });
    setTitle('');
    setContent('');
    setIsImportant(false);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                Announcements & Official Notices
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                {announcements.length} Published
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Official university updates, reunion calls, academic milestones, and campus news.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-stone-100 p-1 rounded-xl">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterType === 'all'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Notices
              </button>
              <button
                onClick={() => setFilterType('important')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  filterType === 'important'
                    ? 'bg-white text-red-700 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                <span>Important Only</span>
              </button>
            </div>

            {permissions.canPostAnnouncements && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Post Notice</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((ann) => (
          <div
            key={ann.id}
            onClick={() => setSelectedAnnouncement(ann)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              ann.isImportant
                ? 'bg-red-50/40 border-red-200 hover:border-red-300'
                : 'bg-white border-stone-200 hover:border-blue-300'
            } shadow-2xs hover:shadow-xs`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {ann.isImportant && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded-md flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Important Notice
                  </span>
                )}
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-stone-100 text-stone-700 rounded-md uppercase">
                  {ann.category}
                </span>
                <span className="text-xs text-stone-400">
                  {new Date(ann.createdAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>

              {permissions.canDeleteAnnouncements && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this announcement?')) deleteAnnouncement(ann.id);
                  }}
                  className="p-1 text-stone-400 hover:text-red-600 rounded"
                  title="Delete Announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <h2 className="text-base sm:text-lg font-bold text-stone-900 mt-2 hover:text-blue-600">
              {ann.title}
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 mt-2 line-clamp-3 leading-relaxed">
              {ann.content}
            </p>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-800">{ann.authorName}</span>
                <span>•</span>
                <span className="uppercase text-[10px] bg-stone-100 px-1.5 py-0.5 rounded font-medium">
                  {ann.authorRole}
                </span>
              </div>

              <span className="text-blue-600 font-semibold text-xs hover:underline">
                Read full announcement &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL DRAWER / MODAL */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                {selectedAnnouncement.isImportant && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded-md flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Important Notice
                  </span>
                )}
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-stone-100 text-stone-700 rounded-md uppercase">
                  {selectedAnnouncement.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-bold text-stone-900 leading-snug">
                {selectedAnnouncement.title}
              </h2>

              <div className="mt-2.5 flex items-center gap-2 text-xs text-stone-500 pb-4 border-b border-stone-100">
                <span className="font-bold text-stone-800">{selectedAnnouncement.authorName}</span>
                <span>({selectedAnnouncement.authorRole.toUpperCase()})</span>
                <span>•</span>
                <span>
                  {new Date(selectedAnnouncement.createdAt).toLocaleDateString([], {
                    dateStyle: 'full'
                  })}
                </span>
              </div>

              <div className="mt-5 text-sm text-stone-700 leading-relaxed space-y-4 whitespace-pre-line">
                {selectedAnnouncement.content}
              </div>

              <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-end">
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg"
                >
                  Close Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE ANNOUNCEMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-lg p-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900">Publish New Official Announcement</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Announcement Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 2026 Distinguished Alumni Awards Nomination"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700"
                  >
                    <option value="general">General Broadcast</option>
                    <option value="academic">Academic & Research</option>
                    <option value="career">Career & Placement</option>
                    <option value="campus">Campus News</option>
                    <option value="reunion">Reunion & Chapters</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={isImportant}
                      onChange={(e) => setIsImportant(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span className="text-red-700 font-semibold">Flag as Important</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Content / Message *</label>
                <textarea
                  required
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the full announcement text, key dates, deadlines, and instructions..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow-xs"
                >
                  Broadcast Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
