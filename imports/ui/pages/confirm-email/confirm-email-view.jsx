import React, { PropTypes } from 'react';
import DefaultLayout from '../../layouts/default/default-layout.jsx';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const ConfirmEmailView = (props) => {
  const {
    reduxState,
    handleResendConfirmationLinkClick,
  } = props;

  const { loading, errors } = reduxState;

  return (
    <DefaultLayout width="600px" padding="20px 15px 0" centered>
      <h1 className="center">Thanks for joining!</h1>
      <p className="center mt1">
        <strong>Check your email</strong> and click on the link provided to confirm your account.
        <br />
        If you did not receive an email, click here to&nbsp;
        <a href="" onClick={handleResendConfirmationLinkClick}>
          resend confirmation link
        </a>.
      </p>
      {loading && (
        <p className="center mt2">loading...</p>
      )}
    </DefaultLayout>
  );
};

ConfirmEmailView.propTypes = {
  reduxState: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    errors: PropTypes.shape({
      email: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  handleResendConfirmationLinkClick: PropTypes.func.isRequired,
};

export default ConfirmEmailView;
