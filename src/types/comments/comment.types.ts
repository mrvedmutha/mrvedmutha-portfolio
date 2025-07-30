export interface CommentUser {
  userId: string;
  displayName: string;
  avatar: string;
  isAnonymous: boolean;
  provider: 'google' | 'github';
  email?: string; // Only if user chooses to show
}

export interface CommentVotes {
  upvotes: number;
  downvotes: number;
  score: number;
  userVotes: Array<{
    userId: string;
    vote: 'up' | 'down';
  }>;
}

export interface CommentReport {
  reportedBy: string;
  reason: string;
  reportedAt: Date;
}

export interface EditHistory {
  previousContent: string;
  editedAt: Date;
  editReason?: string;
}

export interface DeletionInfo {
  userId: string;
  displayName: string;
  role: 'user' | 'admin';
}

export interface Comment {
  _id: string;
  content: string;
  author: CommentUser;
  
  // Threading
  parentId: string | null;
  replies: string[]; // Comment IDs
  depth: number;
  blogId: string;
  
  // Status & Actions
  status: 'active' | 'edited' | 'deleted_by_user' | 'deleted_by_admin';
  isEdited: boolean;
  editHistory: EditHistory[];
  
  // Deletion tracking
  deletedAt: Date | null;
  deletedBy: DeletionInfo | null;
  deletionReason: string | null;
  
  // Voting & Reporting
  votes: CommentVotes;
  isReported: boolean;
  reports: CommentReport[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentFormData {
  content: string;
  parentId?: string;
  useRealName: boolean;
  showEmail: boolean;
}

export interface CommentActionProps {
  comment: Comment;
  currentUserId: string | null;
  isAdmin: boolean;
  onReply: (parentId: string) => void;
  onEdit: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onVote: (commentId: string, vote: 'up' | 'down') => void;
  onReport: (commentId: string, reason: string) => void;
}