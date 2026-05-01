import React, { useEffect } from 'react';

function OAuthCallback() {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    const codeVerifier = sessionStorage.getItem('code_verifier');

    if (code && codeVerifier) {
      fetch('http://localhost:5000/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, code_verifier: codeVerifier })
      })
        .then(res => res.json())
        .then(data => {
          if (data.access_token) {
            sessionStorage.setItem('sf_access_token', data.access_token);
            sessionStorage.setItem('sf_instance_url', data.instance_url);
            window.location.href = '/dashboard';
          } else {
            console.error('Token error:', data);
          }
        })
        .catch(err => console.error('Error:', err));
    }
  }, []);

  return (
    <div className="App">
      <h1>Logging in... Please wait!</h1>
    </div>
  );
}

export default OAuthCallback;