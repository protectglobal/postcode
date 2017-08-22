import _ from 'underscore';
import Constants from '../../../constants.js';
import {
  textFieldReducer,
  booleanFieldReducer,
  errorsReducer,
} from './shared-reducers.js';

/**
* Given the same arguments, it should calculate the next state and return it.
* No surprises. No side effects. No API calls. No mutations. Just a calculation.
*/

// Page reducer. Holds state for the whole page component. Delegates to smaller
// reducers as needed.
const initResetPasswordPageState = {
  canSubmit: true,
  password: '',
  password2: '',
  errors: {
    password: [],
    password2: [],
  },
};
const resetPasswordPageReducer = (state = initResetPasswordPageState, action) => {
  if (action.namespace === 'resetPassword') {
    if (action.type === 'SET_INITIAL_STATE') {
      return {
        canSubmit: true,
        password: '',
        password2: '',
        errors: {
          password: [],
          password2: [],
        },
      };
    }

    const { fieldName } = action;
    switch (fieldName) {
      case 'canSubmit':
        return {
          ...state,
          [fieldName]: booleanFieldReducer(state[fieldName], action),
        };
      case 'password':
      case 'password2':
        return {
          ...state,
          [fieldName]: textFieldReducer(state[fieldName], action),
        };
      case 'errors':
        return {
          ...state,
          [fieldName]: errorsReducer(state[fieldName], action),
        };
      default:
        return state;
    }
  }
  return state;
}

export default resetPasswordPageReducer;
