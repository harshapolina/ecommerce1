import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDKvGJayaN0L-MBHjj-yl2WuEkpBwTIWVo",
  authDomain: "harsha-42823.firebaseapp.com",
  projectId: "harsha-42823",
  storageBucket: "harsha-42823.firebasestorage.app",
  messagingSenderId: "802937303612",
  appId: "1:802937303612:web:a9b7fc5172478f68200939",
  measurementId: "G-K8VZD4KR9M"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, analytics };

