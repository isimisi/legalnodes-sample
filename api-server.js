const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { auth } = require('express-oauth2-jwt-bearer');
const authConfig = require('./src/auth_config.json');

const app = express();

const port = process.env.API_PORT || 3001;
const appPort = process.env.SERVER_PORT || 3000;
const appOrigin = authConfig.appOrigin || `http://localhost:${appPort}`;

if (
   !authConfig.domain ||
   !authConfig.audience ||
   authConfig.audience === 'YOUR_API_IDENTIFIER'
) {
   console.log(
      'Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values'
   );

   process.exit();
}

app.use(morgan('dev'));
app.use(helmet());
app.use(cors({ origin: appOrigin }));

const verifier = auth({
   audience: authConfig.audience,
   issuerBaseURL: `https://${authConfig.domain}/`,
   algorithms: ['RS256'],
});

app.get('/api/external', verifier, (_, res) => {
   res.send({
      msg: 'Your access token was successfully validated!',
   });
});

app.get('/', (_, res) => {
   res.send('Server is running');
});

app.get('/logo', (_, res) => res.sendFile('~/Documents/logo.png'));

app.get('/api/sso/user', verifier, async (req, res) => {
   const userId = req.auth.payload.sub;
   // custom added in auth0
   const email = req.auth.payload.email;

   if (!userId) {
      res.status(404).send('no user');
      return;
   }

   const profile = {
      user_id: userId,
      email,
      first_name: 'John',
      last_name: 'Doe',
      user_type: 'admin',
      initials: 'JD',
   };

   res.status(200).json(profile);
});

app.listen(port, () => console.log(`API Server listening on port ${port}`));
