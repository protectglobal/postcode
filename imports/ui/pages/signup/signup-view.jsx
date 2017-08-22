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
const SignupView = (props) => {
  const {
    reduxState,
    handleInputChange,
    handleSubmit,
  } = props;

  const {
    canSubmit,
    email,
    name,
    password,
    errors,
  } = reduxState;

  return (
    <DefaultLayout width="350px" padding="20px 15px 0" centered>
      <h1 className="center">Sign Up</h1>
      <p className="center">
        Already have an account?&nbsp;
        <a href="/login">Login</a>
      </p>
      <Form
        onSubmit={handleSubmit}
        className="mt2"
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
          validateStatus={(AuxFunctions.getFieldNameErrors(errors, 'name') && 'error') || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'name')}
        >
          <InputControlled
            type="text"
            id="name"
            addonBefore={<Icon type="user" />}
            placeholder="Name"
            value={name}
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
          Sign Up
        </Button>
      </Form>
    </DefaultLayout>
  );
};

SignupView.propTypes = {
  reduxState: PropTypes.shape({
    canSubmit: PropTypes.bool.isRequired,
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    errors: PropTypes.shape({
      email: PropTypes.array.isRequired,
      name: PropTypes.array.isRequired,
      password: PropTypes.array,
    }).isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export default SignupView;
