// @flow
import * as React from 'react';
import { Menu, Icon, Button, Popconfirm, message } from 'antd';
import './style.css';
import EditableMenuItem from '../EditableMenuItem';
import CreateChapterModal from '../CreateChapterModal';

const SubMenu = Menu.SubMenu;

/**
 * Props:
 * 1. object {title:string, children:[title], id}
 * 2. contentChange - a callback to set editorState
 */
type Props = {
  object: {
    title: string,
    children: Array<{title: string, cid: string | number}>,
    id: string | number
  },
  books: Array<{title: string, children: Array<{title: string, cid: string | number}>,
    id: string | number}>,
  addChapter: (title: string, id: string | number) => mixed,
  openContent: (cid: string | number, bid: string | number, title: string) => mixed,
  deleteChapter: (cid: string | number) => mixed,
  deleteBook: (bid: string | number) => mixed,
  addLink: (bid: string | number, cid: string | number) => mixed,
  subMenuKey: string | number
}

type State = {
  mouseEntered: boolean,
  creating: boolean
}

export default class EditableSubMenu extends React.Component<Props, State> {
  state = {
    mouseEntered: true,
    creating: false
  }

  handleAddChapter = () => {
    const titles = [];
    for (let i = 0; i < this.props.object.children.length; i += 1) {
      titles.push(this.props.object.children[i].title);
    }
    let appendix = 0;
    let newDefaultTitle = 'new chapter';
    while (titles.indexOf(newDefaultTitle) !== -1) {
      appendix += 1;
      newDefaultTitle = `new chapter${appendix}`;
    }
    this.setState({ creating: false });
    this.props.addChapter(newDefaultTitle, this.props.object.id);
  };

  handleDelete = (e: Event) => {
    e.stopPropagation();
    const bid = this.props.object.id;
    this.props.deleteBook(bid);
    message.success(`Deleted ${this.props.object.title}`);
  }

  handleMouseEnter = () => {
    this.setState({ mouseEntered: true });
  }

  handleMouseLeave = () => {
    this.setState({ mouseEntered: true });
  }

  preventProp = (e: Event) => {
    e.stopPropagation();
  }

  openCreateModal = () => {
    this.setState({ creating: true });
  }

  cancelCreateModal = () => {
    this.setState({ creating: false });
  }

  createLinkedChapter = (cid: string | number) => {
    const bid = this.props.object.id;
    this.props.addLink(bid, cid);
    this.setState({ creating: false });
  }

  render() {
    const subMenuItems = [];
    [...this.props.object.children].forEach((child) => {
      subMenuItems.push(
        <EditableMenuItem
          object={child}
          openContent={this.props.openContent}
          bid={this.props.object.id}
          deleteChapter={this.props.deleteChapter}
        />
      );
    });
    subMenuItems.push(
      <div>
        <Menu.Item
          {...this.props}
          key={this.props.object.id}
          title="add a chapter"
        >
          <div className="chapterAddButton"><Button icon="plus" onClick={this.openCreateModal} className="add-book">add chapter</Button></div>
        </Menu.Item>
        <CreateChapterModal
          books={this.props.books}
          visible={this.state.creating}
          createNewDefaultChapter={this.handleAddChapter}
          createLinkedChapter={this.createLinkedChapter}
          onCancel={this.cancelCreateModal}
          bid={this.props.object.id}
        />
      </div>
    );

    let buttonComponents = '';
    if (this.state.mouseEntered) {
      buttonComponents = (
        <span>
          <Popconfirm title="Are you sure to delete this book?" onClick={this.preventProp} onConfirm={this.handleDelete} onCancel={this.preventProp} okText="Yes" cancelText="No">
            <Button title="delete" className="menuItemButton" icon="delete" />
          </Popconfirm>
        </span>);
    }

    return (
      <SubMenu
        {...this.props}
        key={this.props.subMenuKey}
        title={<span><Icon type="book" /><span>{this.props.object.title}</span>{buttonComponents}</span>}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {subMenuItems}
      </SubMenu>
    );
  }
}
