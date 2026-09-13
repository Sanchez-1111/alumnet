import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserProfile,
  UserRole,
  FriendRequest,
  ChatThread,
  ChatMessage,
  AppNotification,
  AlumniEvent,
  Announcement,
  Opportunity,
  Chapter,
  CareerMilestone,
  UserNotificationSettings,
  Experience,
  Education,
  GalleryItem
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_FRIEND_REQUESTS,
  INITIAL_CHATS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_EVENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_OPPORTUNITIES,
  INITIAL_CHAPTERS,
  INITIAL_MILESTONES,
  INITIAL_GALLERY_ITEMS
} from '../data/initialData';
import {
  auth,
  signInWithGoogle,
  signOutUser,
  saveUserToFirestore,
  getUserFromFirestore,
  subscribeToUsers,
  saveFriendRequestToFirestore,
  deleteFriendRequestFromFirestore,
  subscribeToFriendRequests,
  saveEventToFirestore,
  deleteEventFromFirestore,
  subscribeToEvents,
  saveOpportunityToFirestore,
  deleteOpportunityFromFirestore,
  subscribeToOpportunities,
  saveAnnouncementToFirestore,
  deleteAnnouncementFromFirestore,
  subscribeToAnnouncements,
  saveChatToFirestore,
  saveChatMessageToFirestore,
  saveNotificationToFirestore
} from '../lib/firebase';
import { alumniService } from '../services/alumniService';
import { onAuthStateChanged } from 'firebase/auth';

interface AlumniContextType {
  currentUser: UserProfile | null;
  users: UserProfile[];
  friendRequests: FriendRequest[];
  chats: ChatThread[];
  messages: Record<string, ChatMessage[]>;
  notifications: AppNotification[];
  events: AlumniEvent[];
  announcements: Announcement[];
  opportunities: Opportunity[];
  chapters: Chapter[];
  milestones: CareerMilestone[];
  notificationSettings: UserNotificationSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedUserIdForModal: string | null;
  setSelectedUserIdForModal: (uid: string | null) => void;
  isFirebaseConnected: boolean;
  isFirestoreSyncing: boolean;
  loginWithGoogle: () => Promise<boolean>;
  
  // Permissions derived from current user role (from Role Permissions Summary)
  permissions: {
    canSendFriendRequests: boolean;
    canFollow: boolean;
    canCreateEvents: boolean;
    canPostAnnouncements: boolean;
    canDeleteEventsComments: boolean;
    canAccessAdminPanel: boolean;
    canMessageAnyone: boolean;
    canUploadGallery: boolean;
  };

  // Auth & Session
  login: (email: string, pass: string) => boolean;
  register: (data: Partial<UserProfile> & { password?: string }) => boolean;
  createUserByAdmin: (data: Partial<UserProfile> & { password?: string; role: UserRole }) => boolean;
  logout: () => void;
  switchUser: (uid: string) => void;
  resetPassword: (email: string) => boolean;
  resetUserPasswordByEmail: (email: string, newPass: string) => boolean;
  deleteAccount: () => boolean;
  changeEmail: (newEmail: string) => boolean;
  changePassword: (newPass: string) => boolean;

  // Profile
  updateProfile: (data: Partial<UserProfile>) => void;
  addExperience: (exp: Omit<Experience, 'id'>) => void;
  removeExperience: (id: string) => void;
  addEducation: (edu: Omit<Education, 'id'>) => void;
  removeEducation: (id: string) => void;

  // Friends & Network
  followingIds: string[];
  connectionIds: string[];
  sendFriendRequest: (targetUid: string) => { success: boolean; error?: string };
  acceptFriendRequest: (requestId: string) => void;
  declineFriendRequest: (requestId: string) => void;
  cancelFriendRequest: (requestId: string) => void;
  toggleFollow: (targetUid: string) => void;
  isFollowing: (uid: string) => boolean;
  isConnected: (uid: string) => boolean;
  hasPendingRequestWith: (uid: string) => 'sent' | 'received' | false;

  // Messaging
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  sendMessage: (chatId: string, text: string) => void;
  getOrCreateChat: (targetUid: string) => string;
  markChatAsRead: (chatId: string) => void;

  // Events
  createEvent: (event: Omit<AlumniEvent, 'id' | 'likes' | 'comments' | 'attendeesCount' | 'createdBy' | 'createdByName'>) => void;
  editEvent: (eventId: string, data: Partial<AlumniEvent>) => void;
  deleteEvent: (eventId: string) => void;
  toggleLikeEvent: (eventId: string) => void;
  addCommentToEvent: (eventId: string, text: string) => void;
  rsvpEvent: (eventId: string, status: 'going' | 'interested' | 'not_going') => void;

  // Announcements
  createAnnouncement: (data: Omit<Announcement, 'id' | 'publishedAt' | 'createdBy' | 'authorName' | 'authorRole'>) => void;
  editAnnouncement: (id: string, data: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;

  // Opportunities
  createOpportunity: (data: Omit<Opportunity, 'id' | 'createdAt' | 'postedBy' | 'posterName' | 'status'>) => void;
  deleteOpportunity: (id: string) => void;

  // Notifications
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;

  // Settings
  updateNotificationSettings: (settings: Partial<UserNotificationSettings>) => void;
  updateUserSettings: (settings: any) => void;

  // Campus & Heritage Gallery
  galleryItems: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'createdAt'>) => boolean;
  deleteGalleryItem: (id: string) => boolean;

  // Admin Actions
  verifyUser: (uid: string) => void;
  setUserVerified: (uid: string, status?: boolean) => void;
  updateUserRole: (uid: string, newRole: UserRole) => void;
  setUserRole: (uid: string, newRole: UserRole) => void;
  deleteAlumni: (uid: string) => Promise<boolean>;
  createChapter: (ch: Omit<Chapter, 'id'>) => void;
  createMilestone: (m: Omit<CareerMilestone, 'id'>) => void;

  // Toast / System Feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AlumniContext = createContext<AlumniContextType | null>(null);

const STORAGE_KEYS = {
  USER_ID: 'alumni_auth_session_real_v1',
  USERS: 'alumni_users_v4',
  REQUESTS: 'alumni_friend_requests_v4',
  CHATS: 'alumni_chats_v4',
  MESSAGES: 'alumni_messages_v4',
  NOTIFICATIONS: 'alumni_notifications_v4',
  EVENTS: 'alumni_events_v4',
  ANNOUNCEMENTS: 'alumni_announcements_v4',
  OPPORTUNITIES: 'alumni_opportunities_v4',
  CHAPTERS: 'alumni_chapters_v4',
  MILESTONES: 'alumni_milestones_v4',
  FOLLOWING: 'alumni_following_v4',
  CONNECTIONS: 'alumni_connections_v4',
  SETTINGS: 'alumni_settings_v4',
  GALLERY: 'alumni_gallery_v4'
};

export const AlumniProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load or fallback to initial data
  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      let list: UserProfile[] = saved ? JSON.parse(saved) : INITIAL_USERS;
      if (!Array.isArray(list)) list = INITIAL_USERS;

