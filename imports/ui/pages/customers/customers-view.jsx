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
const CustomersView = (props) => {
  // Destructure
  const {
    meteorData: {
      customers,
    },
  } = props;

  // Table columns, see: https://ant.design/components/table/
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Postal code',
      dataIndex: 'postalCode',
      key: 'postalCode',
    },
    {
      title: 'Phone number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Created at',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];

  return (
    <DefaultLayout width="1200px" padding="20px 15px 0">
      <Table
        columns={columns}
        dataSource={customers}
        bordered
        scroll={{ x: 300 }}
      />
    </DefaultLayout>
  );
};

CustomersView.propTypes = {
  meteorData: PropTypes.shape({
    customersReady: PropTypes.bool.isRequired,
    customers: PropTypes.array.isRequired,
  }).isRequired,
};

export default CustomersView;
