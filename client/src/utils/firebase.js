// utils/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, doc, getDocs, addDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};

let firebaseInitialized = false;
let app = null;

export const initFirebase = () => {
    if (!firebaseInitialized) {
        app = initializeApp(firebaseConfig);
        firebaseInitialized = true;
    }
};

export const signInWithGoogle = async () => {
    initFirebase();
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    return getRedirectResult(auth);
};

export const signOut = async () => {
    initFirebase();
    const auth = getAuth(app);
    await auth.signOut();
};

export const getCalendarEvents = async () => {
    initFirebase();
    const db = getFirestore(app);
    const user = getAuth(app).currentUser;
    if (!user) {
        return [];
    }

    const eventsRef = collection(db, 'users', user.uid, 'events');
    const snapshot = await getDocs(eventsRef);
    return snapshot.docs.map(doc => doc.data());
};

export const insertCalendarEvent = async () => {
    initFirebase();
    const db = getFirestore(app);
    const user = getAuth(app).currentUser;
    if (!user) {
        return;
    }

    await addDoc(collection(db, 'users', user.uid, 'events'), {
        summary: 'New Event',
        description: 'Description of the new event',
        start: new Date(),
        end: new Date()
    });
};

export default app;
