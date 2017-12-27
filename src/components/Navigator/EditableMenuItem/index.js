// @flow
import React, { Component } from 'react';
import { Menu, Button, Popconfirm, message } from 'antd';
import './style.css';

type Props = {
  object: {
    title: string,
    cid: string | number
  };
  bid: string | number,
  openContent: (cid: string | number, bid: string|number, title: string) => mixed,
  deleteChapter: (bid: string | number, cid: string | number) => mixed
};

type State = {
  mouseEntered: boolean
}

export default class EditableMenuItem extends Component<Props, State> {
  state = {
    mouseEntered: false,
  }

  handleOpen = () => {
    const bid = this.props.bid;
    const title = this.props.object.title;
    const cid = this.props.object.cid;
    this.props.openContent(cid, bid, title);
  };

  handleDelete = (e: Event) => {
    e.stopPropagation();
    const cid = this.props.object.cid;
    const bid = this.props.bid;
    this.props.deleteChapter(bid, cid);
    message.success(`Deleted ${this.props.object.title}`);
  };

  handleMouseEnter = () => {
    this.setState({ mouseEntered: true });
  }

  handleMouseLeave = () => {
    this.setState({ mouseEntered: false });
  }

  preventProp = (e: Event) => {
    e.stopPropagation();
  }

  render() {
    let buttonComponents = '';
    if (this.state.mouseEntered) {
      buttonComponents = (
        <span>
          <Popconfirm title="Are you sure to delete this chapter?" onClick={this.preventProp} onConfirm={this.handleDelete} onCancel={this.preventProp} okText="Yes" cancelText="No">
            <Button className="menuItemButton" icon="delete" title="delete" />
          </Popconfirm>
        </span>);
    }
    return (
      <Menu.Item
        {...this.props}
        key={this.props.object.title}
        title={this.props.object.title}
        onClick={this.handleOpen}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.props.object.title}{buttonComponents}
      </Menu.Item>
    );
  }
}
