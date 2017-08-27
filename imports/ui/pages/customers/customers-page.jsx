import React, { Component, PropTypes } from 'react';
// import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
// import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';
import moment from 'moment';
// import _ from 'underscore';
// import Actions from '../../../api/redux/client/actions.js';
import Constants from '../../../api/constants.js';
// import AuxFunctions from '../../../api/aux-functions.js';
import Users from '../../../api/users/namespace.js';
import Customers from '../../../api/customers/namespace.js';
import CustomersView from './customers-view.jsx';

//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'Page' logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
class CustomersPage extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
  }

  render() {
    const { meteorData } = this.props;

    return (
      <CustomersView
        // Pass data down
        // reduxState={reduxState}
        meteorData={meteorData}
        // Pass methods down
        // handleRoleChange={this.handleRoleChange}
        // handleDeactivate={this.handleDeactivate}
      />
    );
  }
}

CustomersPage.propTypes = {
  meteorData: PropTypes.shape({
    curUserId: PropTypes.string,
    customersReady: PropTypes.bool.isRequired,
    customers: PropTypes.array.isRequired,
  }).isRequired,
};

CustomersPage.defaultProps = {
  meteorData: {
    curUserId: '',
    customersReady: false,
    customers: [],
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
const CustomersPageContainer = createContainer(() => {
  // Get current user.
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
  if (!Roles.userIsInRole(curUserId, Constants.CUSTOMERS_PAGE_ROLES)) {
    FlowRouter.go('login');
    return {};
  }

  // Subscribe to all customers data
  const subs = Meteor.subscribe('Customers.publications.getAllCustomers');

  // Format data to be displayed in table.
  const customers = Customers.collection.find({}, { sort: { createdAt: -1 } }).map((customer) => {
    // Destructure
    const {
      _id,
      createdAt,
      name,
      postalCode,
      phoneNumber,
      email,
      installer,
      emailDeliveryStatus,
    } = customer;

    return {
      _id,
      key: _id, // required by antd component
      createdAt: (createdAt && moment.utc(createdAt).format('MMM Do YYYY, HH:mm:ss')) || '',
      name: name || '',
      postalCode: postalCode || '',
      phoneNumber: phoneNumber || '',
      email: email || '',
      installer: installer || {},
      emailDeliveryStatus: emailDeliveryStatus || '',
    };
  });

  return {
    meteorData: {
      curUserId,
      customersReady: subs.ready(),
      customers,
    },
  };
}, CustomersPage);

export default CustomersPageContainer;
