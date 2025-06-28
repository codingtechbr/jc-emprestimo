// js/firebase.js

// Inicializa Firebase sem usar document.write
const firebaseConfig = {
  apiKey: "AIzaSyBWbV61dyDBuMkpde2O4RnbcZNkJptso-A",
  authDomain: "jc-emprestimo.firebaseapp.com",
  projectId: "jc-emprestimo",
  storageBucket: "jc-emprestimo.appspot.com",
  messagingSenderId: "883401573812",
  appId: "1:883401573812:web:b791e0536e217893e51ee1",
  measurementId: "G-8S7NBRKR7J"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

window.db = db;
window.auth = auth;
