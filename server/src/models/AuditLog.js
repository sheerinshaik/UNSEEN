import mongoose from 'mongoose';

/**
 * AuditLog Model
 * Records security-relevant operational events without logging passwords, tokens,
 * full report contents, or identity-to-report mappings.
 */
const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      index: true
    },
    actorRole: {
      type: String,
      enum: ['Anonymous', 'Citizen', 'Reviewer', 'Administrator', 'System'],
      default: 'Anonymous',
      index: true
    },
    reference: {
      type: String,
      index: true,
      default: null
    },
    details: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ''
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILURE', 'DENIED'],
      default: 'SUCCESS'
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: false
  }
);

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
