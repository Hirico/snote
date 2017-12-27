/*
 * Copyright (c) 2017, hirico (https://github.com/hirico)
 *
 * License: MIT
 */

import React, { Component } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';
import StateToPdfMake from 'draft-js-export-pdfmake/lib/stateToPdfMake';
import { convertToRaw } from 'draft-js';

export default class Button extends Component {
  onClick = (e) => {
    e.preventDefault();
    const { vfs } = vfsFonts.pdfMake;
    pdfMake.vfs = vfs;

    const contentStateData = convertToRaw(this.props.editorState.getCurrentContent());
    console.log(contentStateData);
    const stateToPdfMake = new StateToPdfMake(contentStateData);
    const pdfmakeContents = stateToPdfMake.generate();
    console.log(pdfmakeContents);
    pdfMake.createPdf(pdfmakeContents).open();
  }

  render() {
    return (
      <button className={this.props.className} type="button" onClick={this.onClick} title={'export to pdf'}>
        <svg className="sidemenu__button__icon" version="1.1" width="24" height="24" viewBox="0 0 24 24">
          <svg className="sidemenu__button__icon" width="24" height="24" viewBox="0 0 900 900">
            <path fill="currentColor" d="M858 522.833q-15 0-25.5 10.5t-10.5 25.5v236q0 12-9 21t-21 9H102q-12 0-21-9t-9-21v-690q0-12 9-21t21-9h310q15 0 25.5-10.5t10.5-25.5-10.5-25.5-25.5-10.5H102q-42 0-72 30t-30 72v690q0 42 30 72t72 30h690q42 0 72-30t30-72v-236q0-15-10.5-25.5t-25.5-10.5zm28-289l-231-220q-17-17-39-7.5t-22 33.5v118q-187 12-286 162-24 36-40.5 78t-20 58-4.5 26q-3 15 6 27t24 14q2 1 5 1 14 0 24-9t12-22q1-7 4-21t17-49.5 34-64.5q87-129 257-130 3 1 4 1 15 0 25.5-10.5t10.5-25.5v-69l141 134-141 118v-58q0-15-10.5-25.5t-25.5-10.5-25.5 10.5-10.5 25.5v135q0 23 21 32 7 4 15 4 13 0 23-9l231-192q13-11 13.5-27t-11.5-27z" fillRule="evenodd" />
          </svg>
        </svg>
      </button>
    );
  }
}
