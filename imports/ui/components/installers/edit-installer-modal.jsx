import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { connect } from 'react-redux';
import { Bert } from 'meteor/themeteorchef:bert';
import _ from 'underscore';
import Modal from 'antd/lib/modal'; // for js
import 'antd/lib/modal/style/css'; // for css
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
class EditInstallerModal extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleEditInstallerModalCancel = this.handleEditInstallerModalCancel.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleEditInstallerSubmit = this.handleEditInstallerSubmit.bind(this);
  }

  handleEditInstallerModalCancel() {
    const { reduxActions } = this.props;
    // Clear form fields
    reduxActions.dispatchSetInitialState();
    // Close modal
    reduxActions.dispatchSetBooleanField('editInstallerModalVisible', false);
  }

  handleInputChange({ fieldName, value }) { // { fieldName: 'companyName', value: 'Portect Global' }
    const { reduxState, reduxActions } = this.props;
    const { errors } = reduxState;

    reduxActions.dispatchUpdateTextField(fieldName, value);

    // Clear errors if any
    if (errors[fieldName].length > 0) {
      reduxActions.dispatchClearErrors(fieldName);
    }
  }

  handleEditInstallerSubmit() {
    const { reduxState, reduxActions } = this.props;

    // List the fields that we are going to use.
    const fields = [
      'logo',
      'companyName',
      'addressOne',
      'addressTwo',
      'postalCode',
      'city',
      'phoneNumber',
      'email',
      'postalAreas',
    ];

    // Clear errors if any
    reduxActions.dispatchClearErrors(_.without(fields, '_id'));

    // Disable submit button
    reduxActions.dispatchSetBooleanField('canEdit', false);

    const installer = _.pick(reduxState, fields);

    // Check for errors
    const errors = Installers.api.checkInstallerFields(installer);

    // In case of errors, warn user and prevent the meteor method to be called
    if (AuxFunctions.hasErrors(errors)) {
      // Display errors on UI
      reduxActions.dispatchSetErrors(errors);
      // Display flash notification
      Bert.alert('The form has errors', 'danger', 'growl-top-right');
      // Re-enable submit button
      reduxActions.dispatchSetBooleanField('canEdit', true);
      return;
    }

    Meteor.call('Installers.methods.editInstaller', installer, (err) => {
      if (err) {
        Bert.alert('The form has errors', 'danger', 'growl-top-right');
        /* errors = Installers.api.handleEditInstallerErrors(err);
        if (AuxFunctions.hasErrors(errors)) {
          // Display errors on UI
          reduxActions.dispatchSetErrors(errors);
        } */
      } else {
        // Close modal
        reduxActions.dispatchSetBooleanField('editInstallerModalVisible', false);
        // Clear form fields
        reduxActions.dispatchSetInitialState();
      }
      // Re-enable submit button
      reduxActions.dispatchSetBooleanField('canEdit', true);
    });
  }

  render() {
    const { reduxState } = this.props;
    const { canEdit, editInstallerModalVisible } = reduxState;

    return (
      <Modal
        title="Edit Installer"
        okText="Save"
        cancelText="Cancel"
        confirmLoading={!canEdit}
        visible={editInstallerModalVisible}
        onOk={this.handleEditInstallerSubmit}
        onCancel={this.handleEditInstallerModalCancel}
      >
        <ModalForm
          reduxState={reduxState}
          handleInputChange={this.handleInputChange}
          handleSubmit={this.handleEditInstallerSubmit}
        />
      </Modal>
    );
  }
}

EditInstallerModal.propTypes = {
  reduxState: PropTypes.shape({
    canEdit: PropTypes.bool.isRequired,
    editInstallerModalVisible: PropTypes.bool.isRequired,
    _id: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    companyName: PropTypes.string.isRequired,
    addressOne: PropTypes.string.isRequired,
    addressTwo: PropTypes.string.isRequired,
    postalCode: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    postalAreas: PropTypes.array.isRequired,
    errors: PropTypes.shape({
      logo: PropTypes.array.isRequired,
      companyName: PropTypes.array.isRequired,
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

export default withRedux(EditInstallerModal);