export type UserRole = 'alumni' | 'student' | 'faculty' | 'admin' | 'registrar' | 'staff' | 'moderator' | 'superadmin';

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  honors?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  batch?: string; // e.g., "2019"
  course?: string; // e.g., "B.S. Computer Science"
  location: string;
  profilePictureUrl: string;
  coverPhotoUrl: string;
  headline: string;
  about: string;
  bio?: string;
  phone: string;
  isVerified?: boolean;
  followersCount: number;
  followingCount: number;
  connectionsCount: number;
  skills?: string[];
  currentPosition?: string;
  company?: string;
  experience: Experience[];
  education: Education[];
  createdAt: string;
  studentId?: string;
  employeeId?: string;
  department?: string;
  password?: string;
  authProvider?: 'password' | 'google' | 'firebase';
  settings?: Record<string, any>;
}

export type FriendRequestStatus = 'pending' | 'accepted' | 'declined';

export interface FriendRequest {
  id: string; // usually `${fromUid}_${toUid}`
  fromUid: string;
  toUid: string;
  status: FriendRequestStatus;
  createdAt: string;
  senderProfile?: UserProfile;
  receiverProfile?: UserProfile;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  memberIds: string[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: Record<string, number>; // uid -> count
  otherUser?: UserProfile;
}

export type NotificationType = 
  | 'friend_request'
  | 'friend_accepted'
  | 'event_broadcast'
  | 'announcement_broadcast'
  | 'message'
  | 'general';

export interface AppNotification {
  id: string;
  toUid: string;
  fromUid?: string;
  type: NotificationType;
  title: string;
  body: string;
  refId?: string; // e.g. eventId, friendRequestId, announcementId, chatId
  read: boolean;
  createdAt: string;
  fromUser?: UserProfile;
}

export interface EventComment {
  id: string;
  eventId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface AlumniEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  type: 'reunion' | 'workshop' | 'networking' | 'webinar' | 'social';
  startDate: string; // ISO string
  endDate: string;
  heroImageUrl: string;
  isVirtual: boolean;
  isImportant: boolean;
  maxAttendees: number;
  attendeesCount: number;
  createdBy: string;
  createdByName?: string;
  likes: string[]; // array of uids who liked
  comments: EventComment[];
  userRsvp?: 'going' | 'interested' | 'not_going' | null;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  important: boolean;
  publishedAt: string;
  createdBy: string;
  authorName: string;
  authorRole: string;
}

export interface Opportunity {
  id: string;
  title: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Mentorship';
  company: string;
  location: string;
  description: string;
  salaryOrStipend?: string;
  skills?: string[];
  applicationUrl?: string;
  contactEmail?: string;
  postedBy: string;
  posterName: string;
  createdAt: string;
  status: 'active' | 'closed';
}

export interface Chapter {
  id: string;
  name: string;
  region: string;
  leadName: string;
  leadEmail: string;
  memberCount: number;
  meetingFrequency: string;
  description: string;
}

export interface CareerMilestone {
  id: string;
  uid: string;
  alumniName: string;
  batch: string;
  title: string;
  company: string;
  category: 'Promotion' | 'Startup' | 'Award' | 'Publication' | 'Leadership';
  date: string;
  description: string;
}

export interface UserNotificationSettings {
  pushNotifications: boolean;
  emailDigests: boolean;
  directMessages: boolean;
  eventReminders: boolean;
}

export interface GalleryItem {
  id: string;
  category: 'campus' | 'homecoming' | 'commencement' | 'heritage';
  title: string;
  year: string;
  url: string;
  description?: string;
  uploadedBy?: string;
  uploadedByName?: string;
  uploaderRole?: UserRole;
  createdAt?: string;
}

