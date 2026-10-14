import mongoose from 'mongoose';

export const VALID_CATEGORIES = [
  'Unfair treatment',
  'Harassment or uncomfortable situation',
  'Administrative inconvenience',
  'Public-service delay',
  'Privacy concern',
  'Other'
];

export const VALID_STATUSES = [
  'Submitted',
  'Under review',
  'Action required',
  'Resolved',
  'Closed'
];

export const VALID_PRIORITIES = ['Standard', 'Urgent', 'Low'];

const timelineItemSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: VALID_STATUSES
    },
    note: {
      type: String,
      trim: true,
      default: ''
    },
    updatedByRole: {
      type: String,
      enum: ['System', 'Submitter', 'Reviewer', 'Administrator'],
      default: 'Reviewer'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const reviewerResponseSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000
    },
    roleLabel: {
      type: String,
      default: 'Authorized Reviewer',
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const reportSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: VALID_CATEGORIES,
      index: true
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 5000
    },
    incidentDate: {
      type: String,
      trim: true,
      maxlength: 100,
      default: ''
    },
    departmentOrLocation: {
      type: String,
      trim: true,
      maxlength: 150,
      default: ''
    },
    requestedResolution: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ''
    },
    status: {
      type: String,
      enum: VALID_STATUSES,
      default: 'Submitted',
      index: true
    },
    priority: {
      type: String,
      enum: VALID_PRIORITIES,
      default: 'Standard',
      index: true
    },
    // The tracking secret hash is ONLY used for private secret-based retrieval
    // It is NEVER returned in responses (select: false) and never readable by reviewers or admins
    trackingSecretHash: {
      type: String,
      required: true,
      select: false,
      index: true
    },
    timeline: {
      type: [timelineItemSchema],
      default: () => [
        {
          status: 'Submitted',
          note: 'Report securely registered with zero submitter identity linkage.',
          updatedByRole: 'System',
          timestamp: new Date()
        }
      ]
    },
    reviewerResponses: {
      type: [reviewerResponseSchema],
      default: []
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.trackingSecretHash;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const Report = mongoose.model('Report', reportSchema);
