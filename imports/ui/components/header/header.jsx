import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { without } from 'underscore';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';
import Icon from 'antd/lib/icon'; // for js
import 'antd/lib/icon/style/css'; // for css
import Popover from 'antd/lib/popover'; // for js
import 'antd/lib/popover/style/css'; // for css
import Constants from '../../../api/constants.js';
import AuxFunctions from '../../../api/aux-functions.js';
import style from './style.scss';

//------------------------------------------------------------------------------
// GLOBALS:
//------------------------------------------------------------------------------
const hideOnMobile = 'xs-hide sm-hide md-hide';
const hideOnDesktop = 'lg-hide';
//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
class Header extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.state = {
      menuOpen: false,
    };
  }

  handleLogout(e) {
    e.preventDefault();
    Meteor.logout();
  }

  toggleMenu(e) {
    e.preventDefault();
    const prevState = this.state.menuOpen;
    this.setState({ menuOpen: !prevState });
  }

  renderLinks() {
    const { meteorData } = this.props;
    const { curUserId, loggedIn, curRoute } = meteorData;

    // Display header links based on user login state and roles
    const routes = without(Constants.AUTH_ROUTES, 'confirm-email').map(route => {
      const noDashes = AuxFunctions.replaceDashWithSpace(route);
      return {
        text: AuxFunctions.toTitleCase(noDashes), // eg 'Edit Pages'
        key: route, // eg 'edit-pages'
        roles: Constants[`${AuxFunctions.toUpperCaseLowDash(noDashes)}_PAGE_ROLES`], // eg Constants.EDIT_PAGES_PAGE_ROLES
        active: curRoute === AuxFunctions.toCamelCase(noDashes), // curRoute === 'editPages'
      };
    });

    const links = routes.map(({ text, key, roles, active }) => {
      if (loggedIn && Roles.userIsInRole(curUserId, roles)) {
        return (
          <a
            key={key}
            href="#"
            className={`${style.link} ${active && style.activeBgColor}`}
            onClick={(evt) => {
              evt.preventDefault();
              FlowRouter.go(`/${key}`);
            }}
          >
            {text}
          </a>
        );
      }
      return null;
    });

    return links;
  }

  renderToggle() {
    const { meteorData } = this.props;
    const { loggedIn } = meteorData;

    if (!loggedIn) {
      return null;
    }

    return (
      <a href="#" className="h4" onClick={this.toggleMenu}>
        <Icon className={hideOnDesktop} type={`${this.state.menuOpen ? 'menu-unfold' : 'menu-fold'}`} />
      </a>
    );
  }

  renderMenu() {
    const { meteorData } = this.props;
    const { loggedIn } = meteorData;

    if (!loggedIn) {
      return null;
    }

    return (
      <div className={`${style.menu} ${hideOnDesktop} ${this.state.menuOpen ? 'block' : 'hide'}`}>
        {this.renderLinks()}
      </div>
    );
  }

  renderUserName() {
    const { meteorData } = this.props;
    const { loggedIn, curUser } = meteorData;

    if (!loggedIn) {
      return '';
    }

    // User name and functionality
    const popoverContent = (
      <div>
        <a href="" onClick={this.handleLogout}>Logout</a>
      </div>
    );

    const userName = curUser.profile.name;
    const content = (
      <Popover content={popoverContent} trigger="click">
        <span className={style.username}>
          {userName.length <= 7 ? userName : `${userName.slice(0, 7)}...`}
          &nbsp;<Icon type="down" />
        </span>
      </Popover>
    );

    return content;
  }

  render() {
    return (
      <header className={style.Header}>
        {/* Mobile view */}
        {this.renderToggle()}
        <a href="/home" className={`${hideOnDesktop} flex-auto center`}>{Constants.SITE_BRAND}</a>
        <span className={`${hideOnDesktop}`}>{this.renderUserName()}</span>
        {this.renderMenu()}
        {/* Desktop view */}
        <a href="/home" className={`${hideOnMobile} mr3`}>{Constants.SITE_BRAND}</a>
        <div className={`${hideOnMobile} inline-block flex-auto`}>{this.renderLinks()}</div>
        <span className={hideOnMobile}>{this.renderUserName()}</span>
      </header>
    );
  }
}

Header.propTypes = {
  meteorData: PropTypes.shape({
    curUserId: PropTypes.string,
    curUser: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    curRoute: PropTypes.string.isRequired,
  }).isRequired,
};
//------------------------------------------------------------------------------
// PAGE CONTAINER DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'Page' component to handle Domain State Meteor
* reactivity (component-level subscriptions etc etc), and pass data down to
* 'Page' component.
*/
const HeaderContainer = createContainer(() => {
  const curUser = Meteor.user();
  const curRoute = FlowRouter.current().route.name || '';

  return {
    meteorData: {
      curUserId: Meteor.userId(),
      curUser,
      loggedIn: !!curUser,
      curRoute,
    },
  };
}, Header);

export default HeaderContainer;
