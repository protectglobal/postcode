import React, { Component, PropTypes } from 'react';
// import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
// import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';
// import _ from 'underscore';
// import Actions from '../../../api/redux/client/actions.js';
import Constants from '../../../api/constants.js';
// import AuxFunctions from '../../../api/aux-functions.js';
import Users from '../../../api/users/namespace.js';
import Installers from '../../../api/installers/namespace.js';
import InstallersView from './installers-view.jsx';
import LoadingPage from '../loading-page.jsx';

//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'Page' logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
class InstallersPage extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
  }

  render() {
    const { meteorData } = this.props;

    return (
      <InstallersView
        // pass data down
        // reduxState={reduxState}
        meteorData={meteorData}
        // pass methods down
        // handleRoleChange={this.handleRoleChange}
        // handleDeactivate={this.handleDeactivate}
      />
    );
  }
}

InstallersPage.propTypes = {
  meteorData: PropTypes.shape({
    curUserId: PropTypes.string,
    installersReady: PropTypes.bool.isRequired,
    installers: PropTypes.array.isRequired,
  }).isRequired,
};

InstallersPage.defaultProps = {
  meteorData: {
    curUserId: '',
    installersReady: false,
    installers: [],
  },
};
//------------------------------------------------------------------------------
// PAGE CONTAINER DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'Page' component to handle Domain State Meteor
* reactivity (component-level subscriptions etc etc), and pass data down to
* 'Page' component.
*/
const InstallersPageContainer = createContainer(() => {
  // Get current user
  const curUserId = Meteor.userId();

  // Make sure the user is logged in!
  if (!curUserId) {
    FlowRouter.go('login');
    return {};
  }

  // Is the account verified?
  if (!Users.apiBoth.isAccountVerified(curUserId)) {
    // FlowRouter.go('confirmEmail');
    FlowRouter.go('login');
    return {};
  }

  // Check user role
  if (!Roles.userIsInRole(curUserId, Constants.INSTALLERS_PAGE_ROLES)) {
    FlowRouter.go('login');
    return {};
  }

  // Subscribe to all installers data
  const subs = Meteor.subscribe('Installers.publications.getAllInstallers');

  // Format data to be displayed in table, plus add fallback.
  const installers = Installers.collection.find({}, { sort: { createdAt: -1 } }).map((installer) => {
    const {
      _id,
      logo,
      companyName,
      addressOne,
      addressTwo,
      postalCode,
      city,
      phoneNumber,
      email,
      postalAreas,
    } = installer;

    return {
      _id,
      key: _id, // required by antd table
      logo: logo || '',
      companyName: companyName || '',
      addressOne: addressOne || '',
      addressTwo: addressTwo || '',
      postalCode: postalCode || '',
      city: city || '',
      phoneNumber: phoneNumber || '',
      email: email || '',
      postalAreas: postalAreas || [],
    };
  });

  return {
    meteorData: {
      curUserId,
      installersReady: subs.ready(),
      installers,
    },
  };
}, InstallersPage);

export default InstallersPageContainer;
