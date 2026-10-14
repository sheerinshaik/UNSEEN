import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { hashPassword } from '../utils/crypto.js';
import { ENV } from '../config/env.js';
import { logger } from '../utils/logger.js';

async function bootstrapAdmin() {
  try {
    await connectDB();

    const email = ENV.BOOTSTRAP_ADMIN_EMAIL;
    const password = ENV.BOOTSTRAP_ADMIN_PASSWORD;

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      logger.info(`Administrator account already exists: ${email}`);
      await disconnectDB();
      process.exit(0);
    }

    const passwordHash = await hashPassword(password);
    const admin = await User.create({
      email,
      passwordHash,
      role: 'admin',
      department: 'Platform Administration'
    });

    logger.info(`Administrator account successfully bootstrapped: ${admin.email}`);
    logger.info('Please change default credentials immediately in production environments.');

    await disconnectDB();
    process.exit(0);
  } catch (err) {
    logger.error('Error during administrator bootstrap:', err);
    await disconnectDB();
    process.exit(1);
  }
}

bootstrapAdmin();
