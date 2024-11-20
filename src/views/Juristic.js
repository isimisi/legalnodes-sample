import React from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import Loading from '../components/Loading';

function Juristic() {
   console.debug('hash', document.location.hash);
   useAuth0();

   return (
      <div>
         <iframe
            title="juristic"
            src="https://staging.juristic.io/"
            height="500px"
            width="100%"
         />
      </div>
   );
}

export default withAuthenticationRequired(Juristic, {
   onRedirecting: () => <Loading />,
});
