'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { useSearchParams } from 'next/navigation'

// eslint-disable-next-line @next/next/no-async-client-component
export default function Home() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    handleAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setToken(token);

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) setAccessToken(accessToken);

    const athleteId = localStorage.getItem('athleteId');
    if (athleteId) setId(athleteId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, accessToken, id])

  const handleAuth = async () => {
    const code = searchParams.get('code')
  
    if (code) {
      const resp = await fetch('/api/connect', {
        method: 'POST',
        body: JSON.stringify({ code }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await resp.json();
      
      if (data && data.data && data.data.token && data.data.accessToken) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('accessToken', data.data.accessToken);

        setToken(data.data.token)
        setAccessToken(data.data.accessToken)
      }      

      if (data && data.data && data.data.athlete) {
        localStorage.setItem('athleteId', data.data.athlete.id);

        setId(data.data.athlete.id)
      }
    }
  }

  const handleDisconnect = async () => {
    const token = localStorage.getItem('token');
    const accessToken = localStorage.getItem('accessToken');

    if (token && accessToken) {
      const resp = await fetch('/api/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Access-Token': accessToken
        },
      });

      const data = await resp.json();
      
      if (data && data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('athleteId');
        
        setToken('')
        setAccessToken('')
        setId('')
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24" style={{ justifyContent: 'center' }}>
      <div style={{ marginBottom: '10px' }}>
      <Image
          src="/images/strava-logo.png"
          alt="Strava Logo"
          width={100}
          height={100}
          style={{ borderRadius: '10px'}}
        />
        </div>
      <h1 className="text-xl font-semibold" style={{ marginBottom: '15px', color: '#535353' }}>Strava</h1>
      { token && accessToken && (
        <a href={`https://www.strava.com/athletes/${id}`} target='_blank' style={{ marginBottom: '15px', color: 'rgb(103 160 255)' }}>{`https://www.strava.com/athletes/${id}`}</a>
      )}
    
      {
        token && accessToken ? (
          <button onClick={() => handleDisconnect()} className="bg-white hover:bg-white border-orange text-btn-orange font-bold py-2 px-4 rounded-btn-full" style={{ width: '100%' }}>Disconnect</button>
        ) : (
          <a href={`http://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${process.env.HOST}&approval_prompt=force&scope=read,activity:read`} style={{ width: '100%' }}>
            <button className="bg-orange hover:bg-orange border-orange text-btn-white font-bold py-2 px-4 rounded-btn-full" style={{ width: '100%' }}>Connect</button>
          </a>
        )
      }
    </main>
  );
}
