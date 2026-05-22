import * as admin from "firebase-admin";

function getServiceAccount() {
  const serviceAccountJson = process.env.FB_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    return JSON.parse(serviceAccountJson);
  }

  const projectId = process.env.FB_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FB_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = (process.env.FB_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY)?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return { projectId, clientEmail, privateKey };
}

export function getAdminApp() {
  if (admin.apps.length) return admin.app();

  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    throw new Error(
      "Firebase Admin is not configured. Set FB_SERVICE_ACCOUNT_JSON or the project/client/private key env vars.",
    );
  }

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.projectId,
  });
}

export function getAdminAuth() {
  return getAdminApp().auth();
}

export function getFirestore() {
  return getAdminApp().firestore();
}

export { admin };
