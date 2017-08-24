import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
// import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';
// import { Bert } from 'meteor/themeteorchef:bert';
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
    this.handleEditInstallerButtonClick = this.handleEditInstallerButtonClick.bind(this);
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
      if (key !== 'postalAreas') {
        reduxActions.dispatchUpdateTextField(key, installer[key]);
      } else {
        reduxActions.dispatchSetArrayField(key, installer[key]);
      }
    });

    // Open modal
    reduxActions.dispatchSetBooleanField('editInstallerModalVisible', true);
  }

  render() {
    const { reduxState, meteorData } = this.props;

    return (
      <InstallersView
        // Pass data down
        reduxState={reduxState}
        meteorData={meteorData}
        // Pass methods down
        handleEditInstallerButtonClick={this.handleEditInstallerButtonClick}
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
//------------------------------------------------------------------------------

export default withRedux(InstallersPageContainer);
