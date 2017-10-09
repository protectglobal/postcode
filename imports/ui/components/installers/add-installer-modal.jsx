import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { connect } from 'react-redux';
import Modal from 'antd/lib/modal'; // for js
import 'antd/lib/modal/style/css'; // for css
import Button from 'antd/lib/button'; // for js
import 'antd/lib/button/style/css'; // for css
import _ from 'underscore';
import { Bert } from 'meteor/themeteorchef:bert';
import ModalForm from './modal-form';
import Actions from '../../../api/redux/client/actions';
import AuxFunctions from '../../../api/aux-functions';
import Installers from '../../../api/installers/namespace';

//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'Page' logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
class AddInstallerModal extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleAddInstallerButtonClick = this.handleAddInstallerButtonClick.bind(this);
    this.handleAddInstallerModalCancel = this.handleAddInstallerModalCancel.bind(this);
    this.handleAddInstallerSubmit = this.handleAddInstallerSubmit.bind(this);
  }

  handleAddInstallerButtonClick() {
    const { reduxActions } = this.props;
    // Open modal
    reduxActions.dispatchSetBooleanField('addInstallerModalVisible', true);
  }

  handleAddInstallerModalCancel() {
    const { reduxActions } = this.props;
    // Clear form fields
    reduxActions.dispatchSetInitialState();
    // Close modal
    reduxActions.dispatchSetBooleanField('addInstallerModalVisible', false);
  }

  handleAddInstallerSubmit() {
    const { reduxState, reduxActions } = this.props;

    // List the fields that we are going to use.
    const fields = [
      'companyName',
      'logo',
      'addressOne',
      'addressTwo',
      'postalCode',
      'city',
      'phoneNumber',
      'email',
      'postalAreas',
    ];

    // Clear errors if any
    reduxActions.dispatchClearErrors(fields);

    // Disable submit button
    reduxActions.dispatchSetBooleanField('canAdd', false);

    const newInstaller = _.pick(reduxState, fields);

    // Check for errors
    const errors = Installers.apiBoth.checkInstallerFields(newInstaller);

    // In case of errors, warn user and prevent the meteor method to be called
    if (AuxFunctions.hasErrors(errors)) {
      // Display errors on UI
      reduxActions.dispatchSetErrors(errors);
      // Display flash notification
      Bert.alert('The form has errors', 'danger', 'growl-top-right');
      // Re-enable submit button
      reduxActions.dispatchSetBooleanField('canAdd', true);
      return;
    }

    Meteor.call('Installers.methods.addInstaller', newInstaller, (err) => {
      if (err) {
        Bert.alert(err.reason, 'danger', 'growl-top-right');
        console.log(err.reason);
        /* errors = Installers.apiBoth.handleCreateInstallerErrors(err);
        if (AuxFunctions.hasErrors(errors)) {
          // Display errors on UI
          reduxActions.dispatchSetErrors(errors);
        } */
      } else {
        // Close modal
        reduxActions.dispatchSetBooleanField('addInstallerModalVisible', false);
        // Clear form fields
        reduxActions.dispatchSetInitialState();
      }
      // Re-enable submit button
      reduxActions.dispatchSetBooleanField('canAdd', true);
    });
  }

  render() {
    const { reduxState } = this.props;
    const { canAdd, addInstallerModalVisible } = reduxState;

    return (
      <div className="inline-block mr2">
        <Button
          type="primary"
          onClick={this.handleAddInstallerButtonClick}
        >
          Add installer
        </Button>
        <Modal
          title="Add Installer"
          okText="Add installer"
          cancelText="Cancel"
          confirmLoading={!canAdd}
          visible={addInstallerModalVisible}
          onOk={this.handleAddInstallerSubmit}
          onCancel={this.handleAddInstallerModalCancel}
        >
          <ModalForm
            handleSubmit={this.handleAddInstallerSubmit}
          />
        </Modal>
      </div>
    );
  }
}

AddInstallerModal.propTypes = {
  reduxState: PropTypes.shape({
    canAdd: PropTypes.bool.isRequired,
    addInstallerModalVisible: PropTypes.bool.isRequired,
    companyName: PropTypes.string.isRequired,
    logo: PropTypes.oneOfType([
      PropTypes.shape({}),
      PropTypes.shape({
        publicId: PropTypes.string.isRequired,
        resourceType: PropTypes.string.isRequired,
        format: PropTypes.string.isRequired,
        bytes: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        url: PropTypes.string.isRequired,
        secureUrl: PropTypes.string.isRequired,
      }),
    ]),
    addressOne: PropTypes.string.isRequired,
    addressTwo: PropTypes.string.isRequired,
    postalCode: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    postalAreas: PropTypes.string.isRequired,
    errors: PropTypes.shape({
      companyName: PropTypes.array.isRequired,
      logo: PropTypes.array.isRequired,
      addressOne: PropTypes.array.isRequired,
      addressTwo: PropTypes.array.isRequired,
      postalCode: PropTypes.array.isRequired,
      city: PropTypes.array.isRequired,
      phoneNumber: PropTypes.array.isRequired,
      email: PropTypes.array.isRequired,
      postalAreas: PropTypes.array.isRequired,
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
const namespace = 'installers';

function mapStateToProps(state) {
  return { reduxState: state[namespace] };
}

function mapDispatchToProps(dispatch) {
  // Bind actions to current namespace.
  const reduxActions = {
    dispatchUpdateTextField(fieldName, value) {
      return dispatch(Actions.updateTextField(namespace, fieldName, value));
    },
    dispatchSetBooleanField(fieldName, value) {
      return dispatch(Actions.setBooleanField(namespace, fieldName, value));
    },
    dispatchSetArrayField(fieldName, value) {
      return dispatch(Actions.setArrayField(namespace, fieldName, value));
    },
    dispatchClearArrayField(fieldName) {
      return dispatch(Actions.clearArrayField(namespace, fieldName));
    },
    dispatchSetObjectField(fieldName, value) {
      return dispatch(Actions.setObjectField(namespace, fieldName, value));
    },
    dispatchClearObjectField(fieldName) {
      return dispatch(Actions.clearObjectField(namespace, fieldName));
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

export default withRedux(AddInstallerModal);
