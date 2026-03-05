import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCL9YojgLFGoDHnmw0IAh_rq0CRFlPzRF8",
    authDomain: "schaefer-cfd6c.firebaseapp.com",
    projectId: "schaefer-cfd6c",
    storageBucket: "schaefer-cfd6c.firebasestorage.app",
    messagingSenderId: "325708779166",
    appId: "1:325708779166:web:766298cfae8289895e758f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
