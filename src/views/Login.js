import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import Highlight from '../components/Highlight';
import { getConfig } from '../config';

const OAuthCallback = () => {
   const [accessToken, setAccessToken] = useState(null);

   const [state, setState] = useState({
      showResult: false,
      apiMessage: '',
      error: null,
   });

   useEffect(() => {
      // Step 1: Parse the authorization code from the URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
         // Step 2: Exchange the authorization code for an access token
         exchangeCodeForToken(code);
      }
   }, []);

   const exchangeCodeForToken = async (code) => {
      const config = getConfig();

      try {
         // Replace with your backend endpoint to exchange code for token
         const response = await fetch(
            `${config.juristic.api.base_url}/oauth/token`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
               },
               body: new URLSearchParams({
                  code: code,
                  grant_type: 'authorization_code',
                  redirect_uri: config.juristic.api.redirect_uri,
                  client_id: config.juristic.api.client_id, // Your client ID
                  client_secret: config.juristic.api.client_secret, // Your client secret
               }),
            }
         );

         if (response.ok) {
            const data = await response.json();
            // Step 3: Store the access token
            setAccessToken(data.access_token);
            window.location.hash.push(`access_token=${data.access_token}`);
         } else {
            console.error(
               'Error exchanging code for token:',
               response.statusText
            );
         }
      } catch (error) {
         console.error('Error exchanging code for token:', error);
      }
   };

   const callJuristicApi = async () => {
      const config = getConfig();
      try {
         const response = await fetch(`${config.juristic.api.base_url}/api`, {
            headers: {
               Authorization: `Bearer ${accessToken}`,
            },
         });

         const responseData = await response.json();

         setState({
            ...state,
            showResult: true,
            apiMessage: responseData,
         });
      } catch (error) {
         setState({
            ...state,
            error: error.error,
         });
      }
   };

   return (
      <div>
         {accessToken ? (
            <div>
               <Button
                  color="primary"
                  className="mt-5"
                  onClick={callJuristicApi}>
                  Ping Juristic
               </Button>

               <div className="result-block-container">
                  {state.showResult && (
                     <div className="result-block" data-testid="api-result">
                        <h6 className="muted">Result</h6>
                        <Highlight>
                           <span>
                              {JSON.stringify(state.apiMessage, null, 2)}
                           </span>
                        </Highlight>
                     </div>
                  )}
               </div>
            </div>
         ) : (
            <p>Exchanging code for access token...</p>
         )}
      </div>
   );
};

export default OAuthCallback;
