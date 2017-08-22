import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Actions from '../../../api/redux/client/actions.js';
import AuxFunctions from '../../../api/aux-functions.js';
import Users from '../../../api/users/namespace.js';
import ResetPasswordView from './reset-password-view.jsx';

//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'Page' logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
class ResetPasswordPage extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange({ fieldName, value }) { // { fieldName: 'password2', value: 'hola' }
    const { reduxState, reduxActions } = this.props;
    const { errors } = reduxState;

    reduxActions.dispatchUpdateTextField(fieldName, value);

    // Clear errors if any
    if (errors.password.length > 0 && errors.password[0] === 'Password doesn\'t match') {
      // Clear errors for both fields in case of changing one of them.
      reduxActions.dispatchClearErrors(['password', 'password2']);
    } else if (errors[fieldName].length > 0) {
      reduxActions.dispatchClearErrors(fieldName);
    }
  }

  handleSubmit(evt) {
    evt.preventDefault();

    const { reduxState, reduxActions, urlState } = this.props;
    const { password, password2 } = reduxState;
    const { token } = urlState;

    // Clear errors if any
    reduxActions.dispatchClearErrors(['password', 'password2']);

    // Disable submit button
    reduxActions.dispatchSetBooleanField('canSubmit', false);

    // Check for errors
    const errors = Users.apiBoth.checkResetPasswordFields(password, password2);
    if (AuxFunctions.hasErrors(errors)) {
      // Display errors on UI
      reduxActions.dispatchSetErrors(errors);
      // Display flash notification
      Bert.alert('The form has errors', 'danger', 'growl-top-right');
      // Re-enable submit button
      reduxActions.dispatchSetBooleanField('canSubmit', true);
      return;
    }

    Accounts.resetPassword(token, password, (err) => {
      if (err) {
        console.log(`[reset-password] ${err}`);
        // Display flash notification
        Bert.alert(err.reason, 'danger', 'growl-top-right');
        // Re-enable submit button
        reduxActions.dispatchSetBooleanField('canSubmit', true);
      } else {
        // Clear redux state (password and password2)
        reduxActions.dispatchSetInitialState('resetPassword');
        // Display flash notification
        Bert.alert('Password reset successfully', 'success', 'growl-top-right');
        // Redirect to home page
        FlowRouter.go('home');
      }
    });
  }

  render() {
    const { reduxState } = this.props;

    return (
      <ResetPasswordView
        // Pass data down
        reduxState={reduxState}
        // Pass methods down
        handleInputChange={this.handleInputChange}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

ResetPasswordPage.propTypes = {
  urlState: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
  reduxState: PropTypes.shape({
    canSubmit: PropTypes.bool.isRequired,
    password: PropTypes.string.isRequired,
    password2: PropTypes.string.isRequired,
    errors: PropTypes.shape({
      password: PropTypes.array.isRequired,
      password2: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  reduxActions: PropTypes.object.isRequired,
};

ResetPasswordPage.defaultProps = {
  urlState: {
    token: 'no-token',
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
const namespace = 'resetPassword';

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
const ResetPasswordPageContainer = createContainer(({ token }) => {
  // Get current user
  const curUserId = Meteor.userId();

  // Make sure the user is NOT logged in!
  if (curUserId) {
    FlowRouter.go('home');
    return {};
  }

  return {
    urlState: {
      token,
    },
  };
}, ResetPasswordPage);
//------------------------------------------------------------------------------

export default withRedux(ResetPasswordPageContainer);
