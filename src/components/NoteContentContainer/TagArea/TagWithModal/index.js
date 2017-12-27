// @flow
import * as React from 'react';
import { Tag, Popover, Button } from 'antd';
import TagRelationModal from './TagRelationModal';
import './style.css';

type Props = {
  currentTag: string,
  allTags: Array<string>,
  addTagRelation: (source: string, target: string, relation: string) => mixed,
  deleteTagRelation: (source: string, target: string, relation: string) => mixed,
  updateTagRelation: (source: string, target: string, relation: string) => mixed,
  currentTagRelations: Array<{related: string, relation: string}>,
  handleClose: (tag: string) => mixed
}

type State = {
  modalVisible: boolean
}

export default class TagRelationCard extends React.Component<Props, State> {
  state = {
    modalVisible: false
  }

  handleSeeModal = () => {
    this.setState({ modalVisible: true });
  }

  handleModalCanceled = () => {
    this.setState({ modalVisible: false });
  }

  render() {
    const tag = this.props.currentTag;
    const isLongTag = tag.length > 20;
    return (
      <span>
        <Popover content={<Button onClick={this.handleSeeModal} icon="ellipsis">Related Tags</Button>}>
          <Tag key={tag} closable={true} afterClose={() => this.props.handleClose(tag)} className="old-tag">
            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
          </Tag>
        </Popover>
        <TagRelationModal
          title="Related Tags"
          allTags={this.props.allTags}
          addTagRelation={this.props.addTagRelation}
          deleteTagRelation={this.props.deleteTagRelation}
          updateTagRelation={this.props.updateTagRelation}
          currentTagRelations={this.props.currentTagRelations}
          currentTag={tag}
          visible={this.state.modalVisible}
          onCancel={this.handleModalCanceled}
        />
      </span>
    );
  }
}
