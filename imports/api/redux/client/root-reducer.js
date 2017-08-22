import { combineReducers } from 'redux';
import signupPageReducer from './reducers/signup-page-reducer.js';
import loginPageReducer from './reducers/login-page-reducer.js';
import confirmEmailPageReducer from './reducers/confirm-email-page-reducer.js';
import linkExpiredPageReducer from './reducers/link-expired-page-reducer.js';
import forgotPasswordPageReducer from './reducers/forgot-password-page-reducer.js';
import resetPasswordPageReducer from './reducers/reset-password-page-reducer.js';
import homePageReducer from './reducers/home-page-reducer.js';
import viewLooksPageReducer from './reducers/view-looks-page-reducer.js';

const rootReducer = combineReducers({
  signup: signupPageReducer,
  login: loginPageReducer,
  confirmEmail: confirmEmailPageReducer,
  linkExpired: linkExpiredPageReducer,
  forgotPassword: forgotPasswordPageReducer,
  resetPassword: resetPasswordPageReducer,
  home: homePageReducer,
  viewLooks: viewLooksPageReducer,
});

export default rootReducer;
