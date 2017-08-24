import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import { FlowRouter } from 'meteor/kadira:flow-router';
import _ from 'underscore';
import Actions from '../../../api/redux/client/actions.js';
import AuxFunctions from '../../../api/aux-functions.js';
import Users from '../../../api/users/namespace.js';
import SignupView from './signup-view.jsx';

//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'Page' logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
class SignupPage extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    const { meteorData } = this.props;
    const { curUser } = meteorData;

    // Make sure the viewer is NOT logged in. Check state only once after the
    // view is rendered for the first time.
    if (curUser) {
      FlowRouter.go('home');
    }
  }

  handleInputChange({ fieldName, value }) { // { fieldName: 'name', value: 'Juan' }
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
    const { name, email, password } = reduxState;

    // Clear errors if any
    reduxActions.dispatchClearErrors(['name', 'email', 'password']);

    // Disable submit button
    reduxActions.dispatchSetBooleanField('canSubmit', false);

    const newUser = { email, name, password };

    // Check for errors
    let errors = Users.apiBoth.checkSignupFields(newUser);

    // In case of errors, warn user and prevent the meteor method to be called
    if (AuxFunctions.hasErrors(errors)) {
      // Display errors on UI
      reduxActions.dispatchSetErrors(errors);
      // Display flash notification
      Bert.alert('The form has errors', 'danger', 'growl-top-right');
      // Re-enable submit button
      reduxActions.dispatchSetBooleanField('canSubmit', true);
      return;
    }

    // Prepare data to be inserted
    _.extend(newUser, { profile: { name } });

    Accounts.createUser(newUser, (err1) => {
      if (err1) {
        /* for (const key in err1) {
          console.log(`err.${key}: ${err1[key]}`);
        } */
        errors = Users.apiBoth.handleCreateUserErrors(err1);
        if (AuxFunctions.hasErrors(errors)) {
          // Display errors on UI
          reduxActions.dispatchSetErrors(errors);
        }
        // Re-enable submit button
        reduxActions.dispatchSetBooleanField('canSubmit', true);
      } else {
        Meteor.call('Users.methodsServer.setInitialRole');
        Meteor.call('EmailSystem.methodsServer.sendVerificationLink', (err2) => {
          if (err2) {
            // Display flash notification
            Bert.alert(err2.reason, 'danger', 'growl-top-right');
            // Re-enable submit button
            reduxActions.dispatchSetBooleanField('canSubmit', true);
          }

          // Clear redux state (email and password)
          reduxActions.dispatchSetInitialState('signup');
          // Redirect even if email couldn't be sent
          // FlowRouter.go('confirmEmail');
          FlowRouter.go('home');
        });
      }
    });
  }

  render() {
    const { reduxState } = this.props;

    return (
      <SignupView
        // Pass data down
        reduxState={reduxState}
        // Pass methods down
        handleInputChange={this.handleInputChange}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

SignupPage.propTypes = {
  reduxState: PropTypes.shape({
    canSubmit: PropTypes.bool.isRequired,
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    errors: PropTypes.shape({
      email: PropTypes.array.isRequired,
      name: PropTypes.array.isRequired,
      password: PropTypes.array,
    }).isRequired,
  }).isRequired,
  reduxActions: PropTypes.object.isRequired,
  meteorData: PropTypes.shape({
    curUser: PropTypes.object,
  }).isRequired,
};
//------------------------------------------------------------------------------
// REDUX INTEGRATION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'Page' component to handle UI State (Redux)
* integration.
*/
const namespace = 'signup';

function mapStateToProps(state) {
  return { reduxState: state[namespace] };
}

function mapDispatchToProps(dispatch) {
  // Bind actions to current Page. TODO: use functional programming
  // (redux helper?) for binding namespace to actions.
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
* @summary Wrapper around the 'Page' component to handle Domain State Meteor
* reactivity (component-level subscriptions etc etc), and pass data down to
* 'Page' component.
*/
const SignupPageContainer = createContainer(() => {
  // OBSERVATION: See componentWillMount where we make sure that the viewer is
  // NOT logged in when the page is rendered
  return {
    meteorData: {
      curUser: Meteor.user(),
    },
  };
}, SignupPage);
//------------------------------------------------------------------------------

export default withRedux(SignupPageContainer);
