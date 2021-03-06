import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Bert } from 'meteor/themeteorchef:bert';
import Users from '../../../api/users/namespace.js';
import Actions from '../../../api/redux/client/actions.js';
import ConfirmEmailView from './confirm-email-view.jsx';

//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'Page' logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
class ConfirmEmailPage extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleResendConfirmationLinkClick = this.handleResendConfirmationLinkClick.bind(this);
  }

  handleResendConfirmationLinkClick(evt) {
    evt.preventDefault();

    const { reduxActions } = this.props;

    // Display loading indicator
    reduxActions.dispatchSetBooleanField('loading', true);

    Meteor.call('EmailSystem.methodsServer.sendVerificationLink', (err) => {
      if (err) {
        // Display flash notification
        Bert.alert(err.reason, 'danger', 'growl-top-right');
      } else {
        // Display flash notification
        Bert.alert('A new confirmation email has been sent to your inbox', 'success', 'growl-top-right');
        // Redirect to go page
        FlowRouter.go('home');
      }
      // Hide loading indicator
      reduxActions.dispatchSetBooleanField('loading', false);
    });
  }

  render() {
    const { reduxState } = this.props;

    return (
      <ConfirmEmailView
        // Pass data down
        reduxState={reduxState}
        // Pass methods down
        handleResendConfirmationLinkClick={this.handleResendConfirmationLinkClick}
      />
    );
  }
}

ConfirmEmailPage.propTypes = {
  reduxState: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    errors: PropTypes.shape({
      email: PropTypes.array.isRequired,
    }).isRequired,
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
const namespace = 'confirmEmail';

function mapStateToProps(state) {
  return { reduxState: state[namespace] };
}

function mapDispatchToProps(dispatch) {
  // Bind actions to current Page.
  const reduxActions = {
    dispatchSetBooleanField(fieldName, value) {
      return dispatch(Actions.setBooleanField(namespace, fieldName, value));
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
// Create enhancer function.
const withRedux = connect(mapStateToProps, mapDispatchToProps);
//------------------------------------------------------------------------------
// PAGE CONTAINER DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'Page' component to handle Domain State Meteor
* reactivity (component-level subscriptions etc etc), and pass data down to
* 'Page' component.
*/
const ConfirmEmailPageContainer = createContainer(() => {
  // Get current user.
  const curUserId = Meteor.userId();

  // Make sure the user is logged in!
  if (!curUserId) {
    FlowRouter.go('login');
    return {};
  }

  // Is account already verified?
  if (Users.apiBoth.isAccountVerified(curUserId)) {
    FlowRouter.go('home');
    return {};
  }

  return {};
}, ConfirmEmailPage);
//------------------------------------------------------------------------------

export default withRedux(ConfirmEmailPageContainer);
