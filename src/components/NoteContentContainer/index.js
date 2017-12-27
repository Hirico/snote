// @flow

import * as React from 'react';
import { Layout, Icon, Input, Tooltip, Popconfirm } from 'antd';
import NoteEditor from '../NoteEditor';
import TagArea from './TagArea';
import './style.css';

const { Content, Header } = Layout;

type Props = {
  editorStateRaw: ?{},
  saveContent: ({}) => mixed,
  savingVisibility: string,
  title: string,
  changeTitle: (event: SyntheticEvent<HTMLInputElement>) => mixed,
  theme: string,
  changeTheme: () => mixed,
  tags: Array<string>,
  allTags: Array<string>,
  addTag: (tname: string) => mixed,
  deleteTag: (tname: string) => mixed,
  cookies: { get: Function },
  logOut: () => mixed
}

export default class NoteContentContainer extends React.Component<Props> {
  render() {
    const iconClassNames = `icon ${this.props.theme}`;
    const toolbar = (
      <ul>
        <a id="logOut">
          <Popconfirm title="Are you sure to log out?" onConfirm={this.props.logOut} okText="Yes" cancelText="No">
            <Tooltip title="log out">
              <Icon type="logout" className={iconClassNames} />
            </Tooltip>
          </Popconfirm>
        </a>
        <Tooltip title="change theme">
          <a id="themeChanger">
            <Icon type="skin" className={iconClassNames} onClick={this.props.changeTheme} />
          </a>
        </Tooltip>
      </ul>
    );

    const headerClassNames = `Header textArea ${this.props.theme}`;
    const editorClassNames = `textArea ${this.props.theme}`;
    const layoutClassNames = `backGround ${this.props.theme}`;
    const tagClassNames = `textArea ${this.props.theme}`;
    if (this.props.editorStateRaw !== null) {
      return (
        <Layout className={layoutClassNames}>
          <div id="NoteContentContainer">
            <div className="saveHintHeader" style={{ visibility: this.props.savingVisibility }}>
              <Icon type="loading" /> auto saving
            </div>
            {toolbar}
            <Header className={headerClassNames}>
              <Input size="large" spellcheck="false" placeholder="Input your title" style={{ height: '100%', border: '#ffffff', padding: '6px 7px 6px 12px' }} value={this.props.title} onChange={this.props.changeTitle} />
            </Header>
            <Content style={{ height: 'calc(100vh - 144px)' }}>
              <TagArea
                tags={this.props.tags}
                addTag={this.props.addTag}
                deleteTag={this.props.deleteTag}
                className={tagClassNames}
                cookies={this.props.cookies}
                allTags={this.props.allTags}
              />
              <NoteEditor
                className={editorClassNames}
                editorStateRaw={this.props.editorStateRaw}
                saveContent={this.props.saveContent}
              />
            </Content>
          </div>
        </Layout>);
    }
    return (
      <Layout className={layoutClassNames}>
        <div id="NoteContentContainer">
          <div className="noContent">
            <Content><p>To start, create or select a chapter from the left menu</p></Content>
          </div>
          {toolbar}
        </div>
      </Layout>);
  }
}
