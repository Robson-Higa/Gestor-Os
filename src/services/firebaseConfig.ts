// src/services/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyDVEl8nJtYu5KiOjw1EUhOrmZnSCYdmluw',
  authDomain: 'gestor-os-5986e.firebaseapp.com',
  projectId: 'gestor-os-5986e',
  storageBucket: 'gestor-os-5986e.firebasestorage.app',
  messagingSenderId: '296474233948',
  appId: '1:296474233948:web:48574e5f6f03975487ea99',
  measurementId: 'G-2TJM69J5KD',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db, analytics };
