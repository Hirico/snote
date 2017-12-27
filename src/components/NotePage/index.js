// @flow
import * as React from 'react';
import { withCookies } from 'react-cookie';
import { Layout } from 'antd';
import Navigator from '../Navigator';
import NoteContentContainer from '../NoteContentContainer';
import './style.css';

const { Sider } = Layout;

type Props = {
  cookies: {
    get: Function,
  },
  logOut: () => mixed
}

type State = {
  books: Array<{title: string, id: string|number, children: Array<{title: string, cid: string | number}>}>,
  searchResultBooks: Array<{title: string, id: string|number, children: Array<{title: string, cid: string | number}>}>,
  currentContent: ?{},
  currentTitle: string,
  currentBid: string | number,
  currentCid: string | number,
  currentTags: Array<string>,
  savingVisibility: string,
  collapsed: boolean,
  theme: string,
  tags: Array<string>
}

class NotePage extends React.Component<Props, State> {
  state = {
    books: [],
    searchResultBooks: [],
    collapsed: false,
    currentContent: null,
    theme: 'light',

    // the title of the current opened chapter
    currentTitle: '',

    // the bid of the current opened chapter
    currentBid: -1,
    currentCid: -1,
    savingVisibility: 'hidden',
    currentTags: [],
    tags: []
  }

  componentDidMount = () => {
    this.reFetchBooks();
    this.reFetchTags();
  }

  handleThemeChange = () => {
    if (this.state.theme === 'light') {
      this.setState({
        theme: 'dark'
      });
    } else {
      this.setState({
        theme: 'light'
      });
    }
  }

