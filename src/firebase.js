// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNl49TabM-IpthIH59mtauJViiGiNmEAY",
  authDomain: "netflix-clone-august.firebaseapp.com",
  projectId: "netflix-clone-august",
  storageBucket: "netflix-clone-august.appspot.com",
  messagingSenderId: "321104694091",
  appId: "1:321104694091:web:7d72a6ddaff45f7126b6ce"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export {auth}
export default db;