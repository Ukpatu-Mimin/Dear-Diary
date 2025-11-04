// import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
// import { getAuth, browserLocalPersistence, browserSessionPersistence } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

// const firebaseConfig = {
// Replace with your Firebase project config
//     apiKey: "YOUR_API_KEY",
//     authDomain: "YOUR_PROJECT.firebaseapp.com",
//     projectId: "YOUR_PROJECT_ID",
//     storageBucket: "YOUR_PROJECT.appspot.com",
//     messagingSenderId: "YOUR_SENDER_ID",
//     appId: "YOUR_APP_ID"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// export { auth, browserLocalPersistence, browserSessionPersistence };

// for to - do page

// part 2
// import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
// import { getAuth, browserLocalPersistence, browserSessionPersistence } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
// import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

// const firebaseConfig = {
// Replace with your Firebase project config
//     apiKey: "YOUR_API_KEY",
//     authDomain: "YOUR_PROJECT.firebaseapp.com",
//     projectId: "YOUR_PROJECT_ID",
//     storageBucket: "YOUR_PROJECT.appspot.com",
//     messagingSenderId: "YOUR_SENDER_ID",
//     appId: "YOUR_APP_ID"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// export { auth, db, browserLocalPersistence, browserSessionPersistence, collection, addDoc, getDocs, updateDoc, doc };

// firebase.js
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
// import { getAuth, browserLocalPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// const firebaseConfig = {
//     apiKey: "YOUR_API_KEY",
//     authDomain: "YOUR_PROJECT.firebaseapp.com",
//     projectId: "YOUR_PROJECT",
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export { browserLocalPersistence, browserSessionPersistence };

// part 3
// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// === AUTO-ENABLE PERSISTENCE ON APP START ===
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence enabled: stays logged in across refreshes");
  })
  .catch((error) => {
    console.error("Persistence failed:", error);
  });

export { browserLocalPersistence };
