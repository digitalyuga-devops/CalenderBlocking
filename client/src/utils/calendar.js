import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export const getCalendarEvents = async () => {
    const db = firebase.firestore();
    const user = firebase.auth().currentUser;
    if (!user) {
        return [];
    }

    const eventsRef = db.collection('users').doc(user.uid).collection('events');
    const snapshot = await eventsRef.get();
    return snapshot.docs.map(doc => doc.data());
};

export const insertCalendarEvent = async () => {
    const db = firebase.firestore();
    const user = firebase.auth().currentUser;
    if (!user) {
        return;
    }

    await db.collection('users').doc(user.uid).collection('events').add({
        summary: 'New Event',
        description: 'Description of the new event',
        start: new Date(),
        end: new Date()
    });
};
