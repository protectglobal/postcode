import React, { PropTypes } from 'react';
import Table from 'antd/lib/table'; // for js
import 'antd/lib/table/style/css'; // for css
import DefaultLayout from '../../layouts/default/default-layout';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const CustomersView = (props) => {
  // Destructure
  const {
    meteorData: {
      customersReady,
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
      title: 'IP Address',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
    },
    {
      title: 'Created at',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Assignee installer',
      dataIndex: 'installer',
      key: 'installer',
      render: (text, { installer: { _id, companyName } }) => {
        if (_id && companyName) {
          return (
            <p>
              Company id: {_id}
              <br />
              Company name: {companyName}
            </p>
          );
        }
        return null;
      },
    },
    {
      title: 'Email delivery status',
      dataIndex: 'emailDeliveryStatus',
      key: 'emailDeliveryStatus',
    },
  ];

  return (
    <DefaultLayout width="1200px" padding="20px 15px 0">
      <Table
        columns={columns}
        dataSource={customers}
        bordered
        scroll={{ x: 300 }}
        loading={!customersReady}
      />
    </DefaultLayout>
  );
};

CustomersView.propTypes = {
  meteorData: PropTypes.shape({
    customersReady: PropTypes.bool.isRequired,
    customers: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        key: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        postalCode: PropTypes.string.isRequired,
        phoneNumber: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        ipAddress: PropTypes.string.isRequired,
        installer: PropTypes.oneOfType([
          PropTypes.shape({}),
          PropTypes.shape({
            _id: PropTypes.string.isRequired,
            companyName: PropTypes.string.isRequired,
          }),
        ]),
        emailDeliveryStatus: PropTypes.oneOf(['', 'failed', 'sent']),
      }).isRequired,
    ).isRequired,
  }).isRequired,
};

export default CustomersView;
