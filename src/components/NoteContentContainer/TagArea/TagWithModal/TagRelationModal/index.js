// @flow
import * as React from 'react';
import { Input, Modal, List, Card, Button, Select } from 'antd';
import TagRelationCard from './TagRelationCard';
import './style.css';

const Option = Select.Option;
const { TextArea } = Input;

type Props = {
  allTags: Array<string>,
  currentTag: string,
  addTagRelation: (source: string, target: string, relation: string) => mixed,
  deleteTagRelation: (source: string, target: string, relation: string) => mixed,
  updateTagRelation: (source: string, target: string, relation: string) => mixed,
  currentTagRelations: Array<{related: string, relation: string}>, // relations of current tag
  title: string,
  visible: boolean,
  onCancel: () => mixed
}

type State = {
  adding: boolean,
  addRelated: string,
  addRelation: string,
  canAdd: boolean
}

export default class TagRelationModal extends React.Component<Props, State> {
  state = {
    adding: false,
    addRelated: '',
    addRelation: '',
    canAdd: false
  }

  handleAdd = () => {
    this.setState({ adding: true });
  }

  handleAddConfirmed = () => {
    const source = this.props.currentTag;
    const target = this.state.addRelated;
    const relation = this.state.addRelation;
    this.props.addTagRelation(source, target, relation);
    this.setState({ adding: false, canAdd: false });
  }

  handleAddCanceled = () => {
    this.setState({ adding: false, canAdd: false });
  }

  handleRelatedChange = (value: string) => {
    this.setState({ addRelated: value, canAdd: true });
  }

  handleRelationChange = (e: SyntheticEvent<HTMLInputElement>) => {
    this.setState({ addRelation: e.currentTarget.value });
  }

  render() {
    const existedTags = this.props.currentTagRelations.map((relation) => relation.related);
    const tags = this.props.allTags.filter(tag => (tag !== this.props.currentTag && existedTags.indexOf(tag) === -1));
    const content = (
      <div>
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={this.props.currentTagRelations}
          renderItem={item => (
            <List.Item>
              <TagRelationCard
                related={item.related}
                currentRelation={item.relation}
                currentTag={this.props.currentTag}
                updateTagRelation={this.props.updateTagRelation}
                deleteTagRelation={this.props.deleteTagRelation}
              />
            </List.Item>
          )}
        />
        {this.state.adding && (
          <Card
            title={
              <Select
                showSearch
                placeholder="Select a tag"
                optionFilterProp="children"
                style={{ minWidth: '180px' }}
                onChange={this.handleRelatedChange}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {tags.map((tag, index) => <Option value={tag}>{tag}</Option>)}
              </Select>
            }
            actions={[<Button icon="check" onClick={this.handleAddConfirmed} disabled={!this.state.canAdd} />, <Button icon="close" onClick={this.handleAddCanceled} />]}
          >
            <TextArea value={this.state.addRelation} onPressEnter={this.handleAddConfirmed} onChange={this.handleRelationChange} defaultValue="Describe the relation" />
          </Card>
        )}
        {!this.state.adding && (
          <Card>
            <Button icon="plus" onClick={this.handleAdd}>Add</Button>
          </Card>
        )}
      </div>
    );
    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        footer={null}
        onCancel={this.props.onCancel}
      >
        {content}
      </Modal>
    );
  }
}
