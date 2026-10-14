import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Report } from '../src/models/Report.js';
import { UserVault } from '../src/models/UserVault.js';
import { hashPassword, hashTrackingSecret, generateTrackingSecret } from '../src/utils/crypto.js';

const TEST_DB_URI = 'mongodb://127.0.0.1:27017/unseen_test';

describe('UNSEEN Automated Security, Privacy, and Workflow Test Suite', () => {
  let citizenToken = '';
  let citizenUser = null;
  let reviewerToken = '';
  let reviewerUser = null;
  let adminToken = '';
  let adminUser = null;
  let sampleReport = null;
  let sampleTrackingSecret = '';

  before(async () => {
    await connectDB(TEST_DB_URI);
    await User.deleteMany({});
    await Report.deleteMany({});
    await UserVault.deleteMany({});

    // Seed test users
    const pwdHash = await hashPassword('TestPassword123!');
    citizenUser = await User.create({
      email: 'citizen.test@example.com',
      passwordHash: pwdHash,
      role: 'citizen'
    });

    reviewerUser = await User.create({
      email: 'reviewer.test@unseen.internal',
      passwordHash: pwdHash,
      role: 'reviewer',
      department: 'Ethics Committee'
    });

    adminUser = await User.create({
      email: 'admin.test@unseen.internal',
      passwordHash: pwdHash,
      role: 'admin'
    });

    // Obtain sessions
    const citizenLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'citizen.test@example.com', password: 'TestPassword123!' });
    citizenToken = citizenLogin.headers['set-cookie'];

    const reviewerLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'reviewer.test@unseen.internal', password: 'TestPassword123!' });
    reviewerToken = reviewerLogin.headers['set-cookie'];

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin.test@unseen.internal', password: 'TestPassword123!' });
    adminToken = adminLogin.headers['set-cookie'];

    // Create a base report for tests
    sampleTrackingSecret = generateTrackingSecret();
    sampleReport = await Report.create({
      reference: 'UNS-TEST-1001-A2B3',
      category: 'Unfair treatment',
      description: 'Test confidential incident description regarding grading disparity.',
      status: 'Submitted',
      priority: 'Standard',
      trackingSecretHash: hashTrackingSecret(sampleTrackingSecret)
    });
  });

  after(async () => {
    await User.deleteMany({});
    await Report.deleteMany({});
    await UserVault.deleteMany({});
    await disconnectDB();
  });

  // Test 1: Unauthenticated users cannot access protected endpoints
  it('Requirement 1: Unauthenticated users cannot access protected APIs', async () => {
    const res = await request(app).get('/api/reports/my-reports');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  // Test 2: Users cannot access other users private reports
  it('Requirement 2: Users cannot access other users private reports', async () => {
    const pwdHash = await hashPassword('OtherUserPass123!');
    await User.create({
      email: 'other.citizen@example.com',
      passwordHash: pwdHash,
      role: 'citizen'
    });
    const otherLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'other.citizen@example.com', password: 'OtherUserPass123!' });
    const otherToken = otherLogin.headers['set-cookie'];

    const submitRes = await request(app)
      .post('/api/reports/submit')
      .set('Cookie', otherToken)
      .send({
        category: 'Privacy concern',
        description: 'Private incident belonging strictly to other citizen user.'
      });
    assert.equal(submitRes.status, 201);
    const otherRef = submitRes.body.report.reference;

    const myReportsRes = await request(app).get('/api/reports/my-reports').set('Cookie', citizenToken);
    assert.equal(myReportsRes.status, 200);
    const refs = myReportsRes.body.reports.map((r) => r.reference);
    assert.equal(refs.includes(otherRef), false);
  });

  // Test 3: Users cannot change report ownership through request manipulation
  it('Requirement 3: Users cannot change report ownership through request manipulation', async () => {
    const submitRes = await request(app)
      .post('/api/reports/submit')
      .set('Cookie', citizenToken)
      .send({
        category: 'Administrative inconvenience',
        description: 'Submission with attempted parameter pollution and owner hijacking.',
        userId: '60c72b2f9b1d8b2bad000001',
        ownerId: '60c72b2f9b1d8b2bad000001',
        submitter: 'someone_else@example.com'
      });
    assert.equal(submitRes.status, 201);

    const ref = submitRes.body.report.reference;
    const dbReport = await Report.findOne({ reference: ref }).lean();
    assert.equal(dbReport.userId, undefined);
    assert.equal(dbReport.ownerId, undefined);
    assert.equal(dbReport.submitter, undefined);

    const vault = await UserVault.findOne({ reportReference: ref });
    assert.equal(vault.userId.toString(), citizenUser._id.toString());
  });

  // Test 4: Normal users cannot access reviewer or administrator endpoints
  it('Requirement 4: Normal citizens cannot access reviewer or administrator endpoints', async () => {
    const reviewerRes = await request(app).get('/api/reviewer/overview').set('Cookie', citizenToken);
    assert.equal(reviewerRes.status, 403);
    assert.equal(reviewerRes.body.success, false);

    const adminRes = await request(app).get('/api/admin/overview').set('Cookie', citizenToken);
    assert.equal(adminRes.status, 403);
    assert.equal(adminRes.body.success, false);
  });

  // Test 5: Reviewers cannot retrieve submitter identity fields
  it('Requirement 5: Reviewers cannot retrieve submitter identity fields', async () => {
    const res = await request(app)
      .get(`/api/reviewer/reports/${sampleReport.reference}`)
      .set('Cookie', reviewerToken);

    assert.equal(res.status, 200);
    const reportData = res.body.report;
    assert.equal(reportData.email, undefined);
    assert.equal(reportData.submitterEmail, undefined);
    assert.equal(reportData.submitterName, undefined);
    assert.equal(reportData.userId, undefined);
    assert.equal(reportData.trackingSecretHash, undefined);
    assert.equal(reportData.trackingSecret, undefined);
    assert.equal(reportData.ipAddress, undefined);
  });

  // Test 6: Administrators cannot use normal application functionality to map reports to submitters
  it('Requirement 6: Administrators cannot map reports to submitters through app APIs', async () => {
    const reportsRes = await request(app).get('/api/reviewer/reports').set('Cookie', adminToken);
    assert.equal(reportsRes.status, 200);
    reportsRes.body.reports.forEach((report) => {
      assert.equal(report.userId, undefined);
      assert.equal(report.email, undefined);
      assert.equal(report.submitterEmail, undefined);
      assert.equal(report.trackingSecretHash, undefined);
    });

    const reviewersRes = await request(app).get('/api/admin/reviewers').set('Cookie', adminToken);
    assert.equal(reviewersRes.status, 200);
    const returnedEmails = reviewersRes.body.reviewers.map((r) => r.email);
    assert.equal(returnedEmails.includes(citizenUser.email), false);
  });

  // Test 7: Passwords are hashed and never returned in API responses
  it('Requirement 7: Passwords are hashed and never returned', async () => {
    const userInDb = await User.findById(citizenUser._id).select('+passwordHash');
    assert.ok(userInDb.passwordHash);
    assert.notEqual(userInDb.passwordHash, 'TestPassword123!');
    assert.ok(userInDb.passwordHash.startsWith('$2'));

    const meRes = await request(app).get('/api/auth/me').set('Cookie', citizenToken);
    assert.equal(meRes.status, 200);
    assert.equal(meRes.body.user.password, undefined);
    assert.equal(meRes.body.user.passwordHash, undefined);
  });

  // Test 8: Report references do not authorize private access by themselves
  it('Requirement 8: Report references do not authorize private access by themselves', async () => {
    const resNoSecret = await request(app)
      .post('/api/reports/track')
      .send({ reference: sampleReport.reference });
    assert.equal(resNoSecret.status, 400);

    const resWrongSecret = await request(app)
      .post('/api/reports/track')
      .send({ reference: sampleReport.reference, trackingSecret: 'sec_wrong_guess_12345678' });
    assert.equal(resWrongSecret.status, 401);
    assert.equal(resWrongSecret.body.success, false);

    const resValid = await request(app)
      .post('/api/reports/track')
      .send({ reference: sampleReport.reference, trackingSecret: sampleTrackingSecret });
    assert.equal(resValid.status, 200);
    assert.equal(resValid.body.report.reference, sampleReport.reference);
  });

  // Test 9: Retrieval secrets are not stored in plaintext or exposed in normal logs
  it('Requirement 9: Retrieval secrets are not stored in plaintext', async () => {
    const reportFromDb = await Report.findOne({ reference: sampleReport.reference }).select('+trackingSecretHash');
    assert.equal(reportFromDb.trackingSecret, undefined);
    assert.ok(reportFromDb.trackingSecretHash);
    assert.notEqual(reportFromDb.trackingSecretHash, sampleTrackingSecret);
    assert.equal(reportFromDb.trackingSecretHash.length, 64);
  });

  // Test 10: Status updates require the correct permissions
  it('Requirement 10: Status updates require correct permissions', async () => {
    const citizenAttempt = await request(app)
      .patch(`/api/reviewer/reports/${sampleReport.reference}/status`)
      .set('Cookie', citizenToken)
      .send({ status: 'Resolved' });
    assert.equal(citizenAttempt.status, 403);

    const reviewerUpdate = await request(app)
      .patch(`/api/reviewer/reports/${sampleReport.reference}/status`)
      .set('Cookie', reviewerToken)
      .send({ status: 'Under review', note: 'Case assigned for preliminary review' });
    assert.equal(reviewerUpdate.status, 200);
    assert.equal(reviewerUpdate.body.report.status, 'Under review');
  });

  // Test 11: API responses do not expose unnecessary private fields
  it('Requirement 11: API responses do not expose unnecessary private fields', async () => {
    const trackRes = await request(app)
      .post('/api/reports/track')
      .send({ reference: sampleReport.reference, trackingSecret: sampleTrackingSecret });
    assert.equal(trackRes.status, 200);
    const rep = trackRes.body.report;
    assert.equal(rep.trackingSecretHash, undefined);
    assert.equal(rep.__v, undefined);
  });

  // Test 12: Invalid requests are rejected with clear validation messages
  it('Requirement 12: Invalid requests are rejected', async () => {
    const invalidSubmit = await request(app)
      .post('/api/reports/submit')
      .send({
        category: 'Invalid Nonexistent Category',
        description: 'Too short'
      });
    assert.equal(invalidSubmit.status, 400);
    assert.equal(invalidSubmit.body.success, false);
  });

  // Test 13: Disclosure summary matches actual backend behavior
  it('Requirement 13: Disclosure summary matches actual backend behavior', async () => {
    const res = await request(app).get('/api/reports/disclosure-summary');
    assert.equal(res.status, 200);
    assert.ok(res.body.disclosure.neverVisibleToReviewers.includes('Submitter account email'));
    assert.ok(res.body.disclosure.neverVisibleToReviewers.includes('Submitter user account ID'));
    assert.equal(res.body.disclosure.workflowRequiresIdentity, false);
  });

  // Test 14: Demo verification cannot be mistaken for real institutional verification
  it('Requirement 14: Demo verification is clearly marked as simulated', async () => {
    const demoRes = await request(app)
      .post('/api/demo/selective-disclosure')
      .send({ attributeType: 'student_status', testValue: 'STU-992' });
    assert.equal(demoRes.status, 200);
    assert.equal(demoRes.body.isSimulatedDemonstration, true);
    assert.ok(demoRes.body.notice.includes('educational synthetic simulation'));
  });

  // Test 15: The application handles health check and database status cleanly
  it('Requirement 15: Health check endpoint accurately reports database status', async () => {
    const healthRes = await request(app).get('/api/health');
    assert.equal(healthRes.status, 200);
    assert.equal(healthRes.body.status, 'healthy');
    assert.equal(healthRes.body.database, 'connected');
    assert.ok(healthRes.body.uptimeSeconds >= 0);
    assert.equal(JSON.stringify(healthRes.body).includes('mongodb://'), false);
    assert.equal(JSON.stringify(healthRes.body).includes('secret'), false);
  });
});
