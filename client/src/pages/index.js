import { useEffect, useState } from 'react';
import { getCalendarEvents, initFirebase, insertCalendarEvent, signInWithGoogle, signOut } from '@/utils/firebase';
// import { getCalendarEvents, insertCalendarEvent } from '@/utils/calendar';

export default function Home() {
    const [user, setUser] = useState(null);
    const [calendarItems, setCalendarItems] = useState([]);

    useEffect(() => {
        initFirebase(setUser);
    }, []);

    const handleLogin = async () => {
      const result = await signInWithGoogle();
      setUser(result?.user);
  };
  

    const handleLogout = async () => {
        await signOut();
    };

    const handleGetCalendar = async () => {
        const events = await getCalendarEvents();
        setCalendarItems(events);
    };

    const handleInsertEvent = async () => {
        await insertCalendarEvent();
        await handleGetCalendar();
    };

    return (
        <div className=' flex items-center justify-center mx-auto mt-5 flex-col'>
            {user ? (
                <>
                    <h3 className=' text-white bg-rose-500 rounded-md p-2 shadow-md font-semibold'>Logged in as  {user.displayName}</h3>
                    <img src={user.photoURL} alt="User Photo" width="50px" className=' mt-3 rounded-full'/>
                    <button onClick={handleLogout} className=' border rounded-md font-semibold py-1.5 px-5 mt-3'>Logout</button>
                    <hr />
                    <button onClick={handleGetCalendar}>Get Google Calendar</button>
                    <button onClick={handleInsertEvent}>Add Event</button>
                    <div>
                        {calendarItems.map(item => (
                            <div key={item.id}>
                                <h3>{item.summary} - {item.status}</h3>
                                <p><em>Created {item.created}</em></p>
                                <p>{item.description}</p>
                                <hr />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <button onClick={handleLogin}>Login with Google</button>
            )}
        </div>
    );
}
