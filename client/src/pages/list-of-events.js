import React, { useEffect, useState } from 'react';

const ListOfEvents = () => {
    const [events, setEvents] = useState([]);
    const gapi = typeof window !== 'undefined' ? window.gapi : null;
    // console.log("events", events)

    const [eventDetails, setEventDetails] = useState({
        summary: '',
        location: '',
        description: '',
        startDateTime: '',
        endDateTime: '',
        attendees: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Convert date and time string to the format expected by datetime-local input
        let formattedValue = value;
        if (name === 'startDateTime' || name === 'endDateTime') {
            const date = new Date(value);
            const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)); // Subtract timezone offset
            const isoString = adjustedDate.toISOString();
            formattedValue = isoString.slice(0, 16); // Keep only YYYY-MM-DDTHH:MM part
        }
    
        setEventDetails(prevState => ({
            ...prevState,
            [name]: formattedValue
        }));
    };
    
    
    useEffect(() => {
        const listUpcomingEvents = async () => {
            try {
                const request = {
                    'calendarId': 'primary',
                    'timeMin': (new Date()).toISOString(),
                    'showDeleted': false,
                    'singleEvents': true,
                    'maxResults': 10,
                    'orderBy': 'startTime',
                };
                const response = await gapi.client.calendar.events.list(request);
                console.log("events", response)
                const events = response.result.items || [];
                setEvents(events);
            } catch (err) {
                console.error('Error fetching events:', err.message);
                
            }
        };

        listUpcomingEvents();
    }, []);

    // function addManualEvent(){
    //     var event = {
    //       'kind': 'calendar#event',
    //       'summary': 'Test event fron web',
    //       'location': 'Bhopal',
    //       'description': 'Paty time',
    //       'start': {
    //         'dateTime': '2024-02-27T0:05:00.000Z',
    //         'timeZone': 'UTC'
    //       },
    //       'end': {
    //         'dateTime': '2024-02-27T01:45:00.000Z',
    //         'timeZone': 'UTC'
    //       },
    //       'recurrence': [
    //         'RRULE:FREQ=DAILY;COUNT=1'
    //       ],
    //       'attendees': [
    //         {'email': 'rohitrahorebanda123@gmail.com','responseStatus':'needsAction'},
    //       ],
    //       'reminders': {
    //         'useDefault': true,
    //       },
    //       "guestsCanSeeOtherGuests": true,
    //     }
    
    //       var request = gapi.client.calendar.events.insert({'calendarId': 'primary','resource': event,'sendUpdates': 'all'});
    //       request.execute((event)=>{
    //           console.log(event)
    //           window.open(event.htmlLink, '_blank')
    //       },(error)=>{
    //         console.error(error);
    //       });
    //   }

    const addManualEvent = async () => {
        // Basic validation
        if (!eventDetails.summary || !eventDetails.startDateTime || !eventDetails.endDateTime) {
            alert("Summary, start date, and end date are required fields.");
            return;
        }
    
        // Validate date and time format for start and end dates
        const startDate = new Date(eventDetails.startDateTime);
        const endDate = new Date(eventDetails.endDateTime);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.error("Invalid date or time format.");
            alert("Invalid date or time format.");
            return;
        }
    
        // Ensure end date is after start date
        if (startDate >= endDate) {
            alert("End date must be after start date.");
            return;
        }
    
        // Format dates as strings in ISO 8601 format
        const isoStartDate = startDate.toISOString();
        const isoEndDate = endDate.toISOString();
    
        // Split attendees by comma and trim whitespace
        const attendeeEmails = eventDetails.attendees.split(',').map(email => email.trim());
    
        // Call the function with dynamic data
        const eventToAdd = {
            ...eventDetails,
            start: {
                dateTime: isoStartDate,
                timeZone: 'UTC' // Update the timeZone if needed
            },
            end: {
                dateTime: isoEndDate,
                timeZone: 'UTC' // Update the timeZone if needed
            },
            attendees: attendeeEmails,
            kind: 'calendar#event',
            recurrence: [
                'RRULE:FREQ=DAILY;COUNT=1'
            ],
            reminders: {
                'useDefault': true,
            },
            guestsCanSeeOtherGuests: true,
        };
    
        try {
            // Add event using Google Calendar API
            const response = await gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': eventToAdd,
                'sendUpdates': 'all'
            });
    
            console.log("Event added successfully:", response);
    
            // Optionally, you can do something with the response, like open a link to the event
            window.open(response.result.htmlLink, '_blank');
        } catch (error) {
            console.error("Error adding event:", error);
            alert("Error adding event. Please try again.");
        }
    };
    
    
    return (
        <div className=' flex items-center flex-col justify-center mx-auto mt-10'>
            {/* <h2>Events:</h2> */}
            <div className=' flex flex-wrap gap-4 items-center justify-center '>
                <input
                    type='text'
                    name='summary'
                    placeholder='Summary'
                    value={eventDetails.summary}
                    onChange={handleChange}
                    className='outline-none border-2 border-gray-400 rounded-md p-2 shadow-md '
                />
                <input
                    type='text'
                    name='location'
                    placeholder='Location'
                    value={eventDetails.location}
                    onChange={handleChange}
                    className='outline-none border-2 border-gray-400 rounded-md p-2 shadow-md '
                />
                <input
                    type='text'
                    name='description'
                    placeholder='Description'
                    value={eventDetails.description}
                    onChange={handleChange}
                    className='outline-none border-2 border-gray-400 rounded-md p-2 shadow-md '
                />
                <input
                    type='datetime-local'
                    name='startDateTime'
                    placeholder='Start Date and Time'
                    value={eventDetails.startDateTime}
                    onChange={handleChange}
                    className='outline-none border-2 border-gray-400 rounded-md p-2 shadow-md '
                />
                <input
                    type='datetime-local'
                    name='endDateTime'
                    placeholder='End Date and Time'
                    value={eventDetails.endDateTime}
                    onChange={handleChange}
                    className='outline-none border-2 border-gray-400 rounded-md p-2 shadow-md '
                />
                <input
                    type='text'
                    name='attendees'
                    placeholder='Attendees (comma-separated emails)'
                    value={eventDetails.attendees}
                    onChange={handleChange}
                    className='outline-none border-2 border-gray-400 rounded-md p-2 shadow-md '
                />
           
            <button id='add_manual_event' className=' bg-yellow-300 py-2  px-5 rounded-md shadow-md'  onClick={addManualEvent}>Add Event</button>
            </div>
          <div className=' flex  items-center justify-center mx-auto mt-5'>
          <ul>
                {events.length === 0  && ( <div> there is not events</div>)}
                {events.map((event, index) => (
                    <li key={index}>
                        {event.summary} ({event.start.dateTime || event.start.date})
                    </li>
                ))}
            </ul>
          </div>
        </div>
    );
};

export default ListOfEvents;
