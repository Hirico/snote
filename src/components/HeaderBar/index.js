import React, { Component } from 'react';
import Icon from 'antd';
import './style.css';
import logo from './logo.svg';

class HeaderBar extends Component {
  render() {
    return (
      <div className="HeaderBar">
        <Icon
          className="trigger"
          type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
      </div>
    );
  }
}

export default HeaderBar;
