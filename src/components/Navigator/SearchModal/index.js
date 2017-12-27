// @flow
import * as React from 'react';
import { Select, Modal, Button, Tag, Input, Icon } from 'antd';
import './style.css';

const Option = Select.Option;

type Props = {
  visible: boolean,
  searchByTitle: (title: string) => mixed,
  searchByContent: (content: string) => mixed,
  searchByTags: (tags: Array<string>) => mixed,
  onCancel: () => mixed,
  tags: Array<string>
}

type State = {
  searchMethod: string,
  input: string,
  inputTags: Array<string>
}

export default class SearchModal extends React.Component<Props, State> {
  state = {
    searchMethod: 'search by title',
    input: '',
    inputTags: []
  }

  handleOk = () => {
    switch (this.state.searchMethod) {
      case 'search by title':
        this.props.searchByTitle(this.state.input);
        break;
      case 'search by content':
        this.props.searchByContent(this.state.input);
        break;
      case 'search by tag': {
        this.props.searchByTags(this.state.inputTags);
        break;
      }
      default:
        console.log('!ERROR: unknown search method');
    }
    this.props.onCancel();
  }

  handleChangeMethod = (value: string) => {
    this.setState({ searchMethod: value });
  }

  handleInputChange = (e: SyntheticEvent<HTMLInputElement>) => {
    this.setState({ input: e.currentTarget.value });
  }

  handleTagChange = (value: Array<string>) => {
    this.setState({ inputTags: value });
  }

  render() {
    const children = (this.state.searchMethod === 'search by tag') ? (this.props.tags.map((tag, index) => (
      <Option key={tag}>{tag}</Option>
    ))) : '';

    return (
      <Modal
        title="Search chapter"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.props.onCancel}
      >
        <Select defaultValue="search by title" onChange={this.handleChangeMethod}>
          <Option value="search by tag">Search by tag</Option>
          <Option value="search by title">Search by title</Option>
          <Option value="search by content">Search by content</Option>
        </Select>
        {(this.state.searchMethod === 'search by tag') ?
          <Select
            mode="tags"
            style={{ width: '300px' }}
            onChange={this.handleTagChange}
            tokenSeparators={[',']}
          >
            {children}
          </Select> :
          <Input
            spellCheck="false"
            style={{ width: '300px' }}
            value={this.state.input}
            onChange={this.handleInputChange}
          />
        }
      </Modal>
    );
  }
}
