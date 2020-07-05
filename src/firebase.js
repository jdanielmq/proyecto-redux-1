import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyDSiiXifOVtENYv86X6hRhucLZdASKlI_E",
    authDomain: "crud-udemy-react-29db5.firebaseapp.com",
    databaseURL: "https://crud-udemy-react-29db5.firebaseio.com",
    projectId: "crud-udemy-react-29db5",
    storageBucket: "crud-udemy-react-29db5.appspot.com",
    messagingSenderId: "162787955192",
    appId: "1:162787955192:web:9b4aa870f22506f6c7060d"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth()

  const db = firebase.firestore()

  const storage = firebase.storage()

  export {auth, firebase, db, storage}