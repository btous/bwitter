import firebase from "firebase/app";
import "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const firebaseConfig = {
  apiKey: "AIzaSyBQrT4EKat3WqXQSUB9P8FDduuo-xUJbqQ",
  authDomain: "bwitter-5b239.firebaseapp.com",
  projectId: "bwitter-5b239",
  storageBucket: "bwitter-5b239.appspot.com",
  messagingSenderId: "423140666537",
  appId: "1:423140666537:web:6b79d907ed6aba1c884db8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();

export default db;