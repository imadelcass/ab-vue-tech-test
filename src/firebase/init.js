// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  addDoc,
  query,
  where
} from 'firebase/firestore'
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  deleteObject,
  uploadBytes
} from 'firebase/storage'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateCurrentUser,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
  signOut
} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCjNgdRpDzHe6q1PB4AexWMFVEBWpWK-L4',
  authDomain: 'clone-12b84.firebaseapp.com',
  databaseURL: 'https://clone-12b84-default-rtdb.firebaseio.com',
  projectId: 'clone-12b84',
  storageBucket: 'clone-12b84.appspot.com',
  messagingSenderId: '748932968251',
  appId: '1:748932968251:web:a5ca005a44b3c86301d11e'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
const db = getFirestore()

// Initialize Storage
const storage = getStorage()

// Auth
const auth = getAuth()

export {
  db,
  storage,
  storageRef,
  uploadBytes,
  deleteObject,
  collection,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  addDoc,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getDownloadURL,
  updateCurrentUser,
  updateProfile,
  sendEmailVerification,
  query,
  where,
  onAuthStateChanged,
  signOut
}