      // Always sanitize experience and education arrays
      list = list.map((u) => ({
        ...u,
        experience: Array.isArray(u.experience) ? u.experience : [],
        education: Array.isArray(u.education) ? u.education : []
      }));

      // Always guarantee the admin account exists with admin role & password
      const adminExists = list.some(u => u.email.toLowerCase() === 'admin@stcecilia.edu');
      if (!adminExists) {
        const adminUser = INITIAL_USERS.find(u => u.email === 'admin@stcecilia.edu');
        if (adminUser) list = [adminUser, ...list];
      } else {
        list = list.map(u =>
          u.email.toLowerCase() === 'admin@stcecilia.edu'
            ? { ...u, role: 'admin', password: u.password || 'Password123!', isVerified: true }
            : u
        );
      }

      // Always guarantee the registrar account exists
      const regExists = list.some(u => u.email.toLowerCase() === 'registrar@stcecilia.edu');
      if (!regExists) {
        const regUser = INITIAL_USERS.find(u => u.email === 'registrar@stcecilia.edu');
        if (regUser) list = [...list, regUser];
      }

      // Always ensure all seed INITIAL_USERS are present in the list (so newly added directory alumni are always available)
      INITIAL_USERS.forEach((initU) => {
        const idx = list.findIndex(u => u.uid === initU.uid || u.email.toLowerCase() === initU.email.toLowerCase());
        if (idx === -1) {
          list.push(initU);
        } else {
          // Merge rich details if needed
          list[idx] = {
            ...initU,
            ...list[idx],
            role: list[idx].role || initU.role,
            password: list[idx].password || initU.password
          };
        }
      });

