// @flow
import * as React from 'react';
import { Menu, Icon, Divider, Tabs } from 'antd';
import EditableSubMenu from './EditableSubMenu';
import CreateBook from './CreateBook';
import SearchModal from './SearchModal';
import './style.css';

const TabPane = Tabs.TabPane;

type Props = {
  firstLevelObjects:
    Array<{title: string, children: Array<{title: string, cid: string | number}>,
      id: string | number}>,
  addBook: (title: string) => mixed,
  openContent: (cid: string | number, bid: string | number, title: string) => mixed,
  addChapter: (title: string, bid: string | number) => mixed,
  deleteChapter: (cid: string | number) => mixed,
  deleteBook: (bid: string | number) => mixed,
  addLink: (bid: string | number, cid: string | number) => mixed,
  searchByTitle: (title: string) => mixed,
  searchByTags: (tags: Array<string>) => mixed,
  searchByContent: (content: string) => mixed,
  searchResult: Array<{title: string, children: Array<{title: string, cid: string | number}>,
    id: string | number}>,
  tags: Array<string>
}

type State = {
  chapterModalVisible: boolean,
  searchModalVisible: boolean
}

class Navigator extends React.Component<Props, State> {
  state = {
    chapterModalVisible: false,
    searchModalVisible: false
  }

  getDefaultBookTitle = () => {
    const titles = [];
    for (let i = 0; i < this.props.firstLevelObjects.length; i += 1) {
      titles.push(this.props.firstLevelObjects[i].title);
    }
    let appendix = 0;
    let newDefaultTitle = 'new book';
    while (titles.indexOf(newDefaultTitle) !== -1) {
      appendix += 1;
      newDefaultTitle = `new book${appendix}`;
    }
    console.log(`newTitle ${newDefaultTitle}`);
    return newDefaultTitle;
  }

  handleAddBook = (title: string) => {
    // call addBook
    this.props.addBook(title);
  }

  handleTabChange = (key: string) => {
    if (key === '2') {
      this.setState({ searchModalVisible: true });
    }
  }

  cancelSearch = () => {
    this.setState({ searchModalVisible: false });
  }

  render() {
    const subMenus = [];
    [...this.props.firstLevelObjects].forEach((object) => {
      subMenus.push(
        <EditableSubMenu
          object={object}
          subMenuKey={object.title}
          openContent={this.props.openContent}
          addChapter={this.props.addChapter}
          deleteBook={this.props.deleteBook}
          deleteChapter={this.props.deleteChapter}
          addLink={this.props.addLink}
          books={this.props.firstLevelObjects}
        />
      );
    });

    const searchResultSubMenus = [];
    [...this.props.searchResult].forEach((object) => {
      searchResultSubMenus.push(
        <EditableSubMenu
          object={object}
          subMenuKey={object.title}
          openContent={this.props.openContent}
          addChapter={this.props.addChapter}
          deleteBook={this.props.deleteBook}
          deleteChapter={this.props.deleteChapter}
          addLink={this.props.addLink}
          books={this.props.searchResult}
        />
      );
    });

    const defaultNewBookTitle: string = this.getDefaultBookTitle();

    return (
      <div className="Navigator">
        <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
          <TabPane tab={<span><Icon type="ellipsis" />All</span>} key="1">
            <Menu
              mode="inline"
            >
              {subMenus}
              <Divider />
              <CreateBook createBook={this.handleAddBook} defaultTitle={defaultNewBookTitle} />
            </Menu>
          </TabPane>
          <TabPane tab={<span><Icon type="search" />Search</span>} key="2">
            <Menu
              mode="inline"
            >
              {searchResultSubMenus}
              <SearchModal
                searchByTitle={this.props.searchByTitle}
                visible={this.state.searchModalVisible}
                onCancel={this.cancelSearch}
                searchByContent={this.props.searchByContent}
                searchByTags={this.props.searchByTags}
                tags={this.props.tags}
              />
            </Menu>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Navigator;
