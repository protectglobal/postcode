import React, { PropTypes } from 'react';
import DefaultLayout from '../../layouts/default/default-layout.jsx';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const LinkExpiredView = (props) => {
  const {
    reduxState,
    meteorData,
    handleResendConfirmationLinkClick,
  } = props;

  const { loading, errors } = reduxState;
  const { loggedIn } = meteorData;

  const text = loggedIn ? (
    <p className="center">
      Please, click here to&nbsp;
      <a href="" onClick={handleResendConfirmationLinkClick}>
        resend confirmation link
      </a>.
    </p>
  ) : (
    <p className="center">
      Please, <a href="/login">login</a> to be able to <strong>resend confirmation link</strong>.
    </p>
  );

  return (
    <DefaultLayout width="600px" padding="20px 15px 0" centered>
      <h1 className="center">The link has expired!</h1>
      {text}
      {loading && (
        <p className="center mt2">loading...</p>
      )}
    </DefaultLayout>
  );
};

LinkExpiredView.propTypes = {
  reduxState: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    errors: PropTypes.shape({
      email: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  meteorData: PropTypes.shape({
    loggedIn: PropTypes.bool.isRequired,
  }).isRequired,
  handleResendConfirmationLinkClick: PropTypes.func.isRequired,
};

export default LinkExpiredView;
