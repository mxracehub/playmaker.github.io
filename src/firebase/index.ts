'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, AppCheck } from 'firebase/app-check';

let appCheckInstance: AppCheck | null = null;

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  let firebaseApp: FirebaseApp;

  if (!getApps().length) {
    try {
      firebaseApp = initializeApp();
    } catch (e) {
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }
  } else {
    firebaseApp = getApp();
  }

  // App Check Initialization with reCAPTCHA Enterprise
  if (typeof window !== 'undefined' && !appCheckInstance) {
    /**
     * ARENA SECURITY SHIELD
     * We prioritize the debug token if provided. 
     * In development or on localhost, we enable debug mode.
     */
    if (process.env.NODE_ENV !== 'production' || window.location.hostname === 'localhost') {
      // @ts-ignore
      window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }

    try {
      appCheckInstance = initializeAppCheck(firebaseApp, {
        provider: new ReCaptchaEnterpriseProvider('6LfU-ZssAAAAAFcYu-2NemXNroyLyheF3YzMCh9v'),
        isTokenAutoRefreshEnabled: true
      });
      console.log("[ARENA SHIELD] App Check initialized successfully.");
    } catch (err) {
      console.warn("[ARENA SHIELD] App Check initialization skipped or failed:", err);
    }
  }

  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
