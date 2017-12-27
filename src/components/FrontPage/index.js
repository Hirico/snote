import React, { Component } from 'react';
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON } from 'megadraft';
import { Redirect } from 'react-router-dom';
import { Button, Icon } from 'antd';
import 'megadraft/dist/css/megadraft.css';
import './style.less';

export default class FrontPage extends Component {
  constructor(props) {
    super(props);
    const myContent = {
      entityMap: {},
      blocks: [
        {
          key: 'ag6qs',
          text: 'Wanna give it a try? Try to double click here',
          type: 'unstyled',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {}
        }
      ]
    };
    const editorState = editorStateFromRaw(myContent);
    this.state = { editorState, redirect: false, redirectTarget: '/signup' };
  }

  handleChange = (editorState) => {
    this.setState({ editorState });
  }

  toSignUp = () => {
    this.setState({ redirect: true, redirectTarget: '/signup' });
  }

  toSignIn = () => {
    this.setState({ redirect: true, redirectTarget: '/signin' });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirectTarget} />;
    }

    return (
      <div className="globalContent">
        <section id="introduction">
          <h2>
            <div className="s_content">
              <div className="s_content__container">
                <p className="s_content__container__text"> NOTE</p>
                <ul className="s_content__container__list">
                  <li className="s_content__container__list__item"><Icon type="rocket" /> SWIFT</li>
                  <li className="s_content__container__list__item"><Icon type="sync" /> SYNC </li>
                  <li className="s_content__container__list__item"><Icon type="lock" /> SECURE</li>
                  <li className="s_content__container__list__item"><Icon type="heart-o" /> SIMPLE</li>
                </ul>
              </div>
            </div>
          </h2>
          <p id="secondary">Your 21st century web notebook</p>
          <section id="editor-showcase">
            <MegadraftEditor
              editorState={this.state.editorState}
              onChange={this.handleChange}
            />
          </section>
          <div className="buttonGroup">
            <Button type="primary" size="large" onClick={this.toSignUp} id="signup-button" className="introButton">SIGN UP</Button>
            <Button size="large" onClick={this.toSignIn} className="introButton">SIGN IN</Button>
          </div>
        </section>
      </div>
    );
  }
}
