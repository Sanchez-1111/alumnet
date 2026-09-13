import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MessageSquare,
  Send,
  Search,
  CheckCheck,
  UserPlus,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';
import { useAlumni } from '../../context/AlumniContext';
import { UserProfile } from '../../types';

export const MessagesView: React.FC = () => {
  const {
    currentUser,
    users,
    chats,
    messages,
    sendMessage,
    activeChatId,
    setActiveChatId,
    markChatAsRead,
    getOrCreateChat,
    setSelectedUserIdForModal
  } = useAlumni();

  const [inputMessage, setInputMessage] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active chat object
  const activeChat = useMemo(() => {
    if (!activeChatId) return chats[0] || null;
    return chats.find((c) => c.id === activeChatId) || null;
  }, [chats, activeChatId]);

  // The other member in the active conversation
  const recipientUser = useMemo(() => {
    if (!activeChat || !currentUser) return null;
    const otherId = activeChat.memberIds.find((id) => id !== currentUser.uid);
    return users.find((u) => u.uid === otherId) || null;
  }, [activeChat, currentUser, users]);

  // Current chat messages
  const activeChatMessages = useMemo(() => {
    if (!activeChat) return [];
    return messages[activeChat.id] || [];
  }, [activeChat, messages]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatMessages]);

  // Mark active chat as read when opened
  useEffect(() => {
    if (activeChat) {
      markChatAsRead(activeChat.id);
    }
  }, [activeChat?.id]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeChat) return;
    sendMessage(activeChat.id, inputMessage);
    setInputMessage('');
  };

  // Filtered chats list
  const filteredChats = useMemo(() => {
    return chats.filter((c) => {
      const otherId = c.memberIds.find((id) => id !== currentUser?.uid);
      const other = users.find((u) => u.uid === otherId);
      if (!other) return false;
      return (
        other.name.toLowerCase().includes(chatSearch.toLowerCase()) ||
        c.lastMessage.toLowerCase().includes(chatSearch.toLowerCase())
      );
    });
  }, [chats, users, currentUser, chatSearch]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden h-[calc(100vh-12rem)] min-h-[500px] flex">
      
      {/* LEFT COLUMN: Chat list */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-stone-200 flex flex-col shrink-0 ${
          activeChatId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Header with Search and New Message button */}
        <div className="p-4 border-b border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>Direct Messages</span>
            </h2>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="p-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1 border border-blue-200"
              title="Start conversation with any alumnus or staff"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New Chat</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Threads List */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
          {filteredChats.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400">
              No conversations found. Click "New Chat" to connect.
            </div>
          ) : (
            filteredChats.map((chat) => {
              const otherId = (chat.memberIds || []).find((id) => id !== currentUser?.uid);
              const other = users.find((u) => u.uid === otherId);
              const isSelected = activeChat?.id === chat.id;
              const unread = currentUser && chat.unreadCount ? chat.unreadCount[currentUser.uid] || 0 : 0;

              return (
                <div
                  key={chat.id}
                  onClick={() => {
                    setActiveChatId(chat.id);
                    markChatAsRead(chat.id);
                  }}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/70' : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={other?.profilePictureUrl}
                      alt={other?.name}
                      className="w-11 h-11 rounded-full object-cover border border-stone-200 shrink-0"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-xs font-bold text-stone-900 truncate">{other?.name}</h3>
                      <span className="text-[10px] text-stone-400 shrink-0">
                        {new Date(chat.lastMessageAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 truncate mt-0.5">{chat.lastMessage}</p>

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-stone-400 font-medium truncate">
                        {other?.course || other?.role.toUpperCase()}
                      </span>
                      {unread > 0 && (
                        <span className="px-1.5 py-0.2 bg-blue-600 text-white rounded-full text-[10px] font-bold">
                          {unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Active Chat Conversation */}
      <div className={`flex-1 flex flex-col bg-stone-50/40 ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
        {recipientUser ? (
          <>
            {/* Conversation Header */}
            <div className="p-3.5 sm:p-4 bg-white border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveChatId(null)}
                  className="md:hidden p-1.5 rounded-lg text-stone-500 hover:bg-stone-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <img
                  src={recipientUser.profilePictureUrl}
                  alt={recipientUser.name}
                  onClick={() => setSelectedUserIdForModal(recipientUser.uid)}
                  className="w-10 h-10 rounded-full object-cover border border-stone-200 cursor-pointer"
                />

                <div>
                  <h3
                    onClick={() => setSelectedUserIdForModal(recipientUser.uid)}
                    className="text-sm font-bold text-stone-900 hover:text-blue-600 cursor-pointer"
                  >
                    {recipientUser.name}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Batch of {recipientUser.batch} • {recipientUser.course}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedUserIdForModal(recipientUser.uid)}
                  className="px-2.5 py-1 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
                >
                  View Profile
                </button>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <div className="text-center my-2">
                <span className="px-3 py-1 bg-stone-200/60 rounded-full text-[10px] font-medium text-stone-600">
                  Secure peer-to-peer alumni chat
                </span>
              </div>

              {activeChatMessages.length === 0 ? (
                <div className="text-center py-12 text-xs text-stone-400">
                  No messages yet. Send a greeting to start chatting!
                </div>
              ) : (
                activeChatMessages.map((msg) => {
                  const isMine = msg.senderId === currentUser?.uid;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMine
                            ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                            : 'bg-white border border-stone-200 text-stone-900 rounded-bl-xs shadow-2xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-stone-400 mt-1 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3.5 bg-white border-t border-stone-200 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Message ${recipientUser.name}...`}
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-stone-400">
            <MessageSquare className="w-12 h-12 text-stone-300 mb-2" />
            <p className="text-sm font-semibold text-stone-700">Select a conversation</p>
            <p className="text-xs text-stone-400 mt-1">
              Choose from existing messages on the left or start a new chat.
            </p>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-md p-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900">Start a Conversation</h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-500 my-3">
              Select any alumni, faculty, or staff member to begin direct messaging:
            </p>

            <div className="max-h-72 overflow-y-auto space-y-2">
              {users
                .filter((u) => u.uid !== currentUser?.uid)
                .map((u) => (
                  <div
                    key={u.uid}
                    onClick={() => {
                      getOrCreateChat(u.uid);
                      setShowNewChatModal(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 border border-stone-100 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.profilePictureUrl}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover border border-stone-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-stone-900">{u.name}</h4>
                        <p className="text-[11px] text-stone-500">
                          {u.role.toUpperCase()} • Batch {u.batch}
                        </p>
                        <p className="text-[10px] text-stone-400 line-clamp-1">{u.headline}</p>
                      </div>
                    </div>
                    <button className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold">
                      Chat
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
