import React, { PropTypes } from 'react';
import Form from 'antd/lib/form'; // for js
import 'antd/lib/form/style/css'; // for css
import Icon from 'antd/lib/icon'; // for js
import 'antd/lib/icon/style/css'; // for css
import Button from 'antd/lib/button'; // for js
import 'antd/lib/button/style/css'; // for css
import DefaultLayout from '../../layouts/default/default-layout.jsx';
import AuxFunctions from '../../../api/aux-functions.js';
import InputControlled from '../../components/forms/input-controlled.jsx';

const FormItem = Form.Item;

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const LoginView = (props) => {
  const {
    reduxState,
    handleInputChange,
    handleSubmit,
  } = props;

  const {
    canSubmit,
    email,
    password,
    errors,
  } = reduxState;

  return (
    <DefaultLayout width="350px" padding="20px 15px 0" centered>
      <h1 className="center">Login</h1>
      <p className="center">
        {'Don\'t have an account?'}&nbsp;
        <a href="/signup">Sign Up</a>
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
        <FormItem
          validateStatus={(AuxFunctions.getFieldNameErrors(errors, 'password') && 'error') || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'password')}
        >
          <InputControlled
            type="password"
            id="password"
            addonBefore={<Icon type="lock" />}
            placeholder="Password"
            value={password}
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
          Log In
        </Button>
        <p className="center mt2">
          <a href="/forgot-password">Forgot Password?</a>
        </p>
      </Form>
    </DefaultLayout>
  );
};

LoginView.propTypes = {
  reduxState: PropTypes.shape({
    canSubmit: PropTypes.bool.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    errors: PropTypes.shape({
      email: PropTypes.array.isRequired,
      password: PropTypes.array,
    }).isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export default LoginView;
