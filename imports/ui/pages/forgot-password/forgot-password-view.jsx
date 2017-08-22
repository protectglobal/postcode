import React, { PropTypes } from 'react';
import Form from 'antd/lib/form'; // for js
import 'antd/lib/form/style/css'; // for css
import Button from 'antd/lib/button'; // for js
import 'antd/lib/button/style/css'; // for css
import Icon from 'antd/lib/icon'; // for js
import 'antd/lib/icon/style/css'; // for css
import DefaultLayout from '../../layouts/default/default-layout';
import AuxFunctions from '../../../api/aux-functions';
import InputControlled from '../../components/forms/input-controlled';

const FormItem = Form.Item;

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const ForgotPasswordView = (props) => {
  const {
    reduxState,
    handleInputChange,
    handleSubmit,
  } = props;

  const { canSubmit, email, errors } = reduxState;

  return (
    <DefaultLayout width="350px" padding="20px 15px 0" centered>
      <h1 className="center">Forgot your Password?</h1>
      <p className="center">
        {`We'll send a link to your email to reset your password and get
        you back on track.`}
      </p>
      <Form
        onSubmit={handleSubmit}
        className="mt2"
        horizontal
      >
        <FormItem
          validateStatus={(AuxFunctions.getFieldNameErrors(errors, 'email') && 'error') || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'email')}
        >
          <InputControlled
            type="text"
            id="email"
            addonBefore={<Icon type="mail" />}
            placeholder="Email"
            value={email}
            onChange={handleInputChange}
          />
        </FormItem>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!canSubmit}
          size="large"
          loading={!canSubmit}
          className="full-width"
        >
          Resend Link
        </Button>
      </Form>
    </DefaultLayout>
  );
};

ForgotPasswordView.propTypes = {
  reduxState: PropTypes.shape({
    canSubmit: PropTypes.bool.isRequired,
    email: PropTypes.string.isRequired,
    errors: PropTypes.shape({
      email: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export default ForgotPasswordView;
