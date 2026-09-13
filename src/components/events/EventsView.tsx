import React, { useState, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Heart,
  MessageCircle,
  Plus,
  Filter,
  Check,
  Video,
  Clock,
  Sparkles,
  Edit2,
  Trash2,
  Share2,
  X,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Send,
  CornerDownRight
} from 'lucide-react';
import { useAlumni } from '../../context/AlumniContext';
import { AlumniEvent } from '../../types';

export const EventsView: React.FC = () => {
  const {
    currentUser,
    events,
    createEvent,
    editEvent,
    deleteEvent,
    toggleLikeEvent,
    addCommentToEvent,
    rsvpEvent,
    permissions
  } = useAlumni();

  const [filterType, setFilterType] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<AlumniEvent | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [expandedThreads, setExpandedThreads] = useState<Record<string, boolean>>({
    evt_homecoming_2026: true // Open reunion discussion thread by default for high engagement
  });
  const [cardCommentInputs, setCardCommentInputs] = useState<Record<string, string>>({});

  // Form State for Create / Edit
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formType, setFormType] = useState<'reunion' | 'workshop' | 'networking' | 'webinar' | 'social'>('networking');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formHeroImage, setFormHeroImage] = useState('');
  const [formIsVirtual, setFormIsVirtual] = useState(false);
  const [formIsImportant, setFormIsImportant] = useState(false);
  const [formMaxAttendees, setFormMaxAttendees] = useState(250);

  const now = new Date();

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const eventDate = new Date(e.startDate);
      if (filterType === 'upcoming') {
        return eventDate >= now;
      }
      if (filterType === 'past') {
        return eventDate < now;
      }
      return true;
    }).sort((a, b) => {
      if (filterType === 'past') {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
  }, [events, filterType, now]);

  const openCreateModal = () => {
    setEditingEventId(null);
    setFormTitle('');
    setFormDescription('');
    setFormLocation('Campus Main Pavilion, San Francisco, CA');
    setFormType('networking');
    // default to 2 weeks ahead
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 14);
    setFormStartDate(nextDate.toISOString().slice(0, 16));
    setFormEndDate(nextDate.toISOString().slice(0, 16));
    setFormHeroImage('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&auto=format&fit=crop&q=80');
    setFormIsVirtual(false);
    setFormIsImportant(false);
    setFormMaxAttendees(200);
    setShowCreateModal(true);
  };

  const openEditModal = (e: AlumniEvent) => {
    setEditingEventId(e.id);
    setFormTitle(e.title);
    setFormDescription(e.description);
    setFormLocation(e.location);
    setFormType(e.type);
    setFormStartDate(e.startDate.slice(0, 16));
    setFormEndDate(e.endDate.slice(0, 16));
    setFormHeroImage(e.heroImageUrl);
    setFormIsVirtual(e.isVirtual);
    setFormIsImportant(e.isImportant);
    setFormMaxAttendees(e.maxAttendees);
    setShowCreateModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDescription || !formLocation) return;

    if (editingEventId) {
      editEvent(editingEventId, {
        title: formTitle,
        description: formDescription,
        location: formLocation,
        type: formType,
        startDate: new Date(formStartDate).toISOString(),
        endDate: new Date(formEndDate).toISOString(),
        heroImageUrl: formHeroImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&auto=format&fit=crop&q=80',
        isVirtual: formIsVirtual,
        isImportant: formIsImportant,
        maxAttendees: Number(formMaxAttendees)
      });
    } else {
      createEvent({
        title: formTitle,
        description: formDescription,
        location: formLocation,
        type: formType,
        startDate: new Date(formStartDate).toISOString(),
        endDate: new Date(formEndDate).toISOString(),
        heroImageUrl: formHeroImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&auto=format&fit=crop&q=80',
        isVirtual: formIsVirtual,
        isImportant: formIsImportant,
        maxAttendees: Number(formMaxAttendees)
      });
    }

    setShowCreateModal(false);
  };

  const handlePostComment = (eventId: string) => {
    if (!commentInput.trim()) return;
    addCommentToEvent(eventId, commentInput);
    setCommentInput('');
    // refresh selected event
    if (selectedEventForDetail?.id === eventId) {
      const updated = events.find((e) => e.id === eventId);
      if (updated) setSelectedEventForDetail(updated);
    }
  };

  const handlePostCardComment = (eventId: string) => {
    const text = cardCommentInputs[eventId];
    if (!text || !text.trim()) return;
    addCommentToEvent(eventId, text.trim());
    setCardCommentInputs((prev) => ({ ...prev, [eventId]: '' }));
  };

  const toggleThread = (eventId: string) => {
    setExpandedThreads((prev) => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Filters & Create Event Button */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                Alumni Events & Reunions
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                {events.length} Total
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Connect with fellow graduates at in-person gatherings, campus homecomings, and international webinars.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl">
              <button
                onClick={() => setFilterType('upcoming')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterType === 'upcoming'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilterType('past')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterType === 'past'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Past
              </button>
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterType === 'all'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All
              </button>
            </div>

            {/* Create Event (Restricted: admin, registrar, staff, moderator) */}
            {permissions.canCreateEvents && (
              <button
                onClick={openCreateModal}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create Event</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-stone-200">
          <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-stone-700">No events found</p>
          <p className="text-xs text-stone-400 mt-1">There are no {filterType} events scheduled.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((evt) => {
            const eventDate = new Date(evt.startDate);
            const isLiked = currentUser ? (evt.likes || []).includes(currentUser.uid) : false;

            return (
              <div
                key={evt.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Hero Image */}
                  <div className="relative h-44 overflow-hidden bg-stone-100">
                    <img
                      src={evt.heroImageUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Flags */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      {evt.isImportant && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded-md shadow-xs">
                          Important
                        </span>
                      )}
                      {evt.isVirtual ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded-md flex items-center gap-1 shadow-xs">
                          <Video className="w-3 h-3" />
                          Virtual
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-black/60 backdrop-blur-xs text-white rounded-md">
                          In-Person
                        </span>
                      )}
                    </div>

                    {/* Date Badge */}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs rounded-xl px-2.5 py-1 text-center shadow-xs border border-stone-200">
                      <span className="text-[10px] uppercase font-bold text-blue-700 block">
                        {eventDate.toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-sm font-extrabold text-stone-900 block leading-tight">
                        {eventDate.getDate()}
                      </span>
                    </div>

                    {/* Admin Delete/Edit button */}
                    {permissions.canDeleteEventsComments && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-xs rounded-lg p-1 border border-stone-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(evt);
                          }}
                          className="p-1 hover:text-blue-600 text-stone-600 rounded"
                          title="Edit Event"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Delete this event?')) deleteEvent(evt.id);
                          }}
                          className="p-1 hover:text-red-600 text-stone-600 rounded"
                          title="Delete Event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4">
                    <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-1">
                      {evt.type}
                    </div>

                    <h3
                      onClick={() => setSelectedEventForDetail(evt)}
                      className="text-base font-bold text-stone-900 hover:text-blue-600 cursor-pointer line-clamp-2 leading-snug"
                    >
                      {evt.title}
                    </h3>

                    <div className="mt-2 space-y-1 text-xs text-stone-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>
                          {eventDate.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}{' '}
                          • {eventDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 mt-2.5 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>
                </div>

                {/* Footer Controls: RSVP, Likes & Comments */}
                <div className="p-4 pt-3 bg-stone-50/60 border-t border-stone-100">
                  <div className="flex items-center justify-between mb-2.5 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-stone-400" />
                      <span className="font-semibold text-stone-700">{evt.attendeesCount}</span> attendees
                    </span>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleLikeEvent(evt.id)}
                        className={`flex items-center gap-1 text-xs transition-colors ${
                          isLiked ? 'text-red-600 font-bold' : 'text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-600' : ''}`} />
                        <span>{(evt.likes || []).length}</span>
                      </button>

                      <button
                        onClick={() => toggleThread(evt.id)}
                        className="flex items-center gap-1 text-xs text-stone-600 hover:text-[#991B1B] font-medium"
                        title="Toggle Discussion Thread"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#991B1B]" />
                        <span>{(evt.comments || []).length}</span>
                      </button>
                    </div>
                  </div>

                  {/* Dedicated Comment Section / Discussion Thread Button */}
                  <div className="mb-2.5">
                    <button
                      type="button"
                      onClick={() => toggleThread(evt.id)}
                      className={`w-full py-2 px-3 flex items-center justify-between rounded-xl text-xs font-bold transition-all border ${
                        expandedThreads[evt.id]
                          ? 'bg-[#991B1B] text-white border-[#991B1B] shadow-sm'
                          : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className={`w-4 h-4 ${expandedThreads[evt.id] ? 'text-white' : 'text-[#991B1B]'}`} />
                        <span>{evt.type === 'reunion' ? 'Reunion Discussion Thread' : 'Discussion Thread & Comments'}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                            expandedThreads[evt.id] ? 'bg-white/20 text-white' : 'bg-red-50 text-[#991B1B]'
                          }`}
                        >
                          {(evt.comments || []).length}
                        </span>
                      </div>
                      {expandedThreads[evt.id] ? (
                        <ChevronUp className="w-4 h-4 text-white" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-stone-400" />
                      )}
                    </button>
                  </div>

                  {/* Inline Discussion Thread Accordion */}
                  {expandedThreads[evt.id] && (
                    <div className="mb-3 pt-2.5 border-t border-stone-200 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1">
                          <MessageCircle className="w-3 h-3 text-[#991B1B]" />
                          <span>Community Discussion</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedEventForDetail(evt)}
                          className="text-[10px] font-bold text-[#991B1B] hover:underline"
                        >
                          Fullscreen View ↗
                        </button>
                      </div>

                      {/* Comments stream */}
                      <div className="space-y-2 max-h-52 overflow-y-auto mb-2.5 pr-1">
                        {(evt.comments || []).length === 0 ? (
                          <div className="py-3 text-center bg-white rounded-xl border border-stone-200 text-stone-400 text-xs italic">
                            No comments yet. Be the first to start the discussion!
                          </div>
                        ) : (
                          (evt.comments || []).map((comm) => (
                            <div
                              key={comm.id}
                              className="p-2.5 bg-white rounded-xl border border-stone-200/80 shadow-2xs flex items-start gap-2.5"
                            >
                              <img
                                src={comm.authorAvatar}
                                alt={comm.authorName}
                                className="w-7 h-7 rounded-full object-cover shrink-0 border border-stone-200"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-bold text-stone-900 truncate">
                                    {comm.authorName}
                                  </span>
                                  <span className="text-[10px] text-stone-400 shrink-0">
                                    {new Date(comm.createdAt).toLocaleDateString([], {
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                                <p className="text-xs text-stone-700 mt-0.5 leading-relaxed break-words">
                                  {comm.text}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Comment Input Box */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handlePostCardComment(evt.id);
                        }}
                        className="flex items-center gap-1.5"
                      >
                        <input
                          type="text"
                          value={cardCommentInputs[evt.id] || ''}
                          onChange={(e) =>
                            setCardCommentInputs((prev) => ({
                              ...prev,
                              [evt.id]: e.target.value
                            }))
                          }
                          placeholder={evt.type === 'reunion' ? "Ask about reunion, batch tables, or greet..." : "Write a comment or question..."}
                          className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#991B1B] focus:border-[#991B1B]"
                        />
                        <button
                          type="submit"
                          disabled={!cardCommentInputs[evt.id]?.trim()}
                          className="px-3 py-1.5 bg-[#991B1B] hover:bg-[#7f1616] disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                        >
                          <Send className="w-3 h-3" />
                          <span>Post</span>
                        </button>
                      </form>
                    </div>
                  )}

                  {/* RSVP Buttons */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => rsvpEvent(evt.id, 'going')}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        evt.userRsvp === 'going'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      Going
                    </button>
                    <button
                      onClick={() => rsvpEvent(evt.id, 'interested')}
                      className={`py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        evt.userRsvp === 'interested'
                          ? 'bg-amber-600 text-white shadow-2xs'
                          : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      Interested
                    </button>
                    <button
                      onClick={() => setSelectedEventForDetail(evt)}
                      className="py-1.5 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-center transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EVENT DETAIL MODAL */}
      {selectedEventForDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            {/* Hero Banner inside modal */}
            <div className="relative h-56 bg-stone-900 shrink-0">
              <img
                src={selectedEventForDetail.heroImageUrl}
                alt={selectedEventForDetail.title}
                className="w-full h-full object-cover opacity-80"
              />
              <button
                onClick={() => setSelectedEventForDetail(null)}
                className="absolute top-4 right-4 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  {selectedEventForDetail.isImportant && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-red-600 rounded">
                      Important
                    </span>
                  )}
                  {selectedEventForDetail.isVirtual && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-600 rounded">
                      Virtual Event
                    </span>
                  )}
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-white/20 backdrop-blur-xs rounded uppercase">
                    {selectedEventForDetail.type}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold leading-tight">
                  {selectedEventForDetail.title}
                </h2>
              </div>
            </div>

            {/* Content & Comments Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Event Metadata */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <div>
                  <span className="text-stone-400 block">Date & Time</span>
                  <span className="font-semibold text-stone-800">
                    {new Date(selectedEventForDetail.startDate).toLocaleString([], {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">Location / Platform</span>
                  <span className="font-semibold text-stone-800">
                    {selectedEventForDetail.location}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">Organized By</span>
                  <span className="font-semibold text-stone-800">
                    {selectedEventForDetail.createdByName || 'University Alumni Board'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">Attending</span>
                  <span className="font-semibold text-blue-700">
                    {selectedEventForDetail.attendeesCount} / {selectedEventForDetail.maxAttendees} max
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                  About this Event
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                  {selectedEventForDetail.description}
                </p>
              </div>

              {/* Comments Section */}
              <div className="pt-4 border-t border-stone-200">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
                  Alumni Discussions ({(selectedEventForDetail.comments || []).length})
                </h3>

                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {(selectedEventForDetail.comments || []).length === 0 ? (
                    <p className="text-xs text-stone-400 italic">No comments yet. Start the conversation!</p>
                  ) : (
                    (selectedEventForDetail.comments || []).map((comm) => (
                      <div key={comm.id} className="flex items-start gap-2.5 p-2.5 bg-stone-50 rounded-xl">
                        <img
                          src={comm.authorAvatar}
                          alt={comm.authorName}
                          className="w-7 h-7 rounded-full object-cover border border-stone-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-900">{comm.authorName}</span>
                            <span className="text-[10px] text-stone-400">
                              {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-stone-700 mt-0.5">{comm.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Comment Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Write a comment or ask a question..."
                    className="flex-1 px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handlePostComment(selectedEventForDetail.id);
                      }
                    }}
                  />
                  <button
                    onClick={() => handlePostComment(selectedEventForDetail.id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT EVENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-lg p-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900">
                {editingEventId ? 'Edit Event Details' : 'Create New Alumni Event'}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 mt-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. 2026 Grand Alumni Homecoming & Tech Gala"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Provide event details, schedule, dress code, speaker lineup..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Event Category</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700"
                  >
                    <option value="reunion">Reunion</option>
                    <option value="networking">Networking</option>
                    <option value="workshop">Workshop</option>
                    <option value="webinar">Webinar</option>
                    <option value="social">Social Mixer</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Location / Platform *</label>
                  <input
                    type="text"
                    required
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Venue name or Zoom Link"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Hero Image URL</label>
                <input
                  type="url"
                  value={formHeroImage}
                  onChange={(e) => setFormHeroImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={formIsVirtual}
                    onChange={(e) => setFormIsVirtual(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Virtual Event</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={formIsImportant}
                    onChange={(e) => setFormIsImportant(e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span>Flag as Important</span>
                </label>
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
                  {editingEventId ? 'Save Changes' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
