import React from 'react';
import { mount } from 'react-mounter';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import Store from '../../api/redux/client/store.js';
import Actions from '../../api/redux/client/actions.js';
import Root from '../../ui/layouts/root.jsx';
import SignupPageContainer from '../../ui/pages/signup/signup-page.jsx';
import LoginPageContainer from '../../ui/pages/login/login-page.jsx';
// import ConfirmEmailPageContainer from '../../ui/pages/confirm-email/confirm-email-page.jsx';
import LinkExpiredPageContainer from '../../ui/pages/link-expired/link-expired-page.jsx';
import ForgotPasswordPageContainer from '../../ui/pages/forgot-password/forgot-password-page.jsx';
import ResetPasswordPageContainer from '../../ui/pages/reset-password/reset-password-page.jsx';
import HomePageContainer from '../../ui/pages/home/home-page.jsx';
import UsersPageContainer from '../../ui/pages/users/users-page.jsx';
import ProvidersPageContainer from '../../ui/pages/providers/providers-page.jsx';
import CustomersPageContainer from '../../ui/pages/customers/customers-page.jsx';
import NotFoundPage from '../../ui/pages/not-found-page.jsx';

const { dispatch } = Store;

console.log('[router] loading routes');

//------------------------------------------------------------------------------
function clearSignupPageReduxState() {
  dispatch(Actions.setInitialState('signup'));
}
//------------------------------------------------------------------------------
function clearLoginPageReduxState() {
  dispatch(Actions.setInitialState('login'));
}
//------------------------------------------------------------------------------
function clearForgotPasswordPageReduxState() {
  dispatch(Actions.setInitialState('forgotPassword'));
}
//------------------------------------------------------------------------------
function clearResetPasswordPageReduxState() {
  dispatch(Actions.setInitialState('resetPassword'));
}
//------------------------------------------------------------------------------
function clearHomePageReduxState() {
  dispatch(Actions.setInitialState('home'));
}
//------------------------------------------------------------------------------
/* function clearProvidersPageReduxState() {
  dispatch(Actions.setInitialState('providers'));
} */
//------------------------------------------------------------------------------
// ROUTES:
//------------------------------------------------------------------------------
FlowRouter.route('/', {
  name: 'index',
  action() {
    FlowRouter.go('home');
  },
});

FlowRouter.route('/signup', {
  name: 'signup',
  action() {
    mount(Root, {
      content: () => <SignupPageContainer />,
    });
  },
  // calls when we decide to move to another route
  // but calls before the next route started
  triggersExit: [clearSignupPageReduxState],
});

FlowRouter.route('/login', {
  name: 'login',
  action() {
    mount(Root, {
      content: () => <LoginPageContainer />,
    });
  },
  // calls when we decide to move to another route
  // but calls before the next route started
  triggersExit: [clearLoginPageReduxState],
});

/* FlowRouter.route('/confirm-email', {
  name: 'confirmEmail',
  action() {
    mount(Root, {
      content: () => <ConfirmEmailPageContainer />,
    });
  },
  // calls when we decide to move to another route
  // but calls before the next route started
  // triggersExit: [clearLoginPageReduxState],
}); */

// See: https://themeteorchef.com/snippets/sign-up-with-email-verification/#tmc-confirming-the-users-email-and-logging-in
FlowRouter.route('/verify-email/:token', {
  name: 'verifyEmail',
  action(params) {
    Accounts.verifyEmail(params.token, (err) => {
      if (err) {
        console.log(`[router] ${err.reason}`);
        mount(Root, {
          content: () => <LinkExpiredPageContainer />,
        });
      } else {
        FlowRouter.go('home');
        Bert.alert('Account verified successfully. Thanks!', 'success', 'growl-top-right');
      }
    });
  },
});

FlowRouter.route('/forgot-password', {
  name: 'forgotPassword',
  action() {
    mount(Root, {
      content: () => <ForgotPasswordPageContainer />,
    });
  },
  // calls when we decide to move to another route
  // but calls before the next route started
  triggersExit: [clearForgotPasswordPageReduxState],
});

// See: https://themeteorchef.com/snippets/sign-up-with-email-verification/#tmc-confirming-the-users-email-and-logging-in
// and https://forums.meteor.com/t/how-to-use-accounts-onresetpasswordlink-with-react/28863/9
FlowRouter.route('/reset-password/:token', {
  name: 'resetPassword',
  action(params) {
    mount(Root, {
      content: () => <ResetPasswordPageContainer token={params.token} />,
    });
  },
  // calls when we decide to move to another route
  // but calls before the next route started
  triggersExit: [clearResetPasswordPageReduxState],
});

FlowRouter.route('/home', {
  name: 'home',
  action() {
    mount(Root, {
      content: () => <HomePageContainer />,
    });
  },
  // calls when we decide to move to another route
  // but calls before the next route started
  triggersExit: [clearHomePageReduxState],
});

FlowRouter.route('/users', {
  name: 'users',
  action() {
    mount(Root, {
      content: () => <UsersPageContainer />,
    });
  },
  // calls when we decide to move to another route
  // but calls before the next route started
  // triggersExit: [clearUsersPageReduxState],
});

FlowRouter.route('/providers', {
  name: 'providers',
  action() {
    mount(Root, {
      content: () => <ProvidersPageContainer />,
    });
  },
  // calls when we decide to move to another route
  // but calls before the next route started
  // triggersExit: [clearProvidersPageReduxState],
});

FlowRouter.route('/customers', {
  name: 'customers',
  action() {
    mount(Root, {
      content: () => <CustomersPageContainer />,
    });
  },
  // calls when we decide to move to another route
  // but calls before the next route started
  // triggersExit: [clearCustomersPageReduxState],
});

FlowRouter.notFound = {
  action() {
    mount(Root, {
      content: () => <NotFoundPage />,
    });
  },
};
