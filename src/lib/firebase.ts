import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  deleteDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  UserProfile,
  FriendRequest,
  ChatThread,
  ChatMessage,
  AppNotification,
  AlumniEvent,
  Announcement,
  Opportunity
} from '../types';

// The designated Firestore Database ID
export const FIRESTORE_DATABASE_ID =
  firebaseConfig.firestoreDatabaseId || 'ai-studio-stceciliasalumni-56f03a5f-fe76-441d-9690-aa0dfcccdbfb';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore strictly with the target database ID
export const db = getFirestore(app, FIRESTORE_DATABASE_ID);

/**
 * Validate Connection to Firestore on boot
 */
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Error handling types and helper as specified in the Firebase integration skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Google Provider setup
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Sign in with Google with automatic fallback if popup is blocked
 */
export async function signInWithGoogle(): Promise<{ user: FirebaseUser; isNewUser?: boolean }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user };
  } catch (error: any) {
    // If popup was blocked or iframe restriction triggered, attempt redirect
    if (
      error.code === 'auth/popup-blocked' ||
      error.code === 'auth/popup-closed-by-user' ||
      error.code === 'auth/cancelled-popup-request'
    ) {
      console.warn('Popup blocked or cancelled, attempting redirect fallback...', error);
      try {
        await signInWithRedirect(auth, googleProvider);
        // Will reload/redirect
        throw error;
      } catch (redirectErr) {
        throw redirectErr;
      }
    }
    throw error;
  }
}

/**
 * Handle redirect result upon reload
 */
export async function checkRedirectResult(): Promise<FirebaseUser | null> {
  try {
    const result = await getRedirectResult(auth);
    return result ? result.user : null;
  } catch (err) {
    console.warn('Redirect auth check notice:', err);
    return null;
  }
}

/**
 * Firebase Sign Out
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

// =========================================================================
// FIRESTORE SYNC & REPOSITORY METHODS
// =========================================================================

export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  FRIEND_REQUESTS: 'friend_requests',
  CHATS: 'chats',
  NOTIFICATIONS: 'notifications',
  EVENTS: 'events',
  ANNOUNCEMENTS: 'announcements',
  OPPORTUNITIES: 'opportunities'
};

/**
 * Sync user profile to Firestore
 */
export async function saveUserToFirestore(user: UserProfile): Promise<void> {
  try {
    const userRef = doc(db, FIRESTORE_COLLECTIONS.USERS, user.uid);
    // Sanitize undefined fields
    const sanitized = JSON.parse(JSON.stringify(user));
    await setDoc(userRef, sanitized, { merge: true });
  } catch (err) {
    console.warn('Failed to save user to Firestore:', err);
  }
}

/**
 * Fetch a single user profile from Firestore
 */
export async function getUserFromFirestore(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, FIRESTORE_COLLECTIONS.USERS, uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    console.warn('Failed to get user from Firestore:', err);
    return null;
  }
}

/**
 * Fetch all users from Firestore
 */
export async function getAllUsersFromFirestore(): Promise<UserProfile[]> {
  try {
    const colRef = collection(db, FIRESTORE_COLLECTIONS.USERS);
    const snap = await getDocs(colRef);
    const list: UserProfile[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as UserProfile);
    });
    return list;
  } catch (err) {
    console.warn('Failed to fetch users from Firestore:', err);
    return [];
  }
}

/**
 * Subscribe to real-time users collection
 */
export function subscribeToUsers(onUpdate: (users: UserProfile[]) => void) {
  const colRef = collection(db, FIRESTORE_COLLECTIONS.USERS);
  return onSnapshot(
    colRef,
    (snap) => {
      const list: UserProfile[] = [];
      snap.forEach((d) => list.push(d.data() as UserProfile));
      onUpdate(list);
    },
    (err) => console.warn('Firestore Users subscription notice:', err)
  );
}

/**
 * Save connection / friend request to Firestore
 */
export async function saveFriendRequestToFirestore(req: FriendRequest): Promise<void> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTIONS.FRIEND_REQUESTS, req.id);
    await setDoc(docRef, JSON.parse(JSON.stringify(req)), { merge: true });
  } catch (err) {
    console.warn('Failed to save friend request to Firestore:', err);
  }
}

/**
 * Delete friend request from Firestore
 */
export async function deleteFriendRequestFromFirestore(reqId: string): Promise<void> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTIONS.FRIEND_REQUESTS, reqId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Failed to delete friend request from Firestore:', err);
  }
}

/**
 * Subscribe to real-time friend requests
 */
export function subscribeToFriendRequests(onUpdate: (requests: FriendRequest[]) => void) {
  const colRef = collection(db, FIRESTORE_COLLECTIONS.FRIEND_REQUESTS);
  return onSnapshot(
    colRef,
    (snap) => {
      const list: FriendRequest[] = [];
      snap.forEach((d) => list.push(d.data() as FriendRequest));
      onUpdate(list);
    },
    (err) => console.warn('Firestore Requests subscription notice:', err)
  );
}

