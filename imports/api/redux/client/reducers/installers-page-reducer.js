import _ from 'underscore';
import Constants from '../../../constants.js';
import {
  textFieldReducer,
  numericFieldReducer,
  booleanFieldReducer,
  errorsReducer,
} from './shared-reducers.js';

/**
* Given the same arguments, it should calculate the next state and return it.
* No surprises. No side effects. No API calls. No mutations. Just a calculation.
*/

// Page reducer. Holds state for the whole page component. Delegates to smaller
// reducers as needed.
const initInstallersPageState = {
  _id: '',
  logo: '',
  companyName: '',
  addressOne: '',
  addressTwo: '',
  postalCode: '',
  city: '',
  phoneNumber: '',
  email: '',
  postalAreas: [],
  addInstallerModalVisible: false,
  editInstallerModalVisible: false,
  canAdd: true,
  canEdit: true,
  canDelete: true,
  pageNumber: 1,
  errors: {
    logo: [],
    companyName: [],
    addressOne: [],
    addressTwo: [],
    postalCode: [],
    city: [],
    phoneNumber: [],
    email: [],
    postalAreas: [],
  },
};

const installersPageReducer = (state = Object.assign({}, initInstallersPageState), action) => {
  if (action.namespace === 'installers') {
    if (action.type === 'SET_INITIAL_STATE') {
      return Object.assign({}, initInstallersPageState);
    }

    const { fieldName } = action;
    switch (fieldName) {
      case '_id':
      case 'logo':
      case 'companyName':
      case 'addressOne':
      case 'addressTwo':
      case 'postalCode':
      case 'city':
      case 'phoneNumber':
      case 'email':
      case 'postalAreas':
        return {
          ...state,
          [fieldName]: textFieldReducer(state[fieldName], action),
        };
      case 'addInstallerModalVisible':
      case 'editInstallerModalVisible':
      case 'canAdd':
      case 'canEdit':
      case 'canDelete':
        return {
          ...state,
          [fieldName]: booleanFieldReducer(state[fieldName], action),
        };
      case 'pageNumber':
        return {
          ...state,
          [fieldName]: numericFieldReducer(state[fieldName], action),
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
};

export default installersPageReducer;
