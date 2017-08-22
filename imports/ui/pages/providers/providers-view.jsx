import React, { PropTypes } from 'react';
// import { EJSON } from 'meteor/ejson';
import Table from 'antd/lib/table'; // for js
import 'antd/lib/table/style/css'; // for css
import Button from 'antd/lib/button'; // for js
import 'antd/lib/button/style/css'; // for css
import Popconfirm from 'antd/lib/popconfirm'; // for js
import 'antd/lib/popconfirm/style/css'; // for css
import DefaultLayout from '../../layouts/default/default-layout';
import SelectControlled from '../../components/forms/select-controlled';
import Constants from '../../../api/constants';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const ProvidersView = (props) => {
  return (
    <DefaultLayout width="1200px" padding="20px 15px 0">
      <div>
        <h1 className="center">Providers Page</h1>
      </div>
    </DefaultLayout>
  );
};

ProvidersView.propTypes = {
};

export default ProvidersView;