  reFetchBooks = () => {
    const { cookies } = this.props;
    const token = cookies.get('token');

    fetch('/apis/getbooks', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token
      }),
    })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        const fetchedBooks = json;
        this.setState({ books: fetchedBooks });
      });
  }

  reFetchTags = () => {
    const { cookies } = this.props;
    const token = cookies.get('token');

    fetch('/apis/gettags', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token
      }),
    })
      .then(res => res.json())
      .then(json => {
        console.log(json.info);
        const fetchedTags = json.tags;
        this.setState({ tags: fetchedTags });
      });
  }

  openContent = (cid, bid, title: string) => {
    // check whether in localStorage
    const content = window.localStorage.getItem(`c${cid}`);
    const tags = window.localStorage.getItem(`t${cid}`);
    if (content) {
      this.setState({ currentContent: JSON.parse(content), currentTitle: title, currentBid: bid, currentCid: cid, currentTags: JSON.parse(tags) });
      // console.log(`new state set ${content}`);
    } else {
      // else fetch and store
      const url = '/apis/getchapter';
      fetch(url, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cid
        }),
      })
        .then(res => res.json())
        .then(json => {
          this.setState({ currentContent: JSON.parse(json.content), currentTitle: title, currentBid: bid, currentCid: cid, currentTags: json.tags });
          window.localStorage.setItem(`c${cid}`, json.content);
          window.localStorage.setItem(`t${cid}`, JSON.stringify(json.tags));
        });
    }
  }

  addTag = (tname) => {
    if (tname && this.state.currentTags.indexOf(tname) === -1) {
      const url = '/apis/addtag';
      const cid = this.state.currentCid;
      fetch(url, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tname,
          cid
        }),
      })
        .then(res => res.json())
        .then(json => {
          const currentTags = this.state.currentTags;
          currentTags.push(tname);
          const tags = this.state.tags;
          if (tags.indexOf(tname) === -1) {
            tags.push(tname);
          }
          this.setState({ currentTags, tags });
          window.localStorage.setItem(`t${cid}`, JSON.stringify(currentTags));
        });
    }
  }

  deleteTag = (tname) => {
    const url = '/apis/deletetag';
    const cid = this.state.currentCid;
    fetch(url, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tname,
        cid
      }),
    })
      .then(res => res.json())
      .then(json => {
        const currentTags = this.state.currentTags.filter(tag => tag !== tname);
        const tags = this.state.tags.filter((tag) => tag !== tname);
        this.setState({ currentTags, tags });
        window.localStorage.setItem(`t${cid}`, JSON.stringify(currentTags));
      });
  }

  /** Update server-side title and localStorage and navi-side title.
   * Used for change from editor because this will trigger a re-render of navi */
  titleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const newTitle = e.currentTarget.value;
    const oldTitle: string = this.state.currentTitle;
    const bid = this.state.currentBid;
    const cid = this.state.currentCid;
    fetch('/apis/updatechaptertitle', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newTitle,
        cid
      }),
    });
    this.setState({ currentTitle: newTitle });
    const books = this.state.books;
    books.forEach((book) => {
      if (book.id === bid) {
        for (let i = 0; i < book.children.length; i += 1) {
          if (book.children[i].title === oldTitle) {
            book.children[i].title = newTitle;
            break;
          }
        }
      }
    });
    this.setState({ books });
  }

  // /** Update server-side title and localStorage and editor-side title.
  //  * Should be used for change from navigator because this will not trigger a re-render of navi */
  // updateChapterTitle = (oldTitle, newTitle, cid) => {
  //   fetch('/apis/updatechaptertitle', {
  //     method: 'post',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       title: newTitle,
  //       cid
  //     }),
  //   });
  //   if (this.state.currentTitle === oldTitle && this.state.currentCid === cid) {
  //     this.setState({ currentTitle: newTitle });
  //   }
  // }

  /** content: Raw object */
  updateChapterContent = (content: {}) => {
    this.setState({ savingVisibility: 'visible' });
    fetch('/apis/updatechaptercontent', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        cid: this.state.currentCid
      }),
    })
      .then(res => res.json())
      .then(json => {
        if (json.info !== 'success') {
          console.log('update failed');
        }
        this.setState({ savingVisibility: 'hidden' });
        window.localStorage.setItem(`c${this.state.currentCid}`, content);
      });
  }

  updateBook = (oldTitle, newTitle) => {
    const { cookies } = this.props;
    const token = cookies.get('token');
    fetch('/apis/updatebook', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oldTitle,
        newTitle,
        token
      }),
    })
      .then(res => res.json())
      .then(json => {
        if (json.info !== 'success') {
          console.log('update failed');
        }
      });
  }

  addChapter = (title: string, bid: number | string) => {
    fetch('/apis/addchapter', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        bid
      }),
    })
      .then(res => res.json())
      .then(json => {
        if (json.info !== 'success') {
          console.log('update failed');
        } else {
          const newChapter = json.chapter;
          const books = this.state.books;
          console.log(bid);
          for (let i = 0; i < books.length; i += 1) {
            if (books[i].id === bid) {
              books[i].children.push(newChapter);
            }
          }
          this.setState({ books });
        }
      });
  }

  addBook = (title: string) => {
    console.log(`add a book named ${title}`);
    const { cookies } = this.props;
    const token = cookies.get('token');
    fetch('/apis/addbook', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        token
      }),
    })
      .then(res => res.json())
      .then(json => {
        if (json.info === 'success') {
          const books = this.state.books;
          books.push(json.book);
          this.setState({ books });
        }
      });
  }

  deleteChapter = (bid, cid) => {
    fetch('/apis/deletechapter', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bid,
        cid
      }),
    })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        if (json.info === 'success') {
          const books = this.state.books;
          for (let i = 0; i < books.length; i += 1) {
            if (books[i].id === bid) {
              for (let j = 0; j <= books[i].children.length; j += 1) {
                if (books[i].children[j].cid === cid) {
                  books[i].children.splice(j, 1);
                  break;
                }
              }
              break;
            }
          }
          if (this.state.currentCid === cid) {
            this.setState({ books, currentContent: null });
          } else {
            this.setState({ books });
          }
        }
      });
  }

  deleteBook = (bid) => {
    const { cookies } = this.props;
    const token = cookies.get('token');
    fetch('/apis/deletebook', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bid,
        token
      }),
    });
    const books = this.state.books;
    for (let i = 0; i < books.length; i += 1) {
      if (books[i].id === bid) {
        books.splice(i, 1);
        break;
      }
    }
    if (this.state.currentBid === bid) {
      this.setState({ books, currentContent: null });
    } else {
      this.setState({ books });
    }
  }

  addChapterLink = (bid, cid) => {
    cid = parseInt(cid, 10);
    bid = parseInt(bid, 10);
    fetch('/apis/addlink', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bid,
        cid
      }),
    })
      .then(res => res.json())
      .then(json => {
        if (json.info !== 'success') {
          console.log('link failed');
        } else {
          const books = this.state.books;
          let title = '';
          const chapter = { cid, title };
          for (let i = 0; i < books.length; i += 1) {
            for (let j = 0; j < books[i].children.length; j += 1) {
              if (books[i].children[j].cid === cid) {
                title = books[i].children[j].title;
              }
            }
            if (books[i].id === bid) {
              books[i].children.push(chapter);
            }
          }
          chapter.title = title;
          this.setState({ books });
        }
      });
  }

  searchByTitle = (title: string) => {
    const { cookies } = this.props;
    const token = cookies.get('token');

    fetch('/apis/searchbytitle', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        title
      }),
    })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        const fetchedBooks = json;
        this.setState({ searchResultBooks: fetchedBooks });
      });
  }

  searchByContent = (content: string) => {
    const { cookies } = this.props;
    const token = cookies.get('token');

    fetch('/apis/searchbytitle', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        content
      }),
    })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        const fetchedBooks = json;
        this.setState({ searchResultBooks: fetchedBooks });
      });
  }

  searchByTags = (tags: Array<string>) => {
    const { cookies } = this.props;
    const token = cookies.get('token');

    fetch('/apis/searchbytags', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        tags
      }),
    })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        const fetchedBooks = json;
        this.setState({ searchResultBooks: fetchedBooks });
      });
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    return (
      <div className="NotePage">
        <Layout>
          <Sider
            style={{ background: '#fff', height: '100vh' }}
            collapsible={true}
            collapsed={this.state.collapsed}
            collapsedWidth={0}
            onCollapse={this.toggle}
          >
            <Navigator
              firstLevelObjects={this.state.books}
              openContent={this.openContent}
              bookTitleChange={this.updateBook}
              addBook={this.addBook}
              addChapter={this.addChapter}
              deleteChapter={this.deleteChapter}
              deleteBook={this.deleteBook}
              addLink={this.addChapterLink}
              searchByTitle={this.searchByTitle}
              searchByTags={this.searchByTags}
              searchByContent={this.searchByContent}
              searchResult={this.state.searchResultBooks}
              tags={this.state.tags}
            />
          </Sider>
          <NoteContentContainer
            editorStateRaw={this.state.currentContent}
            saveContent={this.updateChapterContent}
            savingVisibility={this.state.savingVisibility}
            title={this.state.currentTitle}
            changeTitle={this.titleChange}
            theme={this.state.theme}
            changeTheme={this.handleThemeChange}
            tags={this.state.currentTags}
            addTag={this.addTag}
            deleteTag={this.deleteTag}
            cookies={this.props.cookies}
            allTags={this.state.tags}
            logOut={this.props.logOut}
          />
        </Layout>
      </div>
    );
  }
}

export default withCookies(NotePage);
