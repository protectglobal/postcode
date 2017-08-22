import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
// import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/kadira:flow-router';
import _ from 'underscore';
import Constants from '../../api/constants.js';
import Users from '../../api/users/namespace.js';
import LoadingPage from '../pages/loading-page.jsx';
import WelcomePageContainer from '../pages/welcome-page.jsx';
import ConfirmEmailPageContainer from '../pages/confirm-email/confirm-email-page.jsx';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
/**
* @summary Second top-most component acting as a general controller for the whole app.
* It takes care of global subscriptions (displaying a loading indicator when
* global subscriptions aren't ready) + handles authentication and roles.
* @see {@link https://themeteorchef.com/snippets/authentication-with-react-and-flow-router/}
*/
const App = (props) => {
  const { content, meteorData } = props;
  const {
    subsReady,
    loggingIn,
    loggedIn,
    accountVerified,
    curRoute,
    hasRoleForRoute,
    isAuthRoute,
  } = meteorData;

  // Handle loading indicator
  if (!subsReady || loggingIn) return <LoadingPage />;

  if (isAuthRoute) {
    // In case user is logged in, and has the proper role for the page she is
    // trying to access, render the requested page
    if (loggedIn && accountVerified && hasRoleForRoute) {
      return content();
    }

    // Allow logged in user to access home page even if account is not verified
    /* if (loggedIn && !accountVerified && hasRoleForRoute && (curRoute === 'home' || curRoute === 'confirm-email')) {
      return content();
    } */

    // In case the user has the proper role but the account is not yet verified
    // render confirm email page
    if (loggedIn && !accountVerified && hasRoleForRoute) {
      // TODO: force update every time curRoute changes.
      return <ConfirmEmailPageContainer />;
    }

    // User doesn't have the proper role
    if (!hasRoleForRoute) {
      return <WelcomePageContainer />;
    }

    console.log('unknown option at AppContainer component');
    return <WelcomePageContainer />;
  }

  // In any other situation, render the requested content (login, signup, forgot
  // and reset password pages)
  return content();
};

App.propTypes = {
  content: PropTypes.func.isRequired, // component to be displayed, ex. <FeedPageContainer />
  meteorData: PropTypes.shape({
    loggingIn: PropTypes.bool.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    subsReady: PropTypes.bool.isRequired,
    accountVerified: PropTypes.bool.isRequired,
    curRoute: PropTypes.string, // could be undefined
    hasRoleForRoute: PropTypes.bool.isRequired,
    isAuthRoute: PropTypes.bool.isRequired,
  }).isRequired,
};
//------------------------------------------------------------------------------
// PAGE CONTAINER DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'Page' component to handle Meteor reactivity
* (component-level subscriptions etc etc), and pass data down to 'Page'
* component. Warning, LocalState.set() can't be used here!
*/
const AppContainer = createContainer(({ content }) => {
  const curUserId = Meteor.userId();
  const curUser = Meteor.user();
  const loggedIn = !!curUser;
  const curRoute = FlowRouter.current().route.name;

  // Global subsriptions (if any)
  const handles = [
    Meteor.subscribe('Users.publications.curUser'),
  ];

  // Are all subsriptions ready?
  const subsReady = _.every(handles, handle => handle.ready()); // bool

  // Logout the current user in case her account is deactivated while logged in
  if (subsReady && curUser && curUser.accountDeactivated
      && curUser.accountDeactivated === true) {
    Meteor.logout();
  }

  const userRole = loggedIn && curUser.roles && curUser.roles[0]; // 'normal', 'editor', 'styleEditor' 'admin'

  // Populate App component props
  return {
    content,
    meteorData: {
      loggingIn: !!Meteor.loggingIn(),
      loggedIn,
      subsReady,
      accountVerified: Users.apiBoth.isAccountVerified(curUserId),
      curRoute,
      hasRoleForRoute: !!userRole && Constants.ALL_ROLES.indexOf(userRole) > -1
        && Constants[`${userRole.toUpperCase()}_USER_ROUTES`].indexOf(curRoute) > -1,
      isAuthRoute: Constants.AUTH_ROUTES.indexOf(curRoute) > -1,
    },
  };
}, App);

export default AppContainer;
