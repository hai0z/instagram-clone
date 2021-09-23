import { firebase } from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";
import "@firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyDzXj6_WdNjaAywLetqce9Hbhk1vP72lIc",
  authDomain: "insta-clone-a9569.firebaseapp.com",
  projectId: "insta-clone-a9569",
  storageBucket: "insta-clone-a9569.appspot.com",
  messagingSenderId: "556033583713",
  appId: "1:556033583713:web:c84d0c15a9fc46201e1820",
  measurementId: "G-S2Y5GQZ1FL",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// auth.useEmulator("http://192.168.1.10:9099");

// if (window.hostname === "localhost") {
//   db.useEmulator("localhost", 8080);
// }
// storage.useEmulator("localhost", 9199);

export { db, auth, storage };

export default firebaseApp;
