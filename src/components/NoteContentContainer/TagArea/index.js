// @flow
import * as React from 'react';
import { Tag, Input, Tooltip, Icon } from 'antd';
import TagWithModal from './TagWithModal';
import './style.css';

type Props = {
  tags: Array<string>, // tags of current chapter
  allTags: Array<string>,
  addTag: (tname: string) => mixed,
  deleteTag: (tname: string) => mixed,
  className: string,
  cookies: { get: Function }
}

type State = {
  inputVisible: boolean,
  inputValue: string,
  tagRelations: Array<{name: string, relations: Array<{related: string, relation: string}>}> // all relations
}

export default class TagArea extends React.Component<Props, State> {
  state = {
    inputVisible: false,
    inputValue: '',
    tagRelations: []
  }

  componentDidMount = () => {
    this.getTagRelations();
  }

  getTagRelations = () => {
    const { cookies } = this.props;
    const token = cookies.get('token');

    fetch('/apis/gettagrelations', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
      }),
    })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        const fetchedTagRelations = json;
        this.setState({ tagRelations: fetchedTagRelations });
      });
  }

  addTagRelation = (source: string, target: string, relation: string) => {
    const { cookies } = this.props;
    const token = cookies.get('token');

    fetch('/apis/addtagrelation', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        source,
        target,
        relation
      }),
    })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        this.getTagRelations();
      });
  }

  deleteTagRelation = (source: string, target: string, relation: string) => {
    const { cookies } = this.props;
    const token = cookies.get('token');

    fetch('/apis/deletetagrelation', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        source,
        target,
        relation
      }),
    })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        this.getTagRelations();
      });
  }

  updateTagRelation = (source: string, target: string, relation: string) => {
    const { cookies } = this.props;
    const token = cookies.get('token');

    fetch('/apis/updatetagrelation', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        source,
        target,
        relation
      }),
    })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        this.getTagRelations();
      });
  }

  handleClose = (removedTag: string) => {
    this.props.deleteTag(removedTag);
  }

  showInput = () => {
    this.setState({ inputVisible: true });
  }

  handleInputChange = (e: SyntheticEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.currentTarget.value });
  }

  handleInputConfirm = () => {
    const inputValue = this.state.inputValue;
    this.props.addTag(inputValue);
    this.setState({
      inputVisible: false,
      inputValue: '',
    });
  }

  render() {
    const { inputVisible, inputValue } = this.state;
    const tags = this.props.tags;
    return (
      <div className={`${this.props.className}`} id="tag-area">
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          let relations: Array<{related: string, relation: string}> = [];
          for (let i = 0; i < this.state.tagRelations.length; i += 1) {
            const currentTagRelation = this.state.tagRelations[i];
            if (currentTagRelation.name === tag) {
              relations = currentTagRelation.relations;
              break;
            }
          }
          const tagElem = (
            <TagWithModal
              currentTag={tag}
              addTagRelation={this.addTagRelation}
              deleteTagRelation={this.deleteTagRelation}
              updateTagRelation={this.updateTagRelation}
              currentTagRelations={relations}
              handleClose={this.handleClose}
              allTags={this.props.allTags}
            />
          );
          return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
        })}
        {inputVisible && (
          <Input
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag
            onClick={this.showInput}
            style={{ borderStyle: 'dashed' }}
            className="new-tag"
          >
            <Icon type="plus" /> New Tag
          </Tag>
        )}
      </div>
    );
  }
}
