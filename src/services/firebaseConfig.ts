// src/services/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyA7tf_NX65Sj1vTCX6l2JHFH3hd0Y7lZ3k",
  authDomain: "gestor-os.firebaseapp.com",
  projectId: "gestor-os",
  storageBucket: "gestor-os.firebasestorage.app",
  messagingSenderId: "277275835118",
  appId: "1:277275835118:web:1127fdf004e0bc8be891ff"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db, analytics, app };