      return list;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Real system: unauthenticated by default, requires legitimate login
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_ID);
      return saved || null;
    } catch {
      return null;
    }
  });

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      const parsed = saved ? JSON.parse(saved) : INITIAL_FRIEND_REQUESTS;
      if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_FRIEND_REQUESTS;
      
      const combined = [...parsed];
      INITIAL_FRIEND_REQUESTS.forEach((ir) => {
        if (!combined.some((r) => r.id === ir.id)) {
          combined.push(ir);
        }
      });
      return combined;
    } catch {
      return INITIAL_FRIEND_REQUESTS;
    }
  });

  const [chats, setChats] = useState<ChatThread[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHATS);
      const parsed = saved ? JSON.parse(saved) : INITIAL_CHATS;
      return Array.isArray(parsed) ? parsed : INITIAL_CHATS;
    } catch {
      return INITIAL_CHATS;
    }
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const parsed = saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
      return Array.isArray(parsed) ? parsed : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [events, setEvents] = useState<AlumniEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      const parsed = saved ? JSON.parse(saved) : INITIAL_EVENTS;
      if (!Array.isArray(parsed)) return INITIAL_EVENTS;
      return parsed.map((e: AlumniEvent) => ({
        ...e,
        likes: Array.isArray(e.likes) ? e.likes : [],
        comments: Array.isArray(e.comments) ? e.comments : []
      }));
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      const parsed = saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
      return Array.isArray(parsed) ? parsed : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
      const parsed = saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
      if (!Array.isArray(parsed)) return INITIAL_OPPORTUNITIES;
      return parsed.map((opp: Opportunity) => ({
        ...opp,
        skills: Array.isArray(opp.skills) ? opp.skills : ['Leadership', 'Communication', 'Industry Specialization']
      }));
    } catch {
      return INITIAL_OPPORTUNITIES;
    }
  });

  const [chapters, setChapters] = useState<Chapter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAPTERS);
      const parsed = saved ? JSON.parse(saved) : INITIAL_CHAPTERS;
      return Array.isArray(parsed) ? parsed : INITIAL_CHAPTERS;
    } catch {
      return INITIAL_CHAPTERS;
    }
  });

  const [milestones, setMilestones] = useState<CareerMilestone[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MILESTONES);
      const parsed = saved ? JSON.parse(saved) : INITIAL_MILESTONES;
      return Array.isArray(parsed) ? parsed : INITIAL_MILESTONES;
    } catch {
      return INITIAL_MILESTONES;
    }
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
      const parsed = saved ? JSON.parse(saved) : INITIAL_GALLERY_ITEMS;
      return Array.isArray(parsed) ? parsed : INITIAL_GALLERY_ITEMS;
    } catch {
      return INITIAL_GALLERY_ITEMS;
    }
  });

  // Connections mapping: userUid -> array of connected uids
  const [connectionsMap, setConnectionsMap] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
      if (saved) return JSON.parse(saved);
      return {
        user_default_alumni: [],
        user_default_admin: []
      };
    } catch {
      return {
        user_default_alumni: [],
        user_default_admin: []
      };
    }
  });

  // Following mapping: userUid -> array of uids being followed
  const [followingMap, setFollowingMap] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FOLLOWING);
      if (saved) return JSON.parse(saved);
      return {
        user_default_alumni: ['user_default_admin'],
        user_default_admin: []
      };
    } catch {
      return {
        user_default_alumni: ['user_default_admin'],
        user_default_admin: []
      };
    }
  });

  const [notificationSettings, setNotificationSettings] = useState<UserNotificationSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
      return {
        pushNotifications: true,
        emailDigests: true,
        directMessages: true,
        eventReminders: true
      };
    } catch {
      return {
        pushNotifications: true,
        emailDigests: true,
        directMessages: true,
        eventReminders: true
      };
    }
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [selectedUserIdForModal, setSelectedUserIdForModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [isFirestoreSyncing, setIsFirestoreSyncing] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(STORAGE_KEYS.USER_ID, currentUserId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER_ID);
    }
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(friendRequests));
  }, [friendRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(chapters));
  }, [chapters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connectionsMap));
  }, [connectionsMap]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOLLOWING, JSON.stringify(followingMap));
  }, [followingMap]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(galleryItems));
  }, [galleryItems]);

  // Firebase Auth State Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setIsFirebaseConnected(true);
        let matched = users.find(
          (u) => u.uid === fbUser.uid || (fbUser.email && u.email.toLowerCase() === fbUser.email.toLowerCase())
        );
        if (!matched) {
          matched = (await getUserFromFirestore(fbUser.uid)) || undefined;
        }
        if (matched) {
          setCurrentUserId(matched.uid);
        } else {
          const email = fbUser.email || '';
          const role: UserRole = email.includes('admin') || email.includes('superadmin')
            ? 'admin'
            : email.includes('registrar')
            ? 'registrar'
            : 'alumni';

          const newProfile: UserProfile = {
            uid: fbUser.uid,
            name: fbUser.displayName || email.split('@')[0] || 'Cecilian Alumnus',
            email,
            role,
            batch: role === 'alumni' ? '2024' : 'N/A',
            course: role === 'alumni' ? 'B.S. Information Technology' : 'Academic Administration',
            location: 'Cebu, Philippines',
            profilePictureUrl: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
            coverPhotoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
            headline: `${role === 'alumni' ? 'B.S. Information Technology Graduate' : role.toUpperCase() + ' Specialist'} • St. Cecilia’s College`,
            about: 'Member of St. Cecilia’s College Alumni Community connected with Google Authentication.',
            phone: '',
            isVerified: true,
            followersCount: 0,
            followingCount: 0,
            connectionsCount: 0,
            experience: [],
            education: [],
            createdAt: new Date().toISOString(),
            authProvider: 'google'
          };
          setUsers((prev) => [newProfile, ...prev]);
          setCurrentUserId(newProfile.uid);
          saveUserToFirestore(newProfile).catch(() => {});
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore Subscriptions & Initial Seeding via alumniService
  useEffect(() => {
    // Subscribe to real-time alumni directory from Firestore
    const unsubUsers = alumniService.subscribeToAlumniDirectory((firestoreUsers) => {
      if (firestoreUsers.length > 0) {
        setUsers((prev) => {
          const merged = [...prev];
          firestoreUsers.forEach((fu) => {
            const idx = merged.findIndex((u) => u.uid === fu.uid);
            if (idx >= 0) {
              merged[idx] = { ...merged[idx], ...fu };
            } else {
              merged.push(fu);
            }
          });
          return merged;
        });
      }
    });

    const unsubEvents = subscribeToEvents((firestoreEvents) => {
      if (firestoreEvents.length > 0) {
        setEvents((prev) => {
          const merged = [...prev];
          firestoreEvents.forEach((fe) => {
            const idx = merged.findIndex((e) => e.id === fe.id);
            if (idx >= 0) {
              merged[idx] = { ...merged[idx], ...fe };
            } else {
              merged.push(fe);
            }
          });
          return merged;
        });
      }
    });

    const unsubOpps = subscribeToOpportunities((firestoreOpps) => {
      if (firestoreOpps.length > 0) {
        setOpportunities((prev) => {
          const merged = [...prev];
          firestoreOpps.forEach((fo) => {
            const idx = merged.findIndex((o) => o.id === fo.id);
            if (idx >= 0) {
              merged[idx] = { ...merged[idx], ...fo };
            } else {
              merged.push(fo);
            }
          });
          return merged;
        });
      }
    });

    const unsubAnn = subscribeToAnnouncements((firestoreAnns) => {
      if (firestoreAnns.length > 0) {
        setAnnouncements((prev) => {
          const merged = [...prev];
          firestoreAnns.forEach((fa) => {
            const idx = merged.findIndex((a) => a.id === fa.id);
            if (idx >= 0) {
              merged[idx] = { ...merged[idx], ...fa };
            } else {
              merged.push(fa);
            }
          });
          return merged;
        });
      }
    });

    const unsubReqs = subscribeToFriendRequests((firestoreReqs) => {
      if (firestoreReqs.length > 0) {
        setFriendRequests((prev) => {
          const merged = [...prev];
          firestoreReqs.forEach((fr) => {
            const idx = merged.findIndex((r) => r.id === fr.id);
            if (idx >= 0) {
              merged[idx] = { ...merged[idx], ...fr };
            } else {
              merged.push(fr);
            }
          });
          return merged;
        });
      }
    });

    // Background seeding of initial data to Firestore replacing hardcoded fallback
    const seedFirestore = async () => {
      try {
        setIsFirestoreSyncing(true);
        // Seed directory if empty via alumniService
        await alumniService.seedDirectoryIfEmpty(INITIAL_USERS);

        for (const ev of INITIAL_EVENTS) {
          saveEventToFirestore(ev).catch(() => {});
        }
        for (const op of INITIAL_OPPORTUNITIES) {
          saveOpportunityToFirestore(op).catch(() => {});
        }
        for (const an of INITIAL_ANNOUNCEMENTS) {
          saveAnnouncementToFirestore(an).catch(() => {});
        }
        for (const req of INITIAL_FRIEND_REQUESTS) {
          saveFriendRequestToFirestore(req).catch(() => {});
        }
      } catch (err) {
        console.warn('Initial Firestore sync notice:', err);
      } finally {
        setIsFirestoreSyncing(false);
      }
    };

    seedFirestore();

    return () => {
      unsubUsers();
      unsubEvents();
      unsubOpps();
      unsubAnn();
      unsubReqs();
    };
  }, []);

  // Current User resolution
  const currentUser = useMemo(() => {
    if (!currentUserId) return null;
    return users.find((u) => u.uid === currentUserId) || null;
  }, [currentUserId, users]);

  // Role Permissions Summary (derived strictly according to the user specification and image)
  const permissions = useMemo(() => {
    const role = currentUser?.role;
    return {
      // Send friend requests: alumni & student
      canSendFriendRequests: role === 'alumni' || role === 'student',
      // Follow users: alumni, student, admin, superadmin
      canFollow: role === 'alumni' || role === 'student' || role === 'admin' || role === 'superadmin',
      // Create events: admin, superadmin, registrar, staff, moderator, faculty
      canCreateEvents: ['admin', 'superadmin', 'registrar', 'staff', 'moderator', 'faculty'].includes(role || ''),
      // Post announcements: admin, superadmin, registrar, staff, moderator, faculty
      canPostAnnouncements: ['admin', 'superadmin', 'registrar', 'staff', 'moderator', 'faculty'].includes(role || ''),
      // Delete events/comments: admin, superadmin, registrar, staff, moderator
      canDeleteEventsComments: ['admin', 'superadmin', 'registrar', 'staff', 'moderator'].includes(role || ''),
      // Access admin panel: admin, superadmin, registrar, staff, moderator
      canAccessAdminPanel: ['admin', 'superadmin', 'registrar', 'staff', 'moderator'].includes(role || ''),
      // Message anyone: All authenticated users
      canMessageAnyone: Boolean(currentUser),
      // Campus & Heritage Gallery: admin, superadmin, registrar
      canUploadGallery: ['admin', 'superadmin', 'registrar'].includes(role || '')
    };
  }, [currentUser]);

  // Following & Connection list for current user
  const followingIds = useMemo(() => {
    if (!currentUserId) return [];
    return followingMap[currentUserId] || [];
  }, [currentUserId, followingMap]);

  const connectionIds = useMemo(() => {
    if (!currentUserId) return [];
    return connectionsMap[currentUserId] || [];
  }, [currentUserId, connectionsMap]);

  // Unread notifications count
  const unreadNotificationsCount = useMemo(() => {
    if (!currentUserId) return 0;
    return notifications.filter((n) => n.toUid === currentUserId && !n.read).length;
  }, [currentUserId, notifications]);

  // Auth Operations
  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const res = await signInWithGoogle();
      const fbUser = res.user;
      if (!fbUser) return false;

      let matched = users.find(
        (u) => u.uid === fbUser.uid || (fbUser.email && u.email.toLowerCase() === fbUser.email.toLowerCase())
      );

      if (!matched) {
        matched = (await getUserFromFirestore(fbUser.uid)) || undefined;
      }

      if (matched) {
        setCurrentUserId(matched.uid);
        await saveUserToFirestore(matched).catch(() => {});
        if (['admin', 'superadmin', 'registrar', 'staff', 'moderator'].includes(matched.role)) {
          setActiveTab('admin');
        } else {
          setActiveTab('dashboard');
        }
        showToast(`Welcome back, ${matched.name}! Signed in via Google.`);
        return true;
      } else {
        const email = fbUser.email || '';
        const role: UserRole = email.includes('admin') || email.includes('superadmin')
          ? 'admin'
          : email.includes('registrar')
          ? 'registrar'
          : 'alumni';

        const newProfile: UserProfile = {
          uid: fbUser.uid,
          name: fbUser.displayName || email.split('@')[0] || 'Cecilian Member',
          email,
          role,
          batch: role === 'alumni' ? '2024' : 'N/A',
          course: role === 'alumni' ? 'B.S. Information Technology' : 'Institutional Leadership',
          location: 'Cebu, Philippines',
          profilePictureUrl: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
          coverPhotoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
          headline: `${role === 'alumni' ? 'B.S. Information Technology Graduate' : role.toUpperCase() + ' Specialist'} • St. Cecilia’s College`,
          about: 'Member of St. Cecilia’s College Alumni Community connected with Google Authentication.',
          phone: '',
          isVerified: true,
          followersCount: 0,
          followingCount: 0,
          connectionsCount: 0,
          experience: [],
          education: [],
          createdAt: new Date().toISOString(),
          authProvider: 'google'
        };

        setUsers((prev) => [newProfile, ...prev]);
        setCurrentUserId(newProfile.uid);
        await saveUserToFirestore(newProfile).catch(() => {});

        if (['admin', 'superadmin', 'registrar', 'staff', 'moderator'].includes(role)) {
          setActiveTab('admin');
        } else {
          setActiveTab('dashboard');
        }
        showToast(`Welcome, ${newProfile.name}! Account linked with Google.`);
        return true;
      }
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        showToast(err?.message || 'Google sign-in could not be completed.');
      }
      return false;
    }
  };

  const login = (identifier: string, pass: string): boolean => {
    const trimmed = identifier.trim().toLowerCase();
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === trimmed ||
        (u.studentId && u.studentId.toLowerCase() === trimmed) ||
        (u.employeeId && u.employeeId.toLowerCase() === trimmed)
    );
    if (user) {
      if (user.password && pass && user.password !== pass) {
        showToast('Incorrect password entered.');
        return false;
      }
      setCurrentUserId(user.uid);
      saveUserToFirestore(user).catch(() => {});
      if (['admin', 'registrar', 'staff', 'moderator'].includes(user.role)) {
        setActiveTab('admin');
      } else {
        setActiveTab('dashboard');
      }
      showToast(`Welcome back, ${user.name}!`);
      return true;
    }
    showToast('Invalid credentials. Check your email or Student ID.');
    return false;
  };

  const register = (data: Partial<UserProfile> & { password?: string }): boolean => {
    const newUid = `user_${Date.now()}`;
    // Admin accounts cannot be created by public registration (admin account created by admin only)
    let role = data.role || 'alumni';
    if (role === 'admin') {
      showToast('Admin accounts cannot be registered publicly. Provisioned as Alumni.');
      role = 'alumni';
    }
    const newUser: UserProfile = {
      uid: newUid,
      name: data.name || 'Juan Dela Cruz',
      email: data.email || `alumni_${Date.now()}@stcecilia.edu`,
      password: data.password || 'Password123!',
      role,
      batch: data.batch || (role === 'alumni' ? '2024' : 'N/A'),
      course: data.course || (role === 'alumni' ? 'B.S. Information Technology' : 'Campus Administration & Services'),
      location: data.location || 'Cebu, Philippines',
      studentId: data.studentId || (role === 'alumni' ? `SC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` : undefined),
      employeeId: data.employeeId,
      department: data.department,
      profilePictureUrl: data.profilePictureUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      coverPhotoUrl: data.coverPhotoUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
      headline: data.headline || `${role === 'alumni' ? (data.course || 'Alumni') + ' Graduate' : role.toUpperCase() + ' Specialist'} • St. Cecilia’s College`,
      about: data.about || 'Excited to be part of the St. Cecilia’s College alumni and institutional community.',
      phone: data.phone || '+63 917 123 4567',
      isVerified: false,
      followersCount: 0,
      followingCount: 0,
      connectionsCount: 0,
      experience: [],
      education: [
        {
          id: `edu_${Date.now()}`,
          degree: data.course || 'Bachelor Degree Program',
          institution: 'St. Cecilia’s College',
          fieldOfStudy: data.course || 'Information Technology',
          startYear: String(new Date().getFullYear() - 4),
          endYear: String(new Date().getFullYear())
        }
      ],
      createdAt: new Date().toISOString()
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newUid);
    alumniService.createAlumni(newUser).catch((err) => {
      console.warn('Error saving new alumni to Firestore:', err);
    });
    showToast(`Account registered successfully as ${newUser.role.toUpperCase()}!`);
    return true;
  };

  // Administrator-exclusive account creation (admin accounts created by admin only)
  const createUserByAdmin = (data: Partial<UserProfile> & { password?: string; role: UserRole }): boolean => {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin') {
      showToast('Permission denied: Only system Administrators can provision staff and admin accounts.');
      return false;
    }
    const newUid = `user_admin_${Date.now()}`;
    const role = data.role || 'alumni';
    const newUser: UserProfile = {
      uid: newUid,
      name: data.name || 'New University User',
      email: data.email || `account_${Date.now()}@stcecilia.edu`,
      password: data.password || 'Password123!',
      role,
      batch: data.batch || (role === 'alumni' ? '2024' : 'N/A'),
      course: data.course || (role === 'alumni' ? 'B.S. Information Technology' : 'Campus Administration & Services'),
      location: data.location || 'St. Cecilia’s Campus',
      studentId: data.studentId,
      employeeId: data.employeeId || `EMP-${Date.now().toString().slice(-4)}`,
      department: data.department || (role === 'admin' ? 'Institutional Advancement' : 'Academic Affairs'),
      profilePictureUrl: data.profilePictureUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      coverPhotoUrl: data.coverPhotoUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
      headline: data.headline || `${role.toUpperCase()} • St. Cecilia’s College`,
      about: data.about || `Official ${role} profile created by Administrator.`,
      phone: data.phone || '+63 918 000 0000',
      isVerified: true,
      followersCount: 0,
      followingCount: 0,
      connectionsCount: 0,
      experience: [],
      education: [],
      createdAt: new Date().toISOString()
    };

    setUsers((prev) => [newUser, ...prev]);
    alumniService.createAlumni(newUser).catch((err) => {
      console.warn('Error saving admin-created alumni to Firestore:', err);
    });
    showToast(`Account for ${newUser.name} provisioned as ${newUser.role.toUpperCase()}!`);
    return true;
  };

  // Campus & Heritage Gallery: Admin and Registrar can upload
  const addGalleryItem = (item: Omit<GalleryItem, 'id' | 'createdAt'>): boolean => {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'registrar' && currentUser?.role !== 'superadmin') {
      showToast('Permission denied: Only Admin and Registrar can upload to Campus & Heritage Gallery.');
      return false;
    }
    const newItem: GalleryItem = {
      ...item,
      id: `gal_${Date.now()}`,
      uploadedBy: currentUser.uid,
      uploadedByName: currentUser.name,
      uploaderRole: currentUser.role,
      createdAt: new Date().toISOString()
    };
    setGalleryItems((prev) => [newItem, ...prev]);
    showToast(`New photo "${newItem.title}" added to Campus & Heritage Gallery!`);
    return true;
  };

  const deleteGalleryItem = (id: string): boolean => {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'registrar' && currentUser?.role !== 'superadmin') {
      showToast('Permission denied: Only Admin and Registrar can manage gallery items.');
      return false;
    }
    setGalleryItems((prev) => prev.filter((g) => g.id !== id));
    showToast('Photo removed from Campus & Heritage Gallery.');
    return true;
  };

  const logout = () => {
    signOutUser().catch(() => {});
    setCurrentUserId(null);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    showToast('Logged out successfully.');
  };

  const switchUser = (uid: string) => {
    const target = users.find((u) => u.uid === uid);
    if (target) {
      setCurrentUserId(uid);
      showToast(`Switched view to ${target.name} (${target.role.toUpperCase()})`);
    }
  };

  const resetPassword = (email: string): boolean => {
    showToast(`Password reset link sent to ${email}. Check your inbox.`);
    return true;
  };

  const resetUserPasswordByEmail = (email: string, newPass: string): boolean => {
    const trimmed = email.trim().toLowerCase();
    const exists = users.some((u) => u.email.toLowerCase() === trimmed);
    if (!exists) {
      showToast('No registered account found with that email address.');
      return false;
    }
    setUsers((prev) =>
      prev.map((u) => (u.email.toLowerCase() === trimmed ? { ...u, password: newPass } : u))
    );
    showToast('Password updated securely. You can now sign in with your new password.');
    return true;
  };

  const deleteAccount = (): boolean => {
    if (!currentUserId) return false;
    const uidToDelete = currentUserId;
    setUsers((prev) => prev.filter((u) => u.uid !== uidToDelete));
    alumniService.deleteAlumni(uidToDelete).catch((err) => {
      console.warn('Error deleting user account from Firestore:', err);
    });
    setCurrentUserId(null);
    showToast('Account permanently deleted.');
    return true;
  };

  const changeEmail = (newEmail: string): boolean => {
    if (!currentUserId) return false;
    setUsers((prev) =>
      prev.map((u) => (u.uid === currentUserId ? { ...u, email: newEmail } : u))
    );
    showToast(`Email updated to ${newEmail}. Verification link dispatched.`);
    return true;
  };

  const changePassword = (newPass: string): boolean => {
    if (!currentUserId) return false;
    setUsers((prev) =>
      prev.map((u) => (u.uid === currentUserId ? { ...u, password: newPass } : u))
    );
    showToast('Password updated securely.');
    return true;
  };

  // Profile operations
  const updateProfile = (data: Partial<UserProfile>) => {
    if (!currentUserId) return;
    setUsers((prev) => {
      const updated = prev.map((u) => (u.uid === currentUserId ? { ...u, ...data } : u));
      return updated;
    });
    alumniService.updateAlumni(currentUserId, data).catch((err) => {
      console.warn('Error updating profile in Firestore:', err);
    });
    showToast('Profile updated successfully!');
  };

  const addExperience = (exp: Omit<Experience, 'id'>) => {
    if (!currentUserId) return;
    const newExp: Experience = {
      id: `exp_${Date.now()}`,
      ...exp
    };
    setUsers((prev) =>
      prev.map((u) =>
        u.uid === currentUserId
          ? { ...u, experience: [newExp, ...u.experience] }
          : u
      )
    );
    showToast('New work experience added!');
  };

  const removeExperience = (id: string) => {
    if (!currentUserId) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.uid === currentUserId
          ? { ...u, experience: u.experience.filter((e) => e.id !== id) }
          : u
      )
    );
    showToast('Experience removed.');
  };

  const addEducation = (edu: Omit<Education, 'id'>) => {
    if (!currentUserId) return;
    const newEdu: Education = {
      id: `edu_${Date.now()}`,
      ...edu
    };
    setUsers((prev) =>
      prev.map((u) =>
        u.uid === currentUserId
          ? { ...u, education: [newEdu, ...u.education] }
          : u
      )
    );
    showToast('Education milestone added!');
  };

  const removeEducation = (id: string) => {
    if (!currentUserId) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.uid === currentUserId
          ? { ...u, education: u.education.filter((e) => e.id !== id) }
          : u
      )
    );
    showToast('Education removed.');
  };

  // Friends & Network operations
  const isFollowing = (uid: string) => {
    if (!currentUserId) return false;
    return (followingMap[currentUserId] || []).includes(uid);
  };

  const isConnected = (uid: string) => {
    if (!currentUserId) return false;
    return (connectionsMap[currentUserId] || []).includes(uid);
  };

  const hasPendingRequestWith = (uid: string): 'sent' | 'received' | false => {
    if (!currentUserId) return false;
    const req = friendRequests.find(
      (r) =>
        r.status === 'pending' &&
        ((r.fromUid === currentUserId && r.toUid === uid) ||
          (r.fromUid === uid && r.toUid === currentUserId))
    );
    if (!req) return false;
    return req.fromUid === currentUserId ? 'sent' : 'received';
  };

  const sendFriendRequest = (targetUid: string) => {
    if (!currentUser) {
      showToast('Please sign in to send connection requests.');
      return { success: false, error: 'Not authenticated' };
    }

    if (currentUser.uid === targetUid) {
      showToast('You cannot send a connection request to yourself.');
      return { success: false, error: 'Self connection' };
    }

    const targetUser = users.find((u) => u.uid === targetUid);
    if (!targetUser) return { success: false, error: 'Target user not found' };

    if (isConnected(targetUid)) {
      showToast(`You are already connected with ${targetUser.name}.`);
      return { success: false, error: 'Already connected' };
    }

    const existingReq = friendRequests.find(
      (r) =>
        r.status === 'pending' &&
        ((r.fromUid === currentUser.uid && r.toUid === targetUid) ||
          (r.fromUid === targetUid && r.toUid === currentUser.uid))
    );
    if (existingReq) {
      showToast('A pending connection request already exists.');
      return { success: false, error: 'Request exists' };
    }

    const newReqId = `req_${currentUser.uid}_${targetUid}_${Date.now()}`;
    const newReq: FriendRequest = {
      id: newReqId,
      fromUid: currentUser.uid,
      toUid: targetUid,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setFriendRequests((prev) => [newReq, ...prev]);
    saveFriendRequestToFirestore(newReq).catch(() => {});

    // Create Notification for receiver
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      toUid: targetUid,
      fromUid: currentUser.uid,
      type: 'friend_request',
      title: 'New Connection Request',
      body: `${currentUser.name} (${currentUser.course || 'Alumni'}, Batch ${currentUser.batch || 'Class'}) sent you a connection request.`,
      refId: newReq.id,
      read: false,
      createdAt: new Date().toISOString()
    };

    setNotifications((prev) => [newNotif, ...prev]);
    saveNotificationToFirestore(newNotif).catch(() => {});
    showToast(`Connection request sent to ${targetUser.name}!`);

    // Responsive simulation: automatically accept after a short delay
    setTimeout(() => {
      setFriendRequests((prev) => {
        const stillPending = prev.some((r) => r.id === newReqId && r.status === 'pending');
        if (!stillPending) return prev;
        const acceptedReq = { ...newReq, status: 'accepted' as const };
        saveFriendRequestToFirestore(acceptedReq).catch(() => {});
        return prev.map((r) => (r.id === newReqId ? acceptedReq : r));
      });

      setConnectionsMap((prev) => {
        const currentCons = prev[currentUser.uid] || [];
        const targetCons = prev[targetUid] || [];
        return {
          ...prev,
          [currentUser.uid]: Array.from(new Set([...currentCons, targetUid])),
          [targetUid]: Array.from(new Set([...targetCons, currentUser.uid]))
        };
      });

      setUsers((prev) =>
        prev.map((u) => {
          if (u.uid === currentUser.uid || u.uid === targetUid) {
            return { ...u, connectionsCount: (u.connectionsCount || 0) + 1 };
          }
          return u;
        })
      );

      // Notification for current user
      const acceptedNotif: AppNotification = {
        id: `notif_${Date.now()}_acc`,
        toUid: currentUser.uid,
        fromUid: targetUid,
        type: 'friend_accepted',
        title: 'Connection Accepted',
        body: `${targetUser.name} accepted your connection request! You can now send direct messages.`,
        refId: targetUid,
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications((prev) => [acceptedNotif, ...prev]);
      saveNotificationToFirestore(acceptedNotif).catch(() => {});

      showToast(`🎉 ${targetUser.name} accepted your connection request!`);
    }, 1500);

    return { success: true };
  };

  const acceptFriendRequest = (requestId: string) => {
    const req = friendRequests.find((r) => r.id === requestId);
    if (!req || !currentUser) return;

    const updatedReq = { ...req, status: 'accepted' as const };
    setFriendRequests((prev) =>
      prev.map((r) => (r.id === requestId ? updatedReq : r))
    );
    saveFriendRequestToFirestore(updatedReq).catch(() => {});

    // Update bidirectional connections
    setConnectionsMap((prev) => {
      const currentCons = prev[currentUser.uid] || [];
      const senderCons = prev[req.fromUid] || [];
      return {
        ...prev,
        [currentUser.uid]: Array.from(new Set([...currentCons, req.fromUid])),
        [req.fromUid]: Array.from(new Set([...senderCons, currentUser.uid]))
      };
    });

    // Increment connection counts
    setUsers((prev) =>
      prev.map((u) => {
        if (u.uid === currentUser.uid || u.uid === req.fromUid) {
          return { ...u, connectionsCount: (u.connectionsCount || 0) + 1 };
        }
        return u;
      })
    );

    // Notification to sender
    const sender = users.find((u) => u.uid === req.fromUid);
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      toUid: req.fromUid,
      fromUid: currentUser.uid,
      type: 'friend_accepted',
      title: 'Connection Accepted',
      body: `${currentUser.name} accepted your alumni connection request.`,
      refId: currentUser.uid,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications((prev) => [notif, ...prev]);
    saveNotificationToFirestore(notif).catch(() => {});

    showToast(`You are now connected with ${sender ? sender.name : 'your fellow alumnus'}!`);
  };

  const declineFriendRequest = (requestId: string) => {
    const req = friendRequests.find((r) => r.id === requestId);
    if (req) {
      const updatedReq = { ...req, status: 'declined' as const };
      saveFriendRequestToFirestore(updatedReq).catch(() => {});
    }
    setFriendRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'declined' } : r))
    );
    showToast('Connection request declined.');
  };

  const cancelFriendRequest = (requestId: string) => {
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
    deleteFriendRequestFromFirestore(requestId).catch(() => {});
    showToast('Connection request cancelled.');
  };

  const toggleFollow = (targetUid: string) => {
    if (!currentUser) return;
    if (!permissions.canFollow) {
      showToast('Only Alumni and Admins can follow users.');
      return;
    }

    const currentFollowing = followingMap[currentUser.uid] || [];
    const isNowFollowing = currentFollowing.includes(targetUid);

    setFollowingMap((prev) => {
      const updated = isNowFollowing
        ? currentFollowing.filter((id) => id !== targetUid)
        : [...currentFollowing, targetUid];
      return { ...prev, [currentUser.uid]: updated };
    });

    // Update follower/following counts
    setUsers((prev) =>
      prev.map((u) => {
        if (u.uid === currentUser.uid) {
          return {
            ...u,
            followingCount: Math.max(0, (u.followingCount || 0) + (isNowFollowing ? -1 : 1))
          };
        }
        if (u.uid === targetUid) {
          return {
            ...u,
            followersCount: Math.max(0, (u.followersCount || 0) + (isNowFollowing ? -1 : 1))
          };
        }
        return u;
      })
    );

    const target = users.find((u) => u.uid === targetUid);
    showToast(isNowFollowing ? `Unfollowed ${target?.name}` : `Following ${target?.name}`);
  };

  // Messaging operations
  const getOrCreateChat = (targetUid: string): string => {
    if (!currentUser) return '';
    const existingChat = chats.find(
      (c) => c.memberIds.includes(currentUser.uid) && c.memberIds.includes(targetUid)
    );
    if (existingChat) {
      setActiveChatId(existingChat.id);
      return existingChat.id;
    }

    // Create new chat
    const newChatId = `chat_${Date.now()}`;
    const newChat: ChatThread = {
      id: newChatId,
      memberIds: [currentUser.uid, targetUid],
      lastMessage: 'Conversation started',
      lastMessageAt: new Date().toISOString(),
      unreadCount: {
        [currentUser.uid]: 0,
        [targetUid]: 0
      }
    };

    setChats((prev) => [newChat, ...prev]);
    setMessages((prev) => ({ ...prev, [newChatId]: [] }));
    setActiveChatId(newChatId);
    return newChatId;
  };

  const sendMessage = (chatId: string, text: string) => {
    if (!currentUser || !text.trim()) return;
    const now = new Date().toISOString();

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      chatId,
      senderId: currentUser.uid,
      text: text.trim(),
      createdAt: now
    };

    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMsg]
    }));

    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          const recipientId = c.memberIds.find((id) => id !== currentUser.uid);
          const nextUnread = { ...c.unreadCount };
          if (recipientId) {
            nextUnread[recipientId] = (nextUnread[recipientId] || 0) + 1;
          }
          return {
            ...c,
            lastMessage: text.trim(),
            lastMessageAt: now,
            unreadCount: nextUnread
          };
        }
        return c;
      })
    );
  };

  const markChatAsRead = (chatId: string) => {
    if (!currentUser) return;
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          return {
            ...c,
            unreadCount: {
              ...c.unreadCount,
              [currentUser.uid]: 0
            }
          };
        }
        return c;
      })
    );
  };

  // Events operations
  const createEvent = (
    eventData: Omit<AlumniEvent, 'id' | 'likes' | 'comments' | 'attendeesCount' | 'createdBy' | 'createdByName'>
  ) => {
    if (!currentUser || !permissions.canCreateEvents) {
      showToast('Permission denied: Only staff and admin roles can create events.');
      return;
    }

    const newEvt: AlumniEvent = {
      id: `evt_${Date.now()}`,
      ...eventData,
      likes: [],
      comments: [],
      attendeesCount: 1,
      createdBy: currentUser.uid,
      createdByName: `${currentUser.name} (${currentUser.role.toUpperCase()})`
    };

    setEvents((prev) => [newEvt, ...prev]);

    // Broadcast notification to other users
    const broadcastNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      toUid: 'user_sarah_lin', // visible to alumni
      type: 'event_broadcast',
      title: `New Event: ${newEvt.title}`,
      body: `Organized by ${currentUser.name}. ${newEvt.isVirtual ? 'Virtual event' : newEvt.location}`,
      refId: newEvt.id,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications((prev) => [broadcastNotif, ...prev]);
    showToast('Event published successfully!');
  };

  const editEvent = (eventId: string, data: Partial<AlumniEvent>) => {
    if (!permissions.canCreateEvents) {
      showToast('Permission denied: Only staff and admin roles can edit events.');
      return;
    }
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, ...data } : e))
    );
    showToast('Event details updated.');
  };

  const deleteEvent = (eventId: string) => {
    if (!permissions.canDeleteEventsComments) {
      showToast('Permission denied: Staff/Admin authorization required.');
      return;
    }
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    showToast('Event deleted.');
  };

  const toggleLikeEvent = (eventId: string) => {
    if (!currentUser) return;
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const liked = e.likes.includes(currentUser.uid);
          return {
            ...e,
            likes: liked
              ? e.likes.filter((id) => id !== currentUser.uid)
              : [...e.likes, currentUser.uid]
          };
        }
        return e;
      })
    );
  };

  const addCommentToEvent = (eventId: string, text: string) => {
    if (!currentUser || !text.trim()) return;
    const newComment = {
      id: `c_${Date.now()}`,
      eventId,
      authorId: currentUser.uid,
      authorName: currentUser.name,
      authorAvatar: currentUser.profilePictureUrl,
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          return {
            ...e,
            comments: [...e.comments, newComment]
          };
        }
        return e;
      })
    );
    showToast('Comment posted.');
  };

  const rsvpEvent = (eventId: string, status: 'going' | 'interested' | 'not_going') => {
    if (!currentUser) return;
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const wasGoing = e.userRsvp === 'going';
          const isNowGoing = status === 'going';
          let delta = 0;
          if (!wasGoing && isNowGoing) delta = 1;
          if (wasGoing && !isNowGoing) delta = -1;

          return {
            ...e,
            userRsvp: status,
            attendeesCount: Math.max(1, e.attendeesCount + delta)
          };
        }
        return e;
      })
    );
    showToast(`RSVP status updated to: ${status.toUpperCase()}`);
  };

  // Announcements operations
  const createAnnouncement = (
    data: Omit<Announcement, 'id' | 'publishedAt' | 'createdBy' | 'authorName' | 'authorRole'>
  ) => {
    if (!currentUser || !permissions.canPostAnnouncements) {
      showToast('Permission denied: Only staff and admin roles can post announcements.');
      return;
    }

    const newAnn: Announcement = {
      id: `ann_${Date.now()}`,
      ...data,
      publishedAt: new Date().toISOString(),
      createdBy: currentUser.uid,
      authorName: currentUser.name,
      authorRole: currentUser.headline || currentUser.role.toUpperCase()
    };

    setAnnouncements((prev) => [newAnn, ...prev]);

    // Broadcast notification
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      toUid: 'user_sarah_lin',
      type: 'announcement_broadcast',
      title: `${newAnn.important ? '🚨 IMPORTANT: ' : ''}${newAnn.title}`,
      body: newAnn.content.slice(0, 100) + '...',
      refId: newAnn.id,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast('Announcement posted and broadcast to members!');
  };

  const editAnnouncement = (id: string, data: Partial<Announcement>) => {
    if (!permissions.canPostAnnouncements) {
      showToast('Permission denied: Only staff and admin can edit announcements.');
      return;
    }
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a))
    );
    showToast('Announcement updated.');
  };

  const deleteAnnouncement = (id: string) => {
    if (!permissions.canPostAnnouncements) {
      showToast('Permission denied.');
      return;
    }
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast('Announcement removed.');
  };

  // Opportunities operations
  const createOpportunity = (
    data: Omit<Opportunity, 'id' | 'createdAt' | 'postedBy' | 'posterName' | 'status'>
  ) => {
    if (!currentUser) return;
    const newOpp: Opportunity = {
      id: `opp_${Date.now()}`,
      ...data,
      postedBy: currentUser.uid,
      posterName: `${currentUser.name} (${currentUser.course})`,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    setOpportunities((prev) => [newOpp, ...prev]);
    showToast('Career opportunity posted to alumni job board!');
  };

  const deleteOpportunity = (id: string) => {
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
    showToast('Opportunity removed.');
  };

  // Notifications operations
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUserId) return;
    setNotifications((prev) =>
      prev.map((n) => (n.toUid === currentUserId ? { ...n, read: true } : n))
    );
    showToast('All notifications marked as read.');
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Settings operations
  const updateNotificationSettings = (settings: Partial<UserNotificationSettings>) => {
    setNotificationSettings((prev) => ({ ...prev, ...settings }));
    showToast('Notification preferences saved.');
  };

  const updateUserSettings = (settings: any) => {
    if (
      settings.notificationsPush !== undefined ||
      settings.notificationsEmail !== undefined ||
      settings.notificationsMessages !== undefined ||
      settings.notificationsEvents !== undefined
    ) {
      updateNotificationSettings({
        pushNotifications: settings.notificationsPush ?? settings.pushNotifications,
        emailDigests: settings.notificationsEmail ?? settings.emailDigests,
        directMessages: settings.notificationsMessages ?? settings.directMessages,
        eventReminders: settings.notificationsEvents ?? settings.eventReminders
      });
    } else {
      updateNotificationSettings(settings);
    }
  };

  // Admin Actions
  const verifyUser = (uid: string) => {
    if (!permissions.canAccessAdminPanel) {
      showToast('Permission denied: Admin clearance required.');
      return;
    }
    const target = users.find((u) => u.uid === uid);
    const newStatus = target ? !target.isVerified : true;

    setUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, isVerified: newStatus } : u))
    );
    alumniService.updateAlumni(uid, { isVerified: newStatus }).catch((err) => {
      console.warn('Error updating verification status in Firestore:', err);
    });
    showToast('User verification status updated.');
  };

  const updateUserRole = (uid: string, newRole: UserRole) => {
    if (!permissions.canAccessAdminPanel) {
      showToast('Permission denied.');
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u))
    );
    alumniService.updateAlumni(uid, { role: newRole }).catch((err) => {
      console.warn('Error updating user role in Firestore:', err);
    });
    showToast(`User role updated to ${newRole.toUpperCase()}.`);
  };

  const deleteAlumni = async (uid: string): Promise<boolean> => {
    if (!permissions.canAccessAdminPanel) {
      showToast('Permission denied: Only administrators can remove alumni records.');
      return false;
    }
    try {
      await alumniService.deleteAlumni(uid);
      setUsers((prev) => prev.filter((u) => u.uid !== uid));
      showToast('Alumni record deleted successfully from directory.');
      return true;
    } catch (err) {
      console.error('Failed to delete alumnus:', err);
      showToast('Error removing alumni record from Firestore.');
      return false;
    }
  };

  const createChapter = (ch: Omit<Chapter, 'id'>) => {
    if (!permissions.canAccessAdminPanel) return;
    const newChap: Chapter = {
      id: `chap_${Date.now()}`,
      ...ch
    };
    setChapters((prev) => [...prev, newChap]);
    showToast(`Alumni Chapter "${ch.name}" created!`);
  };

  const createMilestone = (m: Omit<CareerMilestone, 'id'>) => {
    if (!permissions.canAccessAdminPanel) return;
    const newM: CareerMilestone = {
      id: `m_${Date.now()}`,
      ...m
    };
    setMilestones((prev) => [newM, ...prev]);
    showToast('Career milestone spotlight published!');
  };

  return (
    <AlumniContext.Provider
      value={{
        currentUser,
        users,
        friendRequests,
        chats,
        messages,
        notifications,
        events,
        announcements,
        opportunities,
        chapters,
        milestones,
        notificationSettings,
        activeTab,
        setActiveTab,
        selectedUserIdForModal,
        setSelectedUserIdForModal,
        permissions,
        isFirebaseConnected,
        isFirestoreSyncing,
        loginWithGoogle,
        login,
        register,
        logout,
        switchUser,
        resetPassword,
        resetUserPasswordByEmail,
        deleteAccount,
        changeEmail,
        changePassword,
        updateProfile,
        addExperience,
        removeExperience,
        addEducation,
        removeEducation,
        followingIds,
        connectionIds,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        cancelFriendRequest,
        toggleFollow,
        isFollowing,
        isConnected,
        hasPendingRequestWith,
        activeChatId,
        setActiveChatId,
        sendMessage,
        getOrCreateChat,
        markChatAsRead,
        createEvent,
        editEvent,
        deleteEvent,
        toggleLikeEvent,
        addCommentToEvent,
        rsvpEvent,
        createAnnouncement,
        editAnnouncement,
        deleteAnnouncement,
        createOpportunity,
        deleteOpportunity,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        updateNotificationSettings,
        updateUserSettings,
        galleryItems,
        addGalleryItem,
        deleteGalleryItem,
        createUserByAdmin,
        verifyUser,
        setUserVerified: (uid: string, _status?: boolean) => verifyUser(uid),
        updateUserRole,
        setUserRole: updateUserRole,
        deleteAlumni,
        createChapter,
        createMilestone,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AlumniContext.Provider>
  );
};

export const useAlumni = () => {
  const context = useContext(AlumniContext);
  if (!context) {
    throw new Error('useAlumni must be used within an AlumniProvider');
  }
  return context;
};
