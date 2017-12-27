import React, { Component } from 'react';
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON } from 'megadraft';
import Image from 'megadraft/lib/plugins/image/plugin';
import Video from 'megadraft/lib/plugins/video/plugin';
import 'megadraft/dist/css/megadraft.css';
import MegaPDF from '../../plugins/MegaPDF/plugin';
import './style.css';

/**
 * Property:
 * 1. editorStateRaw: json raw editor state
 * 2. saveContent: callback
 *
 */
class NoteEditor extends Component {
  constructor(props) {
    super(props);
    console.log(`ready to render ${this.props.editorStateRaw}`);
    this.state = {
      editorState: editorStateFromRaw(this.props.editorStateRaw)
    };
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.editorStateRaw !== nextProps.editorStateRaw) {
      console.log(`set state here ${nextProps.editorStateRaw}`);
      this.setState({
        editorState: editorStateFromRaw(nextProps.editorStateRaw)
      });
      return true;
    }
    return false;
  };

  handleChange = (editorState) => {
    this.setState({ editorState });
    const raw = editorStateToJSON(editorState);
    this.props.saveContent(raw);
    console.log(raw);
  }

  render() {
    return (
      <div className={`NoteEditor ${this.props.className}`}>
        <MegadraftEditor
          editorState={this.state.editorState}
          onChange={this.handleChange}
          plugins={[Image, Video, MegaPDF]}
        />
      </div>
    );
  }
}

export default NoteEditor;
