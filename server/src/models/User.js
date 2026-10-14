import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false // Never include in standard queries
    },
    role: {
      type: String,
      enum: ['citizen', 'reviewer', 'admin'],
      default: 'citizen',
      index: true
    },
    department: {
      type: String,
      trim: true,
      default: 'General'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const User = mongoose.model('User', userSchema);
