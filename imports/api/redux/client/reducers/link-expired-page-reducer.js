import _ from 'underscore';
import Constants from '../../../constants.js';
import {
  booleanFieldReducer,
  errorsReducer,
} from './shared-reducers.js';

/**
* Given the same arguments, it should calculate the next state and return it.
* No surprises. No side effects. No API calls. No mutations. Just a calculation.
*/

// Page reducer. Holds state for the whole page component. Delegates to smaller
// reducers as needed.
const initLinkExpiredPageState = {
  loading: false,
  errors: {
    email: [],
  },
};
const linkExpiredPageReducer = (state = initLinkExpiredPageState, action) => {
  if (action.namespace === 'linkExpired') {
    if (action.type === 'SET_INITIAL_STATE') {
      return {
        loading: false,
        errors: {
          email: [],
        },
      };
    }

    const { fieldName } = action;
    switch (fieldName) {
      case 'loading':
        return {
          ...state,
          [fieldName]: booleanFieldReducer(state[fieldName], action),
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

export default linkExpiredPageReducer;
