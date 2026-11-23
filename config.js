// Firebase project: tws-job-board (Firestore in Sydney, Google sign-in).
// Paste the web app config from Firebase console > Project settings > Your apps.
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyAWV9QW_CdoQ81UI-7BCT3dGRXyUzEQMQo",
  authDomain: "tws-job-board.firebaseapp.com",
  projectId: "tws-job-board",
  storageBucket: "tws-job-board.firebasestorage.app",
  messagingSenderId: "225485000932",
  appId: "1:225485000932:web:adcfa3406f71fdefd5dcf1"
};
// Owners always get in and are managers. Must match firestore.rules.
window.OWNERS = ["luke@totalwelding.com.au"];
// Shown on the calendar before anyone is let in.
window.DEFAULT_CREW = ["Luke", "Hudson", "Jake"];
// Google Drive photo store (Apps Script web app from drive-photos.gs). Blank = keep photos in Firestore.
window.PHOTO_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby_dEjH5IanbgBPak17gisdfGKfhVJQ5f9Arc8SNgOUbDnY4GQy1vgFupD-Q4ZfFEJp0w/exec";
