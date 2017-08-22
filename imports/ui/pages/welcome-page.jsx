import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import DefaultLayout from '../layouts/default/default-layout.jsx';

//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'Page' logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
const WelcomePage = ({ meteorData }) => (
  <DefaultLayout width="600px" padding="20px 15px 0" centered>
    <h1 className="center">Welcome!</h1>
    {meteorData.loggedIn ? (
      <p className="center"><a href="/home">Home</a></p>
    ) : (
      <p className="center"><a href="/login">Login</a> | <a href="/signup">Signup</a></p>
    )}
  </DefaultLayout>
);

WelcomePage.propTypes = {
  meteorData: PropTypes.shape({
    loggedIn: PropTypes.bool.isRequired,
  }).isRequired,
};
//------------------------------------------------------------------------------
// PAGE CONTAINER DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'Page' component to handle Domain State Meteor
* reactivity (component-level subscriptions etc etc), and pass data down to
* 'Page' component.
*/
const WelcomePageContainer = createContainer(() => {
  return {
    meteorData: {
      loggedIn: !!Meteor.user(),
    },
  };
}, WelcomePage);

export default WelcomePageContainer;
