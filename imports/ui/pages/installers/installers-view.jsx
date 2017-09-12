import React, { PropTypes } from 'react';
// import { EJSON } from 'meteor/ejson';
import _ from 'underscore';
import Table from 'antd/lib/table'; // for js
import 'antd/lib/table/style/css'; // for css
import Tag from 'antd/lib/tag'; // for js
import 'antd/lib/tag/style/css'; // for css
import Button from 'antd/lib/button'; // for js
import 'antd/lib/button/style/css'; // for css
import Popconfirm from 'antd/lib/popconfirm'; // for js
import 'antd/lib/popconfirm/style/css'; // for css
import Constants from '../../../api/constants';
import DefaultLayout from '../../layouts/default/default-layout';
import SelectControlled from '../../components/forms/select-controlled';
import AddInstallerModal from '../../components/installers/add-installer-modal';
import EditInstallerModal from '../../components/installers/edit-installer-modal';
import style from './style.scss';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const InstallersView = (props) => {
  const {
    meteorData,
    handleEditInstallerButtonClick,
    handleDeleteInstallerButtonClick,
  } = props;

  const {
    installersReady,
    installers,
  } = meteorData;

  // Table columns, see: https://ant.design/components/table/
  const columns = [
    {
      title: 'Company name',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      render: ({ url, secureUrl }) => (
        <img
          src={secureUrl || url || '/camera-image.svg'}
          alt="company logo"
          className={style.logo}
        />
      ),
    },
    {
      title: 'Address 1',
      dataIndex: 'addressOne',
      key: 'addressOne',
    },
    {
      title: 'Address 2',
      dataIndex: 'addressTwo',
      key: 'addressTwo',
    },
    {
      title: 'Postal code',
      dataIndex: 'postalCode',
      key: 'postalCode',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
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
      title: 'Postal areas',
      dataIndex: 'postalAreas',
      key: 'postalAreas',
      width: '200px',
      render: (text, record) => {
        const areas = [];
        _.each(record.postalAreas, (pa) => {
          areas.push(<Tag color="pink" key={pa}>{pa}</Tag>);
        });
        return (
          <div
            style={{
              maxWidth: '200px',
              maxHeight: '180px',
              overflow: 'auto',
            }}
          >
            {areas}
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          <Button
            type="primary"
            onClick={() => {
              // When the edit button is clicked the modal is open and the form
              // is pre-filled using the record data
              handleEditInstallerButtonClick(record);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Sure you want to delete this installer?"
            onConfirm={() => { handleDeleteInstallerButtonClick(record._id); }}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="danger"
              className="ml1"
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <DefaultLayout width="1500px" padding="20px 15px 0">
      <AddInstallerModal />
      <EditInstallerModal />
      <Table
        className="mt2"
        columns={columns}
        dataSource={installers}
        bordered
        scroll={{ x: 800 }}
        loading={!installersReady}
      />
    </DefaultLayout>
  );
};

InstallersView.propTypes = {
  meteorData: PropTypes.shape({
    curUser: PropTypes.object,
    installersReady: PropTypes.bool.isRequired,
    installers: PropTypes.arrayOf(
      PropTypes.shape({
        companyName: PropTypes.string.isRequired,
        logo: PropTypes.oneOfType([
          PropTypes.shape({}),
          PropTypes.shape({
            publicId: PropTypes.string.isRequired,
            resourceType: PropTypes.string.isRequired,
            format: PropTypes.string.isRequired,
            bytes: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired,
            width: PropTypes.number.isRequired,
            url: PropTypes.string.isRequired,
            secureUrl: PropTypes.string.isRequired,
          }),
        ]),
        addressOne: PropTypes.string.isRequired,
        addressTwo: PropTypes.string.isRequired,
        postalCode: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        phoneNumber: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        postalAreas: PropTypes.array.isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
  handleEditInstallerButtonClick: PropTypes.func.isRequired,
  handleDeleteInstallerButtonClick: PropTypes.func.isRequired,
};

export default InstallersView;
