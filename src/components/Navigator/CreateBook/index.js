// @flow
import * as React from 'react';
import { Button, Popover, Input, Menu } from 'antd';
import './style.css';

type Props = {
  createBook: (title: string) => mixed,
  defaultTitle: string
}

type State = {
  titleChanged: boolean,
  editorVisible: boolean,
  currentTitle: string
}

export default class CreateBook extends React.Component<Props, State> {
  state = {
    titleChanged: false,
    editorVisible: false,
    currentTitle: this.props.defaultTitle
  }

  handleTitleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const newTitle = e.currentTarget.value;
    this.setState({ titleChanged: true, currentTitle: newTitle });
  }

  handleOk = () => {
    const newTitle = this.state.titleChanged ? this.state.currentTitle : this.props.defaultTitle;
    this.props.createBook(newTitle);
    this.setState({
      editorVisible: false,
    });
  }

  hide = () => {
    this.setState({
      editorVisible: false,
    });
  }

  handleVisibleChange = (editorVisible: boolean) => {
    this.setState({ editorVisible });
  }

  render() {
    const currentTitle = this.state.titleChanged ? this.state.currentTitle : this.props.defaultTitle;
    return (
      <Menu.Item
        {...this.props}
        key="__createBook"
        title="create a new book"
        style={{ paddingLeft: '0px' }}
      >
        <Popover
          content={
            <div>
              <Input value={currentTitle} onChange={this.handleTitleChange} onPressEnter={this.handleOk} />
              <Button type="primary" onClick={this.handleOk} style={{ marginTop: '10px', marginRight: '10px' }}>Create</Button><Button onClick={this.hide}>Cancel</Button>
            </div>
          }
          title="Input book title"
          trigger="click"
          visible={this.state.editorVisible}
          onVisibleChange={this.handleVisibleChange}
        >
          <div className="bottomButton">
            <Button size="large" icon="plus-circle-o" className="add-book">create a new book</Button>
          </div>
        </Popover>
      </Menu.Item>
    );
  }
}
