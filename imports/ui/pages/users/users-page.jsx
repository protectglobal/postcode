import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';
import Constants from '../../../api/constants.js';
import Users from '../../../api/users/namespace.js';
import UsersView from './users-view.jsx';
import LoadingPage from '../loading-page.jsx';

//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'Page' logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
class UsersPage extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleRoleChange = this.handleRoleChange.bind(this);
    this.handleDeactivate = this.handleDeactivate.bind(this);
  }

  handleRoleChange({ fieldName, value }) {
    // This method is fired when the role select input changes its value.
    const args = {
      targetUserId: fieldName,
      role: value,
    };

    Meteor.call('Users.methodsServer.setNewRole', args, (err) => {
      if (err) {
        // Display flash notification
        Bert.alert(err.reason, 'danger', 'growl-top-right');
      } else {
        // Display flash notification
        Bert.alert('Changes made successfully', 'success', 'growl-top-right');
      }
    });
  }

  handleDeactivate(targetUserId) {
    Meteor.call('Users.methodsServer.deactivateAccount', targetUserId, (err) => {
      if (err) {
        // Display flash notification
        Bert.alert(err.reason, 'danger', 'growl-top-right');
      } else {
        // Display flash notification
        Bert.alert('Account deactivated successfully', 'success', 'growl-top-right');
      }
    });
  }

  render() {
    const { meteorData } = this.props;
    const { usersReady } = meteorData;

    // Display loading indicator in case subscription isn't ready
    if (!usersReady) {
      return <LoadingPage />;
    }

    return (
      <UsersView
        // Pass data down
        meteorData={meteorData}
        // Pass methods down
        handleRoleChange={this.handleRoleChange}
        handleDeactivate={this.handleDeactivate}
      />
    );
  }
}

UsersPage.propTypes = {
  meteorData: PropTypes.shape({
    curUserId: PropTypes.string,
    usersReady: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
  }).isRequired,
};

UsersPage.defaultProps = {
  meteorData: {
    curUserId: '',
    usersReady: false,
    users: [],
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
const UsersPageContainer = createContainer(() => {
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
  if (!Roles.userIsInRole(curUserId, Constants.USERS_PAGE_ROLES)) {
    FlowRouter.go('login');
    return {};
  }

  // Subscribe to all users data
  const subs = Meteor.subscribe('Users.publications.getAllUsers');

  // Format data to be displayed in table.
  const users = Users.collection.find({}, { sort: { createdAt: -1 } }).map((user) => {
    const { _id, profile, emails, roles } = user;
    return {
      _id,
      key: _id, // required by antd component
      name: (profile && profile.name) || '',
      email: (emails && emails[0] && emails[0].address) || '',
      role: (roles && roles[0]) || '',
    };
  });

  return {
    meteorData: {
      curUserId,
      usersReady: subs.ready(),
      users,
    },
  };
}, UsersPage);

export default UsersPageContainer;
