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
const initViewLooksPageState = {
  searchText: '',
  searchPageUrl: '',
  searchBlogger: '',
  tagSearch: '',
  editLookModalVisible: false,
  canEdit: true,
  canDelete: true,
  pageNumber: 1,
  errors: {
    searchText: [],
    searchPageUrl: [],
    searchBlogger: [],
    tagSearch: [],
  },
};
const viewLooksPageReducer = (state = initViewLooksPageState, action) => {
  if (action.namespace === 'viewLooks') {
    if (action.type === 'SET_INITIAL_STATE') {
      return {
        searchText: '',
        searchPageUrl: '',
        searchBlogger: '',
        tagSearch: '',
        editLookModalVisible: false,
        canEdit: true,
        canDelete: true,
        pageNumber: 1,
        errors: {
          searchText: [],
          searchPageUrl: [],
          searchBlogger: [],
          tagSearch: [],
        },
      };
    }

    const { fieldName } = action;
    switch (fieldName) {
      case 'searchText':
      case 'searchPageUrl':
      case 'searchBlogger':
      case 'tagSearch':
        return {
          ...state,
          [fieldName]: textFieldReducer(state[fieldName], action),
        };
      case 'editLookModalVisible':
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

export default viewLooksPageReducer;
