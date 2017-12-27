import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import 'antd/dist/antd.css';

import SignUpPage from '../SignUpPage';
import SignInPage from '../SignInPage';
import NotePage from '../NotePage';
import FrontPage from '../FrontPage';

import './style.css';

class App extends Component {
  state = {
    redirect: false,
  }

  logOut = () => {
    const { cookies } = this.props;
    cookies.remove('token');
    this.setState({ redirect: true });
    console.log('logOut');
  }

  NotePageWithProps = (props) =>
    (<NotePage logOut={this.logOut} {...props} />);

  FrontPageWithProps = (props) =>
    (<FrontPage />);

  render() {
    const { cookies } = this.props;
    console.log(cookies);
    const token = cookies.get('token');
    let content = this.NotePageWithProps;
    if (token === undefined) {
      content = this.FrontPageWithProps;
    }
    return (
      <div className="App">
        <Switch>
          <Route path="/signup" component={SignUpPage} />
          <Route path="/signin" component={SignInPage} />
          <Route path="/" render={content} />
          <Route path="/main" render={content} />
        </Switch>
      </div>
    );
  }
}

export default withCookies(App);
