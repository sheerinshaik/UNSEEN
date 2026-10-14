import mongoose from 'mongoose';

/**
 * UserVault Model
 * Stores private linkages between an authenticated citizen account and their report references.
 * CRITICAL PRIVACY BOUNDARY:
 * - This collection is strictly isolated to the citizen's own session.
 * - No reviewer, administrator, or department head API or UI ever queries or touches this collection.
 * - It allows citizens to view their own submitted reports without embedding user identifiers in the Report document itself.
 */
const userVaultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    reportReference: {
      type: String,
      required: true,
      index: true
    },
    category: {
      type: String,
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

userVaultSchema.index({ userId: 1, reportReference: 1 }, { unique: true });

export const UserVault = mongoose.model('UserVault', userVaultSchema);
