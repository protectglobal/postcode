import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Cloudinary } from 'meteor/lepozepo:cloudinary';
import { Bert } from 'meteor/themeteorchef:bert';
import Form from 'antd/lib/form'; // for js
import 'antd/lib/form/style/css'; // for css
import InputControlled from '../../components/forms/input-controlled';
import RadioControlled from '../../components/forms/radio-controlled';
import Actions from '../../../api/redux/client/actions';
import AuxFunctions from '../../../api/aux-functions';
import Installers from '../../../api/installers/namespace';
import style from './style.scss';

const FormItem = Form.Item;

//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'Page' logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
class ModalForm extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    // this.handleImageDeleteButtonClick = this.handleImageDeleteButtonClick.bind(this);
  }

  handleInputChange({ fieldName, value }) { // { fieldName: 'companyName', value: 'Protect Global' }
    const { reduxState, reduxActions } = this.props;
    const { errors } = reduxState;

    if (fieldName !== 'isFallbackInstaller') {
      reduxActions.dispatchUpdateTextField(fieldName, value);
    } else {
      console.log(
        'fieldName', fieldName,
        'value', value,
      );
      reduxActions.dispatchSetBooleanField(fieldName, value);
    }

    // Clear errors if any
    if (errors[fieldName].length > 0) {
      reduxActions.dispatchClearErrors(fieldName);
    }
  }

  handleImageUpload(files) {
    const { reduxActions } = this.props;

    // Clear errors if any
    reduxActions.dispatchClearErrors('logo');

    // Disable upload button
    reduxActions.dispatchSetBooleanField('canUpload', false);

    // Show loading indicator
    reduxActions.dispatchSetBooleanField('uploadingImage', true);

    // Check for errors (number of images, file size and format)
    const errors = Installers.apiBoth.checkLogo(files);

    // In case of errors, warn user and prevent the meteor method to be called
    if (AuxFunctions.hasErrors(errors)) {
      // Display errors on UI
      reduxActions.dispatchSetErrors(errors);
      // Display flash notification
      Bert.alert('The form has errors', 'danger', 'growl-top-right');
      // Hide loading indicator
      reduxActions.dispatchSetBooleanField('uploadingImage', false);
      // Re-enable upload button
      reduxActions.dispatchSetBooleanField('canUpload', true);
      return;
    }

    // At this stage files must contain a single image
    Cloudinary.upload(files, (err1, res1) => {
      if (err1) {
        Bert.alert(err1.reason, 'danger', 'growl-top-right');
        // Remove loading indicator from UI
        reduxActions.dispatchSetBooleanField('uploadingImage', false);
      } else {
        console.log('[uploader] success');
        // Filter and format cloudinary data
        const logo = AuxFunctions.formatCloudinaryData(res1);
        // Save image data into redux state
        reduxActions.dispatchSetObjectField('logo', logo);
      }
      // Remove loading indicator from UI
      reduxActions.dispatchSetBooleanField('uploadingImage', false);
      // Re-enable upload button
      reduxActions.dispatchSetBooleanField('canUpload', true);
    });
  }

  /* handleImageDeleteButtonClick(publicId) {
    // Delete image from DB
    Meteor.call('Images.methods.removeImage', publicId, (err1) => {
      if (err1) {
        Bert.alert(err1.reason, 'danger', 'growl-top-right');
      } else {
        // Delete image from Cloudinary server
        Cloudinary.delete(publicId, (err2) => {
          if (err2) {
            Bert.alert(err2.reason, 'danger', 'growl-top-right');
          } else {
            console.log('[image] deleted');
          }
        });
      }
    });
  } */

  render() {
    const {
      reduxState,
      handleSubmit,
    } = this.props;

    const {
      companyName,
      logo,
      isFallbackInstaller,
      addressOne,
      addressTwo,
      postalCode,
      city,
      phoneNumber,
      email,
      postalAreas,
      addInstallerModalVisible,
      editInstallerModalVisible,
      uploadingImage,
      errors,
    } = reduxState;

    // Force re-render in order to clear defaultValue tags.
    if (addInstallerModalVisible === false && editInstallerModalVisible === false) {
      return null;
    }

    return (
      <Form
        onSubmit={handleSubmit}
        className="mt2"
      >
        <FormItem
          label="Company name"
          validateStatus={(AuxFunctions.getFieldNameErrors(errors, 'companyName') && 'error') || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'companyName')}
        >
          <InputControlled
            type="text"
            id="companyName"
            placeholder="Company name"
            value={companyName}
            onChange={this.handleInputChange}
          />
        </FormItem>
        <FormItem
          label="Logo"
          validateStatus={(AuxFunctions.getFieldNameErrors(errors, 'logo') && 'error') || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'logo')}
        >
          <div className="flex">
            <input
              type="file"
              onChange={(evt) => {
                const files = evt.target.files;
                // Pass data up to parent component
                this.handleImageUpload(files);
              }}
            />
            {uploadingImage ? <span className="red">uploading image, plase wait...</span> : null}
            {logo && logo.secureUrl && !uploadingImage && (
              <img
                src={logo.secureUrl || logo.url}
                alt="logo"
                className={`ml2 ${style.logo}`}
              />
            )}
          </div>
        </FormItem>
        <FormItem
          label="Is fallback installer?"
          validateStatus={(AuxFunctions.getFieldNameErrors(errors, 'isFallbackInstaller') && 'error') || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'isFallbackInstaller')}
        >
          <RadioControlled
            id="isFallbackInstaller"
            value={isFallbackInstaller}
            options={[
              { value: false, label: 'No' },
              { value: true, label: 'Yes' },
            ]}
            onChange={this.handleInputChange}
          />
        </FormItem>
        <FormItem
          label="Address 1"
          validateStatus={(AuxFunctions.getFieldNameErrors(errors, 'addressOne') && 'error') || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'addressOne')}
        >
          <InputControlled
            type="text"
            id="addressOne"
            placeholder="Address 1"
            value={addressOne}
            onChange={this.handleInputChange}
          />
        </FormItem>
        <FormItem
          label="Address 2"
          validateStatus={(AuxFunctions.getFieldNameErrors(errors, 'addressTwo') && 'error') || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'addressTwo')}
        >
          <InputControlled
            type="text"
            id="addressTwo"
            placeholder="Address 2"
            value={addressTwo}
            onChange={this.handleInputChange}
          />
        </FormItem>
        <FormItem
          label="Postal code"
          validateStatus={(AuxFunctions.getFieldNameErrors(errors, 'postalCode') && 'error') || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'postalCode')}
        >
          <InputControlled
            type="text"
            id="postalCode"
            placeholder="Postal code"
            value={postalCode}
            onChange={this.handleInputChange}
          />
        </FormItem>
        <FormItem
          label="City"
          validateStatus={(AuxFunctions.getFieldNameErrors(errors, 'city') && 'error') || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'city')}
        >
          <InputControlled
            type="text"
            id="city"
            placeholder="City"
            value={city}
            onChange={this.handleInputChange}
          />
        </FormItem>
        <FormItem
          label="Phone number"
          validateStatus={(AuxFunctions.getFieldNameErrors(errors, 'phoneNumber') && 'error') || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'phoneNumber')}
        >
          <InputControlled
            type="text"
            id="phoneNumber"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={this.handleInputChange}
          />
        </FormItem>
        <FormItem
          label="Email"
          validateStatus={(AuxFunctions.getFieldNameErrors(errors, 'email') && 'error') || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'email')}
        >
          <InputControlled
            type="text"
            id="email"
            placeholder="Email"
            value={email}
            onChange={this.handleInputChange}
          />
        </FormItem>
        <FormItem
          label="Postal areas"
          validateStatus={(AuxFunctions.getFieldNameErrors(errors, 'postalAreas') && 'error') || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'postalAreas')}
        >
          <InputControlled
            type="text"
            id="postalAreas"
            placeholder="Postal areas"
            value={postalAreas}
            onChange={this.handleInputChange}
          />
        </FormItem>
      </Form>
    );
  }
}

ModalForm.propTypes = {
  reduxState: PropTypes.shape({
    addInstallerModalVisible: PropTypes.bool.isRequired,
    editInstallerModalVisible: PropTypes.bool.isRequired,
    companyName: PropTypes.string.isRequired,
    logo: PropTypes.object.isRequired,
    isFallbackInstaller: PropTypes.bool.isRequired,
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
      isFallbackInstaller: PropTypes.array.isRequired,
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
  handleSubmit: PropTypes.func.isRequired,
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
export default withRedux(ModalForm);
