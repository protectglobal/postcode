import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';
import _ from 'underscore';
import Actions from '../../../api/redux/client/actions.js';
import Constants from '../../../api/constants.js';
// import AuxFunctions from '../../../api/aux-functions.js';
import Users from '../../../api/users/namespace.js';
import Installers from '../../../api/installers/namespace.js';
import InstallersView from './installers-view.jsx';

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
    this.handleAsigneeInstallerChange = this.handleAsigneeInstallerChange.bind(this);
    this.handleEditInstallerButtonClick = this.handleEditInstallerButtonClick.bind(this);
    this.handleDeleteInstallerButtonClick = this.handleDeleteInstallerButtonClick.bind(this);
  }

  handleAsigneeInstallerChange({ installerId, value }) {
    Meteor.call('Installers.methods.setFallbackValue', installerId, value, (err) => {
      if (err) {
        Bert.alert('The form has errors', 'danger', 'growl-top-right');
      } else {
        Bert.alert('Operation succesful!', 'success', 'growl-top-right');
      }
    });
  }

  handleEditInstallerButtonClick({ _id: installerId }) {
    // This method is fired when the edit button is clicked. It receives as an
    // argument the record that the user is trying to modify.
    const { reduxActions, meteorData } = this.props;
    const { installers } = meteorData;

    // Find the installer associated to the given installerId
    const installer = _.find(installers, ({ _id }) => (_id === installerId));

    // Fill the redux store using provided by the record and, therefore, prefil
    // the form rendered inside the edit installer modal
    const keys = _.keys(installer);
    _.each(keys, (key) => {
      if (key === 'logo') {
        reduxActions.dispatchSetObjectField(key, installer[key]);
      } else {
        reduxActions.dispatchUpdateTextField(key, installer[key]);
      }
    });

    // Open modal
    reduxActions.dispatchSetBooleanField('editInstallerModalVisible', true);
  }

  handleDeleteInstallerButtonClick(installerId) {
    // This method is fired when the delete button is clicked. It receives as an
    // argument the installer that the user wants to delete.
    const { reduxActions } = this.props;

    // Disable all delete buttons
    reduxActions.dispatchSetBooleanField('canDelete', false);

    Meteor.call('Installers.methods.removeInstaller', installerId, (err) => {
      if (err) {
        Bert.alert('The form has errors', 'danger', 'growl-top-right');
      } else {
        Bert.alert('Installer removed successfully!', 'success', 'growl-top-right');
      }
      // Re-enable submit button
      reduxActions.dispatchSetBooleanField('canDelete', true);
    });
  }

  render() {
    const { reduxState, meteorData } = this.props;

    return (
      <InstallersView
        // Pass data down
        reduxState={reduxState}
        meteorData={meteorData}
        // Pass methods down
        handleAsigneeInstallerChange={this.handleAsigneeInstallerChange}
        handleEditInstallerButtonClick={this.handleEditInstallerButtonClick}
        handleDeleteInstallerButtonClick={this.handleDeleteInstallerButtonClick}
      />
    );
  }
}

InstallersPage.propTypes = {
  reduxState: PropTypes.shape({
    addInstallerModalVisible: PropTypes.bool.isRequired,
    editInstallerModalVisible: PropTypes.bool.isRequired,
  }).isRequired,
  reduxActions: PropTypes.object.isRequired,
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
// REDUX INTEGRATION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'Page' component to handle Domain State Meteor
* reactivity (component-level subscriptions etc etc), and pass data down to
* 'Page' component.
*/
const namespace = 'installers';

function mapStateToProps(state) {
  return { reduxState: state[namespace] };
}

function mapDispatchToProps(dispatch) {
  // Bind actions to current namespace.
  const reduxActions = {
    dispatchUpdateTextField(fieldName, value) {
      return dispatch(Actions.updateTextField(namespace, fieldName, value));
    },
    dispatchSetBooleanField(fieldName, value) {
      return dispatch(Actions.setBooleanField(namespace, fieldName, value));
    },
    dispatchSetArrayField(fieldName, value) {
      return dispatch(Actions.setArrayField(namespace, fieldName, value));
    },
    dispatchClearArrayField(fieldName) {
      return dispatch(Actions.clearArrayField(namespace, fieldName));
    },
    dispatchSetObjectField(fieldName, value) {
      return dispatch(Actions.setObjectField(namespace, fieldName, value));
    },
    dispatchClearObjectField(fieldName) {
      return dispatch(Actions.clearObjectField(namespace, fieldName));
    },
    dispatchSetErrors(errorsObj) {
      return dispatch(Actions.setErrors(namespace, errorsObj));
    },
    dispatchClearErrors(fieldName) {
      return dispatch(Actions.clearErrors(namespace, fieldName));
    },
    dispatchSetInitialState() {
      return dispatch(Actions.setInitialState(namespace));
    },
  };

  return { reduxActions };
}
// Create enhancer function
const withRedux = connect(mapStateToProps, mapDispatchToProps);
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
      companyName,
      logo,
      isFallbackInstaller,
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
      companyName: companyName || '',
      logo: logo || {},
      isFallbackInstaller: isFallbackInstaller || false,
      addressOne: addressOne || '',
      addressTwo: addressTwo || '',
      postalCode: postalCode || '',
      city: city || '',
      phoneNumber: phoneNumber || '',
      email: email || '',
      postalAreas: postalAreas.join('; ') || '',
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
//------------------------------------------------------------------------------

export default withRedux(InstallersPageContainer);
