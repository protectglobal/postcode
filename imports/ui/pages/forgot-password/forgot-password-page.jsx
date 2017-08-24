import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Actions from '../../../api/redux/client/actions.js';
import AuxFunctions from '../../../api/aux-functions.js';
import Users from '../../../api/users/namespace.js';
import ForgotPasswordView from './forgot-password-view.jsx';

//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'Page' logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
class ForgotPasswordPage extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange({ fieldName, value }) { // { fieldName: 'name', value: 'Juan' }
    // console.log(`fieldName: ${fieldName}, value: ${value}`);
    const { reduxState, reduxActions } = this.props;
    const { errors } = reduxState;

    reduxActions.dispatchUpdateTextField(fieldName, value);

    // Clear errors if any
    if (errors[fieldName].length > 0) {
      reduxActions.dispatchClearErrors(fieldName);
    }
  }

  handleSubmit(evt) {
    evt.preventDefault();

    const { reduxState, reduxActions } = this.props;
    const { email } = reduxState;

    // Clear errors if any
    reduxActions.dispatchClearErrors('email');

    // Disable submit button
    reduxActions.dispatchSetBooleanField('canSubmit', false);

    // Check for errors
    let errors = Users.apiBoth.checkForgotPasswordFields(email);
    if (AuxFunctions.hasErrors(errors)) {
      // Display errors on UI
      reduxActions.dispatchSetErrors(errors);
      // Display flash notification
      Bert.alert('The form has errors', 'danger', 'growl-top-right');
      // Re-enable submit button
      reduxActions.dispatchSetBooleanField('canSubmit', true);
      return;
    }

    Meteor.call('EmailSystem.methodsServer.sendResetPasswordLink', email, (err) => {
      if (err) {
        /* for (const key in err1) {
          console.log(`err.${key}: ${err1[key]}`);
        } */
        errors = Users.apiBoth.handleForgotPasswordErrors(err);
        if (AuxFunctions.hasErrors(errors)) {
          // Display errors on UI
          reduxActions.dispatchSetErrors(errors);
        }
        // Re-enable submit button
        reduxActions.dispatchSetBooleanField('canSubmit', true);
      } else {
        console.log('[forgot-password] Email sent!');
        // Clear redux state (email)
        reduxActions.dispatchSetInitialState('forgotPassword');
        Bert.alert('Email sent!', 'success', 'growl-top-right');
      }
    });
  }

  render() {
    const { reduxState } = this.props;

    return (
      <ForgotPasswordView
        // Pass data down
        reduxState={reduxState}
        // Pass methods down
        handleInputChange={this.handleInputChange}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

ForgotPasswordPage.propTypes = {
  reduxState: PropTypes.shape({
    canSubmit: PropTypes.bool.isRequired,
    email: PropTypes.string.isRequired,
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
* @summary Wrapper around the 'Page' component to handle Domain State Meteor
* reactivity (component-level subscriptions etc etc), and pass data down to
* 'Page' component.
*/
const namespace = 'forgotPassword';

function mapStateToProps(state) {
  return { reduxState: state[namespace] };
}

function mapDispatchToProps(dispatch) {
  // Bind actions to current Page.
  const reduxActions = {
    dispatchUpdateTextField(fieldName, value) {
      return dispatch(Actions.updateTextField(namespace, fieldName, value));
    },
    dispatchSetBooleanField(fieldName, value) {
      return dispatch(Actions.setBooleanField(namespace, fieldName, value));
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
* @summary Wrapper around the 'Page' component to handle Meteor reactivity
* (component-level subscriptions etc etc), and pass data down to 'Page'
* component. Warning, LocalState.set() can't be used here!
*/
const ForgotPasswordPageContainer = createContainer(() => {
  // Get current user
  const curUser = Meteor.user();

  // Make sure the viewer is NOT logged in. If yes, redirect her to home page.
  if (curUser) {
    FlowRouter.go('home');
    return {};
  }

  return {};
}, ForgotPasswordPage);
//------------------------------------------------------------------------------

export default withRedux(ForgotPasswordPageContainer);
