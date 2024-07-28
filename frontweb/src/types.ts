// types.ts


export interface Time {
  hour: number;
  minute: number;
}

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

export interface IActivity {
  _id?: string;
  title: string;
  description: string;
  author?: string;
  coOrganizers?: string[];
  unApprovedUsers?: string[];
  unApprovedCoOrganizers?: string[];
  date: string;
  createAtivityType?: string;
  addressOnlyForAttendees?: boolean;
  inviteCommunity?: boolean;
  buyTicketsLink?: string;
  friendsNumber?: number;
  notifyPreviousAttendees?: boolean;
  inviteMore?: boolean;
  requestCoOrga?: boolean;
  startTime: Time;
  endTime: Time;
  location: Location;
  metroStation?: string;
  ages?: string[];
  ageRestriction?: boolean;
  attendeesValidation?: boolean;
  attendeeLimit?: number;
  hasPrice?: boolean;
  price?: number;
  ticketLink?: string;
  activityImage?: string;
  infoLine?: string;
  howToFind?: string;
  topic?: number;
  isOnline: boolean;
  attendees?: string[];
  waitingList?: string[];
  allowGuests?: boolean;
  allowPhoneNumberDisplay?: boolean;
  friendsOnly?: boolean;
  selectPeople?: boolean;
  repeatEvent?: boolean;
  repeatEventFrequency?: string;
  repeatEventDays?: string[];
  repeatEventEndDate?: string;
  requestCoOrganizers?: boolean;
  coOrganizerGifts?: string[];
  coOrganizerConditions?: string[];
  helpForOrganizers?: boolean;
  coOrganizerRequests?: string[];
  coOrganizerOffers?: string[];
  whatsappLink?: string;
  fbPageLink?: string;
  fbGroupLink?: string;
  meetupLink?: string;
  telegramLink?: string;
  otherLink?: string;
  likes?: string[];
  comments?: string[];
  interested?: number;
  createdAt?: string;
  updatedAt?: string;
  communityOptionIsSelected?: boolean;
  communityMeDistance?: number;
  communityMeetingPointDistance?: number;
  peopleMetNotif?: boolean;
  peopleMetAsOrgaNotif?: boolean;
  peopleWhoLoveMyTopicNotif?: boolean;
  peopleLanguageIsSelected?: boolean;
  peopleLanguageOptions?: string[];
  optionalFeaturesIsSelected?: boolean;
  optionalFeaturesOptions?: string[];
  manageParityIsSelected?: boolean;
  manageParityMalePercentage?: number;
  manageParityInfoLine?: string;
  manageParityFriendsAllowed?: number;
  notificationSettings?: Map<string, Map<string, boolean>>;
  interactions?: string[];
}
export interface Post {
  id: string;
  userId: string;
  userFirstName: string;
  userLastName: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  likes: Like[];
  unlikes: Unlike[];
  shares: Share[];
  images: string[];
  repostCount: number;
  reposters: string[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  firstName: string;
  lastName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: Like[];
  unlikes: Unlike[];
}

export interface Like {
  id: string;
  userId: string;
  entityId: string; // ID of the entity being liked (User, Post, Comment, etc.)
  entityType: string; // Type of the entity (User, Post, Comment, etc.)
  createdAt: string;
  firstName: string;
  lastName: string;
}

export interface Unlike {
  id: string;
  userId: string;
  entityId: string; // ID of the entity being unliked (Post, Comment, etc.)
  entityType: string; // Type of the entity (Post, Comment, etc.)
  createdAt: string;
  firstName: string;
  lastName: string;
}

export interface Share {
  id: string;
  userId: string;
  postId: string;
  userEmail: string;
  sharedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  message: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  type: string;
}

export interface Conversation {
  id: string;
  senderId: string;
  senderFirstName: string;
  senderLastName: string;
  receiverId: string;
  receiverFirstName: string;
  receiverLastName: string;
  name: string;
  messages: Message[];
  likes: Like[];
  unlikes: Unlike[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderFirstName: string;
  senderLastName: string;
  content: string;
  timestamp: string;
  likes: Like[];
}

export interface FriendInfo {
  userId: string;
  firstName: string;
  lastName: string;
}

export interface Follow {
  followerId: string;
  followeeId: string;
}

export interface ProfileVisit {
  userId: string;
  visitDate: string;
}

export interface Block {
  blockerId: string;
  blockedId: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  apiKey: string;
  posts: Post[];
  notifications: Notification[];
  conversations: Conversation[];
  likes: Like[];
  unlikes: Unlike[];
  friends: FriendInfo[];
  friendRequests: FriendInfo[];
  following: Follow[];
  followers: Follow[];
  profileVisits: ProfileVisit[];
  blocks: Block[];
}

export interface PostCreatedSuccessData {
  postId: string;
  userFirstName: string;
  userLastName: string;
  content: string;
}

export interface CommentCreatedSuccessData {
  commentId: string;
  userId: string;
  postId: string;
  content: string;
  userFirstName: string;
  userLastName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostGetAllSuccessData {
  posts: Post[];
}

export interface ApiError {
  message: string;
  status?: number;
  [key: string]: unknown;
}

// Helper type to represent objects with $date property
interface DateObject {
  $date: string;
}

// Function to convert dates from JSON format to Date objects
export function convertDates(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  for (const key in obj as Record<string, unknown>) {
    if ((obj as Record<string, unknown>).hasOwnProperty(key)) {
      const value = (obj as Record<string, unknown>)[key];
      if (typeof value === 'object' && value !== null && '$date' in value) {
        (obj as Record<string, unknown>)[key] = new Date((value as DateObject).$date);
      } else if (Array.isArray(value)) {
        (obj as Record<string, unknown>)[key] = value.map((item) => convertDates(item));
      } else if (typeof value === 'object') {
        (obj as Record<string, unknown>)[key] = convertDates(value);
      }
    }
  }

  return obj;
}

// Function to parse User data and convert date fields
export function parseUser(userData: unknown): User {
  return convertDates(userData) as User;
}

export type ErrorPayload = {
  error: string;
};

export type WebSocketMessage =
  | { type: 'user.create'; payload: Partial<User> }
  | { type: 'user.getCurrent'; payload: Record<string, never> }
  | { type: 'user.getByEmail'; payload: { email: string } }
  | { type: 'user.getById'; payload: { userId: string } }
  | { type: 'user.update'; payload: Partial<User> & { userId: string } }
  | { type: 'user.delete'; payload: { userId: string } }
  | { type: 'user.check'; payload: { email: string } }
  | { type: 'post.create'; payload: Omit<Post, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'post.getAll'; payload: Record<string, never> }
  | { type: 'post.getById'; payload: { postId: string } }
  | { type: 'post.update'; payload: { postId: string; content: string } }
  | { type: 'post.delete'; payload: { postId: string } }
  | { type: 'comment.create'; payload: Omit<Comment, 'id'> }
  | { type: 'conversation.create'; payload: Omit<Conversation, 'id'> }
  | { type: 'conversation.getById'; payload: { conversationId: string } }
  | { type: 'conversation.getAll'; payload: Record<string, never> }
  | { type: 'conversation.update'; payload: { conversationId: string; name: string } }
  | { type: 'conversation.delete'; payload: { conversationId: string } }
  | { type: 'notification'; payload: Notification }
  | { type: 'error'; payload: ErrorPayload }
  | { type: string; payload: unknown };
