// Firebase project: tws-job-board (Firestore in Sydney, Google sign-in).
// Paste the web app config from Firebase console > Project settings > Your apps.
window.FIREBASE_CONFIG = {
  apiKey: "PASTE_API_KEY",
  authDomain: "tws-job-board.firebaseapp.com",
  projectId: "tws-job-board",
  storageBucket: "tws-job-board.firebasestorage.app",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};
// Owners always get in and are managers. Must match firestore.rules.
window.OWNERS = ["luke@totalwelding.com.au"];
// Shown on the calendar before anyone is let in.
window.DEFAULT_CREW = ["Luke", "Hudson", "Jake"];
