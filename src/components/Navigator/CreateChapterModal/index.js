import React, { Component } from 'react';
import { message, Modal, Radio, Tree } from 'antd';
import './style.css';

const TreeNode = Tree.TreeNode;

const RadioGroup = Radio.Group;

type Props = {
  books: Array<{title: string, children: Array<{title: string, cid: string | number}>,
    id: string | number}>,
  visible: boolean,
  createNewDefaultChapter: () => mixed,
  onCancel: () => mixed,
  createLinkedChapter: (cid: string) => mixed,
  bid: string | number
}

type State = {
  modeValue: number,
  selectedCid: string | number
}

export default class CreateChapterModal extends Component<Props, State> {
  state = {
    modeValue: 1,
    selectedCid: -1
  }

  handleModeChange = (e) => {
    this.setState({
      modeValue: e.target.value,
    });
  }

  handleOk = () => {
    if (this.state.modeValue === 1) {
      this.props.createNewDefaultChapter();
    } else if (this.state.selectedCid === -1) {
      message.error('You need to select an existing chapter');
    } else {
      const cid = this.state.selectedCid;
      this.props.createLinkedChapter(cid);
    }
  }

  handleSelect = (selectedKeys, info) => {
    if (selectedKeys.length !== 0) {
      this.setState({ selectedCid: selectedKeys[0] });
    }
  }

  render() {
    const books = this.props.books.filter(book => book.id !== this.props.bid);
    const tree = (
      <Tree
        onSelect={this.handleSelect}
      >
        {books.map((book, index) => {
          const chapters = (
            book.children.map((chapter, cindex) =>
              (<TreeNode title={chapter.title} key={chapter.cid} />)
            )
          );
          return (
            <TreeNode title={book.title} key={`b${book.id}`} selectable={false}>
              {chapters}
            </TreeNode>
          );
        })}
      </Tree>
    );

    return (
      <Modal
        title="create a new book"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.props.onCancel}
      >
        <RadioGroup onChange={this.handleModeChange} value={this.state.modeValue}>
          <Radio value={1}>New chapter</Radio>
          <Radio value={2}>Link from existing chapter</Radio>
        </RadioGroup>
        {this.state.modeValue === 2
          && tree}
      </Modal>
    );
  }
}
