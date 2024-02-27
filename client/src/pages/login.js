import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

const LoginWithGoogle = () => {
  const router = useRouter()
  
  const gapi = typeof window !== 'undefined' ?window.gapi : null;
  
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  let gapiInited = false, gisInited = false, tokenClient;
  const SCOPES = "https://www.googleapis.com/auth/calendar";

  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const expiresIn = typeof window !== 'undefined' ? localStorage.getItem('expires_in') : null;

  function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
  }

  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: process.env.NEXT_PUBLIC_API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;

    // if (accessToken && expiresIn) {
    //   gapi.client.setToken({
    //     access_token: accessToken,
    //     expires_in: expiresIn,
    //   });
    //   listUpcomingEvents();
    // }
  }

  
  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      scope: SCOPES,
      callback: '', // defined later
    });

    gisInited = true;
  }

  useEffect(() => {
    //const expiryTime = new Date().getTime() + expiresIn * 1000;
    gapiLoaded()
    gisLoaded()
  }, [])

  function handleAuthClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error) {
        throw (resp);
      }
    //   await listUpcomingEvents();
      const { access_token, expires_in } = gapi.client.getToken();
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('expires_in', expires_in)
      router.push("/list-of-events")
    };

    if (!(accessToken && expiresIn)) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({ prompt: '' });
    }
  }
  return (
    <div className=' flex
     justify-center items-center mx-auto mt-10'>
        <button id="authorize_button" onClick={handleAuthClick} className=' flex gap-2 py-2 px-5 justify-center items-center rounded-md bg-gray-100'>
            <img src='/google.png' height={20} width={20} className=' rounded-full' />
            <span>Authorize</span>
        </button>
    </div>
  )
}

export default LoginWithGoogle