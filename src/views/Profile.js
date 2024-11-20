import React from 'react';
import { Container, Row, Col, NavLink } from 'reactstrap';
import Highlight from '../components/Highlight';
import Loading from '../components/Loading';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { getConfig } from '../config';

const getLink = () => {
   const config = getConfig();

   const juristicParams = new URLSearchParams({
      client_id: config.juristic.api.client_id,
      redirect_uri: config.juristic.api.redirect_uri,
      response_type: config.juristic.api.response_type,
      connection: config.juristic.connection,
      scope: config.juristic.api.scope,
      audience: config.juristic.api.audience,
   }).toString();

   return `${config.juristic.api.base_url}/oauth/authorize?${juristicParams}`;
};

export const ProfileComponent = () => {
   const { user } = useAuth0();

   return (
      <Container className="mb-5">
         <Row className="align-items-center profile-header mb-5 text-center text-md-left">
            <Col md={2}>
               <img
                  src={user.picture}
                  alt="Profile"
                  className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
               />
            </Col>
            <Col md>
               <h2>{user.name}</h2>
               <p className="lead text-muted">{user.email}</p>
            </Col>
         </Row>
         <Row>
            <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
         </Row>
         <Row>
            <NavLink href={getLink()}>Login to Juristic</NavLink>
         </Row>
      </Container>
   );
};

export default withAuthenticationRequired(ProfileComponent, {
   onRedirecting: () => <Loading />,
});
