import React, { PropTypes } from 'react';
import _ from 'underscore';
import Alert from 'antd/lib/alert'; // for js
import 'antd/lib/alert/style/css'; // for css


//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const FallbackInstallerAlert = ({ installers }) => {
  const fallbackIsSet = _.find(installers, inst => (inst.isFallbackInstaller === true));

  return !fallbackIsSet
    ? (
      <div className="mb1">
        <Alert message="Fallback installer isn't set!!" banner />
      </div>
    )
    : null;
};

FallbackInstallerAlert.propTypes = {
  installers: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      isFallbackInstaller: PropTypes.bool.isRequired,
    }).isRequired,
  ).isRequired,
};

export default FallbackInstallerAlert;
