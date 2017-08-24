import React, { PropTypes } from 'react';
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
const UsersView = (props) => {
  // Destructure
  const {
    meteorData: {
      curUserId,
      usersReady,
      users,
    },
    handleRoleChange,
    handleDeactivate,
  } = props;

  // Table columns, see: https://ant.design/components/table/
  const columns = [
    {
      title: 'User Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (text, record) => (
        <SelectControlled
          id={record._id}
          dropdownMatchSelectWidth={false}
          value={record.role}
          options={Constants.ALL_ROLES}
          onChange={handleRoleChange}
          disabled={record._id === curUserId}
        />
      ),
    },
    {
      title: 'Deactivate',
      key: 'action',
      render: (text, record) => {
        // Prevent the user to deactivate its own account
        if (record._id === curUserId) {
          return (
            <Button type="danger" disabled>
              Deactivate
            </Button>
          );
        }

        return (
          <Popconfirm
            title="Sure you want to deactivate this account?"
            onConfirm={() => { handleDeactivate(record._id); }}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">
              Deactivate
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <DefaultLayout width="1200px" padding="20px 15px 0">
      <Table
        columns={columns}
        dataSource={users}
        bordered
        scroll={{ x: 300 }}
        loading={!usersReady}
      />
    </DefaultLayout>
  );
};

UsersView.propTypes = {
  meteorData: PropTypes.shape({
    curUser: PropTypes.object,
    usersReady: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
  }).isRequired,
  handleRoleChange: PropTypes.func.isRequired,
  handleDeactivate: PropTypes.func.isRequired,
};

export default UsersView;
