import React, { PropTypes } from 'react';
import Form from 'antd/lib/form'; // for js
import 'antd/lib/form/style/css'; // for css
import InputControlled from '../../components/forms/input-controlled';
import TagsSelectControlled from '../../components/forms/tags-select-controlled';
import AuxFunctions from '../../../api/aux-functions';

const FormItem = Form.Item;

//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'Page' logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
const ModalForm = (props) => {
  const { reduxState, handleInputChange, handleSubmit } = props;
  const {
    addInstallerModalVisible,
    editInstallerModalVisible,
    logo,
    companyName,
    addressOne,
    addressTwo,
    postalCode,
    city,
    phoneNumber,
    email,
    postalAreas,
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
        label="Logo"
        validateStatus={(AuxFunctions.getFieldNameErrors(errors, 'logo') && 'error') || ''}
        help={AuxFunctions.getFieldNameErrors(errors, 'logo')}
      >
        <InputControlled
          type="text"
          id="logo"
          placeholder="Logo"
          value={logo}
          onChange={handleInputChange}
        />
      </FormItem>
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
          onChange={handleInputChange}
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
          onChange={handleInputChange}
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
          onChange={handleInputChange}
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
          onChange={handleInputChange}
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
          onChange={handleInputChange}
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
          onChange={handleInputChange}
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
          onChange={handleInputChange}
        />
      </FormItem>
      <FormItem
        label="Postal areas"
        validateStatus={(AuxFunctions.getFieldNameErrors(errors, 'postalAreas') && 'error') || ''}
        help={AuxFunctions.getFieldNameErrors(errors, 'postalAreas')}
      >
        <TagsSelectControlled
          id="postalAreas"
          placeholder="Postal areas"
          options={[]}
          defaultValue={postalAreas}
          onChange={handleInputChange}
          onSearch={() => {}}
        />
      </FormItem>
    </Form>
  );
};

ModalForm.propTypes = {
  reduxState: PropTypes.shape({
    addInstallerModalVisible: PropTypes.bool.isRequired,
    editInstallerModalVisible: PropTypes.bool.isRequired,
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
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default ModalForm;
