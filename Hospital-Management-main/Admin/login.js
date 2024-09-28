// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
// import {
//   getDatabase,
//   set,
//   ref,
// } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
// import {
//   getAuth,
//   signInWithEmailAndPassword,
// } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// // Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyC_RCts7ILiP_wqiglfOFwADid2rYAC-Sk",
//   authDomain: "ambul-driver.firebaseapp.com",
//   databaseURL: "https://ambul-driver-default-rtdb.firebaseio.com",
//   projectId: "ambul-driver",
//   storageBucket: "ambul-driver.appspot.com",
//   messagingSenderId: "1061302559097",
//   appId: "1:1061302559097:web:1c70fda02553f5a7e20fa8",
//   measurementId: "G-EYYE2KZKN3",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firebase Authentication
// const auth = getAuth(app);

// // Handle form submission
// const submit = document.getElementById("submit");
// submit.addEventListener("click", (e) => {
//   e.preventDefault();

//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;

//   signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       // Signed in successfully
//       alert("Login successful");
//       // Redirect to the admin page
//       window.location.href = "index.html";
//     })
//     .catch((error) => {
//       // Handle errors here
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       alert(`Error: ${errorMessage} (Code: ${errorCode})`);
//     });
// });

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_RCts7ILiP_wqiglfOFwADid2rYAC-Sk",
  authDomain: "ambul-driver.firebaseapp.com",
  databaseURL: "https://ambul-driver-default-rtdb.firebaseio.com",
  projectId: "ambul-driver",
  storageBucket: "ambul-driver.appspot.com",
  messagingSenderId: "1061302559097",
  appId: "1:1061302559097:web:1c70fda02553f5a7e20fa8",
  measurementId: "G-EYYE2KZKN3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Handle form submission
const submit = document.getElementById("submit");
submit.addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      return signInWithEmailAndPassword(auth, email, password);
    })
    .then((userCredential) => {
      // Signed in successfully
      console.log("Login successful, redirecting...");
      alert("Login successful");
      window.location.href = "index.html";
    })
    .catch((error) => {
      // Handle errors here
      alert(`Error: ${error.message} (Code: ${error.code})`);
    });
});
