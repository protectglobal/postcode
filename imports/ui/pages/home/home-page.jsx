import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';
import Users from '../../../api/users/namespace.js';
import Actions from '../../../api/redux/client/actions.js';
import Constants from '../../../api/constants.js';
import HomeView from './home-view.jsx';

//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'Page' logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
class HomePage extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
  }

  render() {
    const { reduxState } = this.props;

    return (
      <HomeView
        // Pass data down
        reduxState={reduxState}
        // Pass methods down
      />
    );
  }
}

HomePage.propTypes = {
  reduxState: PropTypes.shape({
  }).isRequired,
  reduxActions: PropTypes.object.isRequired,
};
//------------------------------------------------------------------------------
// REDUX INTEGRATION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'Page' component to handle UI State (Redux)
* integration.
*/
const namespace = 'home';

function mapStateToProps(state) {
  return { reduxState: state[namespace] };
}

function mapDispatchToProps(dispatch) {
  // Bind actions to current Page.
  const reduxActions = {
    dispatchUpdateTextField(fieldName, value) {
      return dispatch(Actions.updateTextField(namespace, fieldName, value));
    },
    dispatchSetErrors(errorsObj) {
      return dispatch(Actions.setErrors(namespace, errorsObj));
    },
    dispatchClearErrors(fieldName) {
      return dispatch(Actions.clearErrors(namespace, fieldName));
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
const HomePageContainer = createContainer(() => {
  // Get current user
  const curUserId = Meteor.userId();

  // Make sure the user is logged in!
  if (!curUserId) {
    FlowRouter.go('login');
    return {};
  }

  // OBSERVATION: allow user to access the home page even if account is not
  // verified.

  // Check user role
  if (!Roles.userIsInRole(curUserId, Constants.HOME_PAGE_ROLES)) {
    throw new Meteor.Error(403, 'Access denied at HomePageContainer');
  }

  return {};
}, HomePage);
//------------------------------------------------------------------------------

export default withRedux(HomePageContainer);
