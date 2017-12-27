// @flow
import * as React from 'react';
import { Input, Card, Button, Icon } from 'antd';
import './style.css';

type Props = {
  currentTag: string,
  related: string,
  deleteTagRelation: (source: string, target: string, relation: string) => mixed,
  updateTagRelation: (source: string, target: string, relation: string) => mixed,
  currentRelation: string
}

type State = {
  editing: boolean,
  relation: string
}

export default class TagRelationCard extends React.Component<Props, State> {
  state = {
    editing: false,
    relation: this.props.currentRelation,
  }

  handleEdit = () => {
    this.setState({ editing: true });
  }

  handleEditConfirmed = () => {
    const source = this.props.currentTag;
    const target = this.props.related;
    const relation = this.state.relation;
    this.props.updateTagRelation(source, target, relation);
    this.setState({ editing: false });
  }

  handleEditCanceled = () => {
    this.setState({ editing: false, relation: this.props.currentRelation });
  }

  handleDelete = () => {
    const source = this.props.currentTag;
    const target = this.props.related;
    const relation = this.props.currentRelation;
    this.props.deleteTagRelation(source, target, relation);
  }

  handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    this.setState({ relation: e.currentTarget.value });
  }

  render() {
    return (
      <Card
        style={{ width: '160px' }}
        title={<span><Icon type="tag" />{this.props.related}</span>}
        actions={
          this.state.editing ? [<Button icon="check" onClick={this.handleEditConfirmed} />, <Button icon="close" onClick={this.handleEditCanceled} />] :
            [<Button icon="edit" onClick={this.handleEdit} />, <Button icon="delete" onClick={this.handleDelete} />]
        }
      >
        <div style={{ height: '120px' }}>
          {
            this.state.editing ? (<Input value={this.state.relation} onChange={this.handleChange} onPressEnter={this.handleEditConfirmed} />) :
              this.props.currentRelation
          }
        </div>
      </Card>
    );
  }
}
