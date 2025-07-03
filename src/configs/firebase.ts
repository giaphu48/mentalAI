import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCajiHLfvizngdJlxr4N5ocZP7N-X2JLdw",
  authDomain: "mentalhealthai-6745b.firebaseapp.com",
  projectId: "mentalhealthai-6745b",
  storageBucket: "mentalhealthai-6745b.firebasestorage.app",
  messagingSenderId: "260591326392",
  appId: "1:260591326392:web:b6e5cd28d4c728d785904d",
  measurementId: "G-2VV5PQ82L9"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { auth };