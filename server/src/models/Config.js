import mongoose from 'mongoose';
import { VALID_CATEGORIES } from './Report.js';

const configSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const AppConfig = mongoose.model('AppConfig', configSchema);

export async function getActiveCategories() {
  try {
    const config = await AppConfig.findOne({ key: 'report_categories' });
    if (config && Array.isArray(config.value) && config.value.length > 0) {
      return config.value;
    }
    return VALID_CATEGORIES;
  } catch {
    return VALID_CATEGORIES;
  }
}
