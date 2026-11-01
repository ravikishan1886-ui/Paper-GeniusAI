import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  // Check if there is an existing config or dynamic injected config
  // In AI Studio, firebase-applet-config.json is created upon ProvisionFirebase
  const config = (window as any).__FIREBASE_CONFIG__;
  if (config && Object.keys(config).length > 0) {
    app = !getApps().length ? initializeApp(config) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (e) {
  console.log('Firebase running in local client state:', e);
}

export { app, auth, db };
export const googleProvider = new GoogleAuthProvider();
