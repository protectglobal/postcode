import React from 'react';
import Constants from '../../../api/constants.js';
import style from './style.scss';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const Footer = () => (
  <footer className={style.Footer}>
    <p>{Constants.SITE_BRAND} ©2017</p>
  </footer>
);

export default Footer;
