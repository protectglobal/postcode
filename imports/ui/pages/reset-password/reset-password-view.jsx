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
const ResetPasswordView = (props) => {
  const {
    reduxState,
    handleInputChange,
    handleSubmit,
  } = props;

  const {
    canSubmit,
    password,
    password2,
    errors,
  } = reduxState;

  return (
    <DefaultLayout width="350px" padding="20px 15px 0" centered>
      <h1 className="center">Reset your Password</h1>
      <Form
        onSubmit={handleSubmit}
        className="mt2"
        horizontal
      >
        <FormItem
          validateStatus={(AuxFunctions.getFieldNameErrors(errors, 'password') && 'error') || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'password')}
        >
          <InputControlled
            type="password"
            id="password"
            addonBefore={<Icon type="lock" />}
            placeholder="New password"
            value={password}
            onChange={handleInputChange}
          />
        </FormItem>
        <FormItem
          validateStatus={(AuxFunctions.getFieldNameErrors(errors, 'password2') && 'error') || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'password2')}
        >
          <InputControlled
            type="password"
            id="password2"
            addonBefore={<Icon type="lock" />}
            placeholder="Confirm new password"
            value={password2}
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
          Set New Password
        </Button>
        <p className="center mt2">
          <a href="/forgot-password">Resend forgot your password link</a>
        </p>
      </Form>
    </DefaultLayout>
  );
};

ResetPasswordView.propTypes = {
  reduxState: PropTypes.shape({
    canSubmit: PropTypes.bool.isRequired,
    password: PropTypes.string.isRequired,
    password2: PropTypes.string.isRequired,
    errors: PropTypes.shape({
      password: PropTypes.array.isRequired,
      password2: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export default ResetPasswordView;
