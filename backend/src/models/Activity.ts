import mongoose, { Document, Schema } from "mongoose";

interface Time {
  hour: number;
  minute: number;
}

interface Location {
  address: string;
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
  postalCode?: string;
  locality?: string;
}

interface IActivity extends Document {
  title: string;
  description: string;
  author: mongoose.Schema.Types.ObjectId;
  coOrganizers: mongoose.Schema.Types.ObjectId[];
  unApprovedUsers: mongoose.Schema.Types.ObjectId[];
  unApprovedCoOrganizers: mongoose.Schema.Types.ObjectId[];
  date: Date;
  createAtivityType: string;
  addressOnlyForAttendees: boolean;
  inviteCommunity: boolean;
  buyTicketsLink?: string;
  friendsNumber?: number;
  notifyPreviousAttendees?: boolean;
  inviteMore?: boolean;
  requestCoOrga?: boolean;
  startTime: Time;
  endTime: Time;
  location: Location;
  metroStation?: string;
  ages: string[];
  ageRestriction: boolean;
  attendeesValidation: boolean;
  attendeeLimit?: number;
  hasPrice: boolean;
  price?: number;
  ticketLink?: string;
  activityImage?: string;
  infoLine?: string;
  howToFind?: string;
  topic?: number;
  isOnline: boolean;
  attendees: mongoose.Schema.Types.ObjectId[];
  waitingList: mongoose.Schema.Types.ObjectId[];
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
  coOrganizerRequests?: mongoose.Schema.Types.ObjectId[];
  coOrganizerOffers?: mongoose.Schema.Types.ObjectId[];
  whatsappLink?: string;
  fbPageLink?: string;
  fbGroupLink?: string;
  meetupLink?: string;
  telegramLink?: string;
  otherLink?: string;
  likes: mongoose.Schema.Types.ObjectId[];
  comments: mongoose.Schema.Types.ObjectId[];
  interested?: number;
  createdAt: Date;
  updatedAt: Date;
  communityOptionIsSelected: boolean;
  communityMeDistance?: number;
  communityMeetingPointDistance?: number;
  peopleMetNotif?: boolean;
  peopleMetAsOrgaNotif?: boolean;
  peopleWhoLoveMyTopicNotif?: boolean;
  peopleLanguageIsSelected: boolean;
  peopleLanguageOptions?: string[];
  optionalFeaturesIsSelected: boolean;
  optionalFeaturesOptions?: string[];
  manageParityIsSelected: boolean;
  manageParityMalePercentage?: number;
  manageParityInfoLine?: string;
  manageParityFriendsAllowed?: number;
  notificationSettings: Map<string, Map<string, boolean>>;
  interactions: mongoose.Schema.Types.ObjectId[];

}

const timeSchema: Schema = new Schema(
  {
    hour: { type: Number, min: 0, max: 23, required: true },
    minute: { type: Number, min: 0, max: 59, required: true },
  },
  { _id: false }
);

const locationSchema: Schema = new Schema(
  {
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    latitudeDelta: { type: Number },
    longitudeDelta: { type: Number },
    postalCode: { type: String },
    locality: { type: String },
  },
  { _id: false }
);

const ActivitySchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  coOrganizers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  unApprovedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  unApprovedCoOrganizers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  date: { type: Date, required: true },
  createAtivityType: { type: String, required: true },
  addressOnlyForAttendees: { type: Boolean, required: true },
  inviteCommunity: { type: Boolean, required: true },
  buyTicketsLink: { type: String },
  friendsNumber: { type: Number },
  notifyPreviousAttendees: { type: Boolean },
  inviteMore: { type: Boolean },
  requestCoOrga: { type: Boolean },
  startTime: { type: timeSchema, required: true },
  endTime: { type: timeSchema, required: true },
  location: { type: locationSchema, required: true },
  metroStation: { type: String },
  ages: { type: [String], default: ["18", "99"] },
  ageRestriction: { type: Boolean, required: true },
  attendeesValidation: { type: Boolean, required: true },
  attendeeLimit: { type: Number },
  hasPrice: { type: Boolean, required: true },
  price: { type: Number },
  ticketLink: { type: String },
  activityImage: { type: String },
  infoLine: { type: String },
  howToFind: { type: String },
  topic: { type: Number },
  isOnline: { type: Boolean, required: true },
  attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  waitingList: [{ type: Schema.Types.ObjectId, ref: "User" }],
  allowGuests: { type: Boolean },
  allowPhoneNumberDisplay: { type: Boolean },
  friendsOnly: { type: Boolean },
  selectPeople: { type: Boolean },
  repeatEvent: { type: Boolean },
  repeatEventFrequency: { type: String },
  repeatEventDays: { type: [String] },
  repeatEventEndDate: { type: String, default: "" },
  requestCoOrganizers: { type: Boolean },
  coOrganizerGifts: { type: [String] },
  coOrganizerConditions: { type: [String] },
  helpForOrganizers: { type: Boolean },
  coOrganizerRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
  coOrganizerOffers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  whatsappLink: { type: String },
  fbPageLink: { type: String },
  fbGroupLink: { type: String },
  meetupLink: { type: String },
  telegramLink: { type: String },
  otherLink: { type: String },
  likes: [{ type: Schema.Types.ObjectId, ref: "Interaction" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  interested: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  communityOptionIsSelected: { type: Boolean, default: false },
  communityMeDistance: { type: Number, min: 2, max: 20 },
  communityMeetingPointDistance: { type: Number, min: 2, max: 20 },
  peopleMetNotif: { type: Boolean, default: false },
  peopleMetAsOrgaNotif: { type: Boolean, default: false },
  peopleWhoLoveMyTopicNotif: { type: Boolean, default: false },
  peopleLanguageIsSelected: { type: Boolean, default: false },
  peopleLanguageOptions: { type: [String] },
  optionalFeaturesIsSelected: { type: Boolean, default: false },
  optionalFeaturesOptions: { type: [String] },
  manageParityIsSelected: { type: Boolean, default: false },
  manageParityMalePercentage: { type: Number, min: 0, max: 100 },
  manageParityInfoLine: { type: String },
  manageParityFriendsAllowed: { type: Number, min: 1, max: 5 },
  notificationSettings: {
    type: Map,
    of: {
      type: Map,
      of: Boolean,
    },
  },
  interactions: [{ type: Schema.Types.ObjectId, ref: "Interaction" }],
});

export default mongoose.model<IActivity>("Activity", ActivitySchema);
