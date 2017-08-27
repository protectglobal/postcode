/**
* @summary Client side actions (redux).
* @namespace Actions.
*/

const setInitialState = namespace => (
  {
    type: 'SET_INITIAL_STATE',
    namespace,
  }
);

const updateTextField = (namespace, fieldName, value) => (
  {
    type: 'UPDATE_TEXT_FIELD',
    namespace,
    fieldName,
    value,
  }
);

const clearTextField = (namespace, fieldName) => (
  {
    type: 'CLEAR_TEXT_FIELD',
    namespace,
    fieldName,
  }
);

const setNumericField = (namespace, fieldName, value) => (
  {
    type: 'SET_NUMERIC_FIELD',
    namespace,
    fieldName,
    value,
  }
);

const incrementNumericField = (namespace, fieldName, value) => (
  {
    type: 'INCREMENT_NUMERIC_FIELD',
    namespace,
    fieldName,
    value,
  }
);

const setDateField = (namespace, fieldName, value) => (
  {
    type: 'SET_DATE_FIELD',
    namespace,
    fieldName,
    value,
  }
);

const setBooleanField = (namespace, fieldName, value) => (
  {
    type: 'SET_BOOLEAN_FIELD',
    namespace,
    fieldName,
    value,
  }
);

const setArrayField = (namespace, fieldName, value) => (
  {
    type: 'SET_ARRAY_FIELD',
    namespace,
    fieldName,
    value,
  }
);

const clearArrayField = (namespace, fieldName) => (
  {
    type: 'CLEAR_ARRAY_FIELD',
    namespace,
    fieldName,
  }
);

const setObjectField = (namespace, fieldName, value) => (
  {
    type: 'SET_OBJECT_FIELD',
    namespace,
    fieldName,
    value,
  }
);

const clearObjectField = (namespace, fieldName) => (
  {
    type: 'CLEAR_OBJECT_FIELD',
    namespace,
    fieldName,
  }
);

const setErrors = (namespace, errorsObj) => (
  {
    type: 'SET_ERRORS',
    namespace,
    fieldName: 'errors',
    errorsObj,
  }
);

const clearErrors = (namespace, fieldNameArray) => (
  {
    type: 'CLEAR_ERRORS',
    namespace,
    fieldName: 'errors',
    fieldNameArray,
  }
);

// All actions go here. Every time an action is dispacthed, all reducers run.
const Actions = {
  setInitialState,
  updateTextField,
  clearTextField,
  setNumericField,
  incrementNumericField,
  setDateField,
  setBooleanField,
  setArrayField,
  clearArrayField,
  setObjectField,
  clearObjectField,
  setErrors,
  clearErrors,
};

export default Actions;
