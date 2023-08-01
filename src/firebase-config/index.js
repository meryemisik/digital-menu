const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, addDoc } = require('firebase/firestore');
const { getAuth, listUsers } = require('firebase/auth');
const firebaseConfig = {
  apiKey: "AIzaSyBFa9GSGLQ-ATi73sshUlDeTlDNbYAJVR0",
  authDomain: "digital-menu-c938c.firebaseapp.com",
  projectId: "digital-menu-c938c",
  storageBucket: "digital-menu-c938c.appspot.com",
  messagingSenderId: "564964294481",
  appId: "1:564964294481:web:55f00960d592b710b21d70",
  measurementId: "G-B0VG2TS7BN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
 db, collection, getDocs, addDoc, getFirestore, getAuth, listUsers
}

