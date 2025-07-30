import { Schema, Types } from "mongoose";

const CommentUserSchema = new Schema(
  {
    userId: { type: String, required: true },
    displayName: { type: String, required: true },
    avatar: { type: String, required: true },
    isAnonymous: { type: Boolean, default: false },
    provider: { type: String, required: true },
    email: { type: String, required: false }, // Optional - only if user chooses to show
  },
  { _id: false }
);

const VotesSchema = new Schema(
  {
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    userVotes: [{
      userId: { type: String, required: true },
      vote: { type: String, enum: ['up', 'down'], required: true }
    }]
  },
  { _id: false }
);

const EditHistorySchema = new Schema(
  {
    previousContent: { type: String, required: true },
    editedAt: { type: Date, default: Date.now },
    editReason: { type: String, required: false }
  },
  { _id: false }
);

const DeletionInfoSchema = new Schema(
  {
    userId: { type: String, required: true },
    displayName: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], required: true }
  },
  { _id: false }
);

const ReportSchema = new Schema(
  {
    reportedBy: { type: String, required: true },
    reason: { type: String, required: true },
    reportedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

export const CommentSchema = new Schema({
  content: { type: String, required: true },
  author: { type: CommentUserSchema, required: true },
  
  // Threading
  parentId: { type: Types.ObjectId, ref: 'Comment', default: null },
  replies: [{ type: Types.ObjectId, ref: 'Comment' }],
  depth: { type: Number, default: 0 },
  blogId: { type: Types.ObjectId, ref: 'Blog', required: true },
  
  // Status & Actions
  status: { 
    type: String, 
    enum: ['active', 'edited', 'deleted_by_user', 'deleted_by_admin'], 
    default: 'active' 
  },
  isEdited: { type: Boolean, default: false },
  editHistory: [EditHistorySchema],
  
  // Deletion tracking
  deletedAt: { type: Date, default: null },
  deletedBy: { type: DeletionInfoSchema, default: null },
  deletionReason: { type: String, default: null },
  
  // Voting & Reporting
  votes: { type: VotesSchema, default: () => ({}) },
  isReported: { type: Boolean, default: false },
  reports: [ReportSchema],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
