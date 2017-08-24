import React, { PropTypes } from 'react';
// import { EJSON } from 'meteor/ejson';
import Table from 'antd/lib/table'; // for js
import 'antd/lib/table/style/css'; // for css
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
    // state,
    // reduxState,
    meteorData,
    handleEditInstallerButtonClick,
    /* handleFilterDropdownVisibleChange,
    handleSearchTextChange,
    handleFilter, */
  } = props;

  /* const {
    addInstallerModalVisible,
    editInstallerModalVisible,
  } = reduxState; */

  const {
    installers,
    /* filter,
    filterDropdownVisible,
    siteUrlSearchText,
    nameSearchText,
    aboutSearchText, */
  } = meteorData;

  // Table columns, see: https://ant.design/components/table/
  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      render: url => (
        <img
          src={url}
          alt="company logo"
          className={style.logo}
        />
      ),
    },
    {
      title: 'Company name',
      dataIndex: 'companyName',
      key: 'companyName',
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
    },
    {
      title: 'Edit',
      key: 'edit',
      render: (text, record) => (
        <a
          href="#"
          onClick={(e) => {
            // When the edit button is clicked the modal is open and the form
            // is pre-filled using the record data
            e.preventDefault();
            handleEditInstallerButtonClick(record);
          }}
        >
          Edit
        </a>
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
      />
    </DefaultLayout>
  );
};

InstallersView.propTypes = {
  meteorData: PropTypes.shape({
    curUser: PropTypes.object,
    installersReady: PropTypes.bool.isRequired,
    installers: PropTypes.array.isRequired,
  }).isRequired,
  /* reduxState: PropTypes.shape({
    addInstallerModalVisible: PropTypes.bool.isRequired,
    editInstallerModalVisible: PropTypes.bool.isRequired,
  }).isRequired, */
  /* state: PropTypes.shape({
    filter: PropTypes.string.isRequired,
    filterDropdownVisible: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    siteUrlSearchText: PropTypes.string.isRequired,
    nameSearchText: PropTypes.string.isRequired,
    aboutSearchText: PropTypes.string.isRequired,
  }).isRequired, */
  handleEditInstallerButtonClick: PropTypes.func.isRequired,
  /* handleFilterDropdownVisibleChange: PropTypes.func.isRequired,
  handleSearchTextChange: PropTypes.func.isRequired,
  handleFilter: PropTypes.func.isRequired, */
};

export default InstallersView;