/**
 * Save event to Firestore
 */
export async function saveEventToFirestore(event: AlumniEvent): Promise<void> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTIONS.EVENTS, event.id);
    await setDoc(docRef, JSON.parse(JSON.stringify(event)), { merge: true });
  } catch (err) {
    console.warn('Failed to save event to Firestore:', err);
  }
}

/**
 * Delete event from Firestore
 */
export async function deleteEventFromFirestore(eventId: string): Promise<void> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTIONS.EVENTS, eventId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Failed to delete event from Firestore:', err);
  }
}

/**
 * Subscribe to real-time events
 */
export function subscribeToEvents(onUpdate: (events: AlumniEvent[]) => void) {
  const colRef = collection(db, FIRESTORE_COLLECTIONS.EVENTS);
  return onSnapshot(
    colRef,
    (snap) => {
      const list: AlumniEvent[] = [];
      snap.forEach((d) => list.push(d.data() as AlumniEvent));
      onUpdate(list);
    },
    (err) => console.warn('Firestore Events subscription notice:', err)
  );
}

/**
 * Save opportunity to Firestore
 */
export async function saveOpportunityToFirestore(opp: Opportunity): Promise<void> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTIONS.OPPORTUNITIES, opp.id);
    await setDoc(docRef, JSON.parse(JSON.stringify(opp)), { merge: true });
  } catch (err) {
    console.warn('Failed to save opportunity to Firestore:', err);
  }
}

/**
 * Delete opportunity from Firestore
 */
export async function deleteOpportunityFromFirestore(oppId: string): Promise<void> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTIONS.OPPORTUNITIES, oppId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Failed to delete opportunity from Firestore:', err);
  }
}

/**
 * Subscribe to real-time opportunities
 */
export function subscribeToOpportunities(onUpdate: (opps: Opportunity[]) => void) {
  const colRef = collection(db, FIRESTORE_COLLECTIONS.OPPORTUNITIES);
  return onSnapshot(
    colRef,
    (snap) => {
      const list: Opportunity[] = [];
      snap.forEach((d) => list.push(d.data() as Opportunity));
      onUpdate(list);
    },
    (err) => console.warn('Firestore Opportunities subscription notice:', err)
  );
}

/**
 * Save announcement to Firestore
 */
export async function saveAnnouncementToFirestore(announcement: Announcement): Promise<void> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTIONS.ANNOUNCEMENTS, announcement.id);
    await setDoc(docRef, JSON.parse(JSON.stringify(announcement)), { merge: true });
  } catch (err) {
    console.warn('Failed to save announcement to Firestore:', err);
  }
}

/**
 * Delete announcement from Firestore
 */
export async function deleteAnnouncementFromFirestore(announcementId: string): Promise<void> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTIONS.ANNOUNCEMENTS, announcementId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Failed to delete announcement from Firestore:', err);
  }
}

/**
 * Subscribe to real-time announcements
 */
export function subscribeToAnnouncements(onUpdate: (announcements: Announcement[]) => void) {
  const colRef = collection(db, FIRESTORE_COLLECTIONS.ANNOUNCEMENTS);
  return onSnapshot(
    colRef,
    (snap) => {
      const list: Announcement[] = [];
      snap.forEach((d) => list.push(d.data() as Announcement));
      onUpdate(list);
    },
    (err) => console.warn('Firestore Announcements subscription notice:', err)
  );
}

/**
 * Save chat thread & message to Firestore
 */
export async function saveChatToFirestore(chat: ChatThread): Promise<void> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTIONS.CHATS, chat.id);
    await setDoc(docRef, JSON.parse(JSON.stringify(chat)), { merge: true });
  } catch (err) {
    console.warn('Failed to save chat to Firestore:', err);
  }
}

export async function saveChatMessageToFirestore(chatId: string, msg: ChatMessage): Promise<void> {
  try {
    const msgRef = doc(db, FIRESTORE_COLLECTIONS.CHATS, chatId, 'messages', msg.id);
    await setDoc(msgRef, JSON.parse(JSON.stringify(msg)), { merge: true });
  } catch (err) {
    console.warn('Failed to save chat message to Firestore:', err);
  }
}

/**
 * Save notification to Firestore
 */
export async function saveNotificationToFirestore(notif: AppNotification): Promise<void> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTIONS.NOTIFICATIONS, notif.id);
    await setDoc(docRef, JSON.parse(JSON.stringify(notif)), { merge: true });
  } catch (err) {
    console.warn('Failed to save notification to Firestore:', err);
  }
}

/**
 * Mark notification as read in Firestore
 */
export async function markNotificationReadInFirestore(id: string): Promise<void> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTIONS.NOTIFICATIONS, id);
    await updateDoc(docRef, { read: true });
  } catch (err) {
    console.warn('Failed to mark notification read in Firestore:', err);
  }
}
