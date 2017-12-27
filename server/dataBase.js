const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const sha1 = require('sha1');
const randomstring = require('randomstring');
const { blankEditorContent, defaultChapterTitle } = require('./constants');

const dbPath = path.resolve(__dirname, './data/snote.db');
const db = new sqlite3.Database(dbPath);

exports.signUp = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const info = { info: 'email already existed' };
  db.get('SELECT * FROM user WHERE email = ?', email, (err, row) => {
    if (row === undefined) { // not registered yet
      db.serialize(() => {
        db.run('INSERT INTO user (email, password, token) VALUES (?, ?, ?)', email, sha1(password), sha1(`${email}${randomstring.generate(6)}`));
        db.get('SELECT * FROM user WHERE email = ?', email, (uidErr, uidRow) => {
          info.info = 'success';
          res.cookie('token', uidRow.token);
          res.json(info);
        });
      });
    } else { // email already existed
      res.json(info);
    }
  });
};

exports.signIn = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const info = { info: 'wrong input' };
  db.get('SELECT * FROM user WHERE email = ? AND password = ?', email, sha1(password), (err, row) => {
    if (row === undefined) {
      res.json(info);
    } else {
      info.info = 'success';
      res.cookie('token', row.token);
      res.json(info);
    }
  });
};

exports.updateChapterContent = (req, res) => {
  const cid = req.body.cid;
  const newContent = req.body.content;
  const info = { info: 'success' };
  db.run('UPDATE chapter SET content = ? WHERE cid = ?', newContent, cid);
  res.json(info);
};

exports.updateChapterTitle = (req, res) => {
  const cid = req.body.cid;
  const newTitle = req.body.title;
  const info = { info: 'success' };
  db.run('UPDATE chapter SET title = ? WHERE cid = ?', newTitle, cid);
  res.json(info);
};

exports.updateBook = (req, res) => {
  const token = req.body.token;
  const newTitle = req.body.newTitle;
  const oldTitle = req.body.oldTitle;
  const info = { info: 'success' };
  db.get('SELECT * FROM user WHERE token = ?', token, (uerr, urow) => {
    db.run('UPDATE book SET title = ? WHERE uid = ? AND title = ?', newTitle, urow.uid, oldTitle);
  });
  res.json(info);
};

exports.addChapter = (req, res) => {
  const title = req.body.title;
  const bid = req.body.bid;
  const result = { info: 'success', chapter: { title, cid: 0 } };
  db.serialize(() => {
    db.run('INSERT INTO chapter (title, content) VALUES(?, ?)', title, JSON.stringify(blankEditorContent));
    console.log('here');
    db.get('SELECT MAX(cid) as currentid FROM chapter', (err, row) => {
      db.run('INSERT INTO bookchapter (bid, cid) VALUES(?, ?)', bid, row.currentid);
      result.chapter.cid = row.currentid;
      res.json(result);
    });
  });
};

exports.addBookAndCreateChap = (req, res) => {
  const title = req.body.title;
  const token = req.body.token;
  const result = { info: 'success', book: { title, children: [], id: 0 } };
  db.get('SELECT * FROM user WHERE token = ?', token, (uerr, urow) => {
    db.serialize(() => {
      db.run('INSERT INTO book (title, uid) VALUES(?, ?)', title, urow.uid);
      db.get('SELECT bid FROM book WHERE title = ? AND uid = ?', title, urow.uid, (err, row) => {
        const bid = row.bid;
        db.run('INSERT INTO chapter (title, content) VALUES(?, ?)', defaultChapterTitle, JSON.stringify(blankEditorContent));
        db.get('SELECT MAX(cid) as cid FROM chapter', (cerr, crow) => {
          db.run('INSERT INTO bookchapter (bid, cid) VALUES(?, ?)', bid, crow.cid);
          result.book.id = bid;
          result.book.children.push({ title: defaultChapterTitle, cid: crow.cid });
          res.json(result);
        });
      });
    });
  });
};

exports.deleteChapter = (req, res) => {
  const bid = req.body.bid;
  const cid = req.body.cid;
  db.serialize(() => {
    db.run('DELETE FROM bookchapter WHERE bid = ? AND cid = ?', bid, cid);
    db.get('SELECT * FROM bookchapter WHERE cid = ?', cid, (err, row) => {
      if (row === undefined) {
        db.run('DELETE FROM chapter WHERE cid = ?', cid);
      }
      db.run('DELETE FROM tag WHERE cid = ?', cid);
      res.json({ info: 'success' });
    });
  });
};

exports.deleteBook = (req, res) => {
  const bid = req.body.bid;
  const token = req.body.token;
  db.get('SELECT * FROM user WHERE token = ?', token, (uerr, urow) => {
    db.run('DELETE FROM book WHERE uid = ? AND bid = ?', urow.uid, bid);
    db.all('SELECT * FROM bookchapter WHERE bid = ?', bid, (err, rows) => {
      if (rows.length === 0) {
        res.json({ info: 'success' });
      } else {
        for (let i = 0; i < rows.length; i += 1) {
          db.run('DELETE FROM chapter WHERE cid = ?', rows[i].cid);
        }
        res.json({ info: 'success' });
      }
    });
  });
};

exports.addTag = (req, res) => {
  const tname = req.body.tname;
  const cid = req.body.cid;
  db.run('INSERT INTO tag (cid, tname) VALUES (?, ?)', cid, tname);
  res.json({ info: 'success' });
};

exports.deleteTag = (req, res) => {
  const tname = req.body.tname;
  const cid = req.body.cid;
  db.run('DELETE FROM tag WHERE tname = ? AND cid = ?', tname, cid);
  res.json({ info: 'success' });
};

exports.getChapterContentAndTag = (req, res, cid) => {
  db.get('SELECT * FROM chapter WHERE cid = ?', cid, (err, row) => {
    if (row === undefined) {
      res.json({ content: blankEditorContent, tags: [] });
    } else {
      db.all('SELECT * FROM tag WHERE cid = ?', cid, (terr, rows) => {
        const tags = [];
        if (rows.length !== 0) {
          for (let i = 0; i < rows.length; i += 1) {
            tags.push(rows[i].tname);
          }
        }
        res.json({ content: row.content, tags });
      });
    }
  });
};

exports.getBooks = (req, res, token) => {
  const books = [];
  let filledBookNum = 0;
  db.get('SELECT * FROM user WHERE token = ?', token, (uerr, urow) => {
    if (urow === undefined) {
      return;
    }
    db.all('SELECT * FROM book WHERE uid = ?', urow.uid, (err, rows) => {
      if (rows.length === 0) {
        res.json(books);
      } else {
        const bookNum = rows.length;
        rows.forEach((row, index) => {
          const book = { title: '', children: [], id: 0 };
          book.id = row.bid;
          book.title = row.title;
          db.all('SELECT * FROM bookchapter WHERE bid = ?', row.bid, (bcErr, bcRows) => {
            if (bcRows.length === 0) {
              books.push(book);
              filledBookNum += 1;
              if (filledBookNum === bookNum) {
                res.json(books);
              }
            } else {
              bcRows.forEach((bcRow, bcIndex) => {
                db.get('SELECT * FROM chapter WHERE cid = ?', bcRow.cid, (cErr, cRow) => {
                  const child = { title: cRow.title, cid: cRow.cid };
                  book.children.push(child);
                  const allChapterinserted = bcIndex >= bcRows.length - 1;
                  if (allChapterinserted) {
                    books.push(book);
                    filledBookNum += 1;
                    if (filledBookNum === bookNum) {
                      res.json(books);
                    }
                  }
                });
              });
            }
          });
        });
      }
    });
  });
};

/** A filtered version of getBooks */
exports.searchByTags = (req, res) => {
  const tags = req.body.tags;
  const token = req.body.token;
  const books = [];
  db.get('SELECT * FROM user WHERE token = ?', token, (uerr, urow) => {
    const uid = urow.uid;
    let filledTags = 0;
    tags.forEach((tag, tindex) => {
      db.all('SELECT b.bid as bid, b.title as btitle, c.title as ctitle, c.cid as cid FROM book b, chapter c, bookchapter bc, tag t WHERE b.uid = ? AND b.bid = bc.bid AND bc.cid = c.cid AND t.cid = c.cid AND t.tname = ?',
        uid, tag, (err, rows) => {
          const filledBids = [];
          for (let i = 0; i < rows.length; i += 1) {
            if (filledBids.indexOf(rows[i].bid) === -1) {
              filledBids.push(rows[i].bid);
              books.push({ title: rows[i].btitle, id: rows[i].bid, children: [] });
            }
          }
          for (let i = 0; i < rows.length; i += 1) {
            const index = filledBids.indexOf(rows[i].bid);
            books[index].children.push({ title: rows[i].ctitle, cid: rows[i].cid });
          }
          filledTags += 1;
          if (filledTags === tags.length) {
            res.json(books);
          }
        });
    });
  });
};

exports.searchByTitle = (req, res) => {
  const title = req.body.title;
  const token = req.body.token;
  const books = [];
  db.get('SELECT * FROM user WHERE token = ?', token, (uerr, urow) => {
    const uid = urow.uid;
    db.all('SELECT b.bid as bid, b.title as btitle, c.title as ctitle, c.cid as cid FROM book b, chapter c, bookchapter bc WHERE b.uid = ? AND b.bid = bc.bid AND bc.cid = c.cid AND c.title LIKE ?',
      uid, `%${title}%`, (err, rows) => {
        const filledBids = [];
        for (let i = 0; i < rows.length; i += 1) {
          if (filledBids.indexOf(rows[i].bid) === -1) {
            filledBids.push(rows[i].bid);
            books.push({ title: rows[i].btitle, id: rows[i].bid, children: [] });
          }
        }
        for (let i = 0; i < rows.length; i += 1) {
          const index = filledBids.indexOf(rows[i].bid);
          books[index].children.push({ title: rows[i].ctitle, cid: rows[i].cid });
        }
        res.json(books);
      });
  });
};

/** A filtered version of getBooks */
exports.searchByContent = (req, res) => {
  const content = req.body.content;
  const token = req.body.token;
  const books = [];
  db.get('SELECT * FROM user WHERE token = ?', token, (uerr, urow) => {
    const uid = urow.uid;
    db.all('SELECT b.bid as bid, b.title as btitle, c.title as ctitle, c.cid as cid FROM book b, chapter c, bookchapter bc WHERE b.uid = ? AND b.bid = bc.bid AND bc.cid = c.cid AND c.content LIKE ?',
      uid, `%${content}%`, (err, rows) => {
        const filledBids = [];
        for (let i = 0; i < rows.length; i += 1) {
          if (filledBids.indexOf(rows[i].bid) === -1) {
            filledBids.push(rows[i].bid);
            books.push({ title: rows[i].btitle, id: rows[i].bid, children: [] });
          }
        }
        for (let i = 0; i < rows.length; i += 1) {
          const index = filledBids.indexOf(rows[i].bid);
          books[index].children.push({ title: rows[i].ctitle, cid: rows[i].cid });
        }
        res.json(books);
      });
  });
};

exports.addLink = (req, res) => {
  const bid = req.body.bid;
  const cid = req.body.cid;
  db.run('INSERT INTO bookchapter (bid, cid) VALUES (?, ?)', bid, cid);
  res.json({ info: 'success' });
};

exports.getTags = (req, res) => {
  const token = req.body.token;
  const tags = [];
  const json = { tags, info: '' };
  db.get('SELECT * FROM user WHERE token = ?', token, (err, row) => {
    if (row !== undefined) {
      const uid = row.uid;
      db.all('SELECT DISTINCT tag.tname FROM book, bookchapter, tag WHERE ? = book.uid AND book.bid = bookchapter.bid AND bookchapter.cid = tag.cid', uid, (terr, trows) => {
        for (let i = 0; i < trows.length; i += 1) {
          json.tags.push(trows[i].tname);
        }
        res.json(json);
      });
    }
  });
};

exports.getTagRelations = (req, res) => {
  const token = req.body.token;
  const tagRelations = [];
  db.get('SELECT * FROM user WHERE token = ?', token, (uerr, urow) => {
    if (urow !== undefined) {
      const uid = urow.uid;
      db.all('SELECT DISTINCT t.tname FROM tag t, book b, bookchapter bc WHERE b.uid = ? AND b.bid = bc.bid AND bc.cid = t.cid', uid, (terr, trows) => {
        if (trows.length === 0) {
          res.json(tagRelations);
        } else {
          let filledTags = 0;
          trows.forEach((trow, index) => {
            const currentTag = { name: trow.tname, relations: [] };
            db.all('SELECT * FROM tagrel WHERE source = ? AND uid = ?', trow.tname, uid, (rerr, rrows) => {
              let filledRows = 0;
              if (rrows.length > 0) {
                rrows.forEach((rrow, rindex) => {
                  currentTag.relations.push({ related: rrow.target, relation: rrow.relation });
                  filledRows += 1;
                  if (filledRows === rrows.length) {
                    filledTags += 1;
                    tagRelations.push(currentTag);
                    if (filledTags === trows.length) {
                      res.json(tagRelations);
                    }
                  }
                });
              } else {
                filledTags += 1;
                tagRelations.push(currentTag);
                if (filledTags === trows.length) {
                  res.json(tagRelations);
                }
              }
            });
          });
        }
      });
    }
  });
};

exports.addTagRelation = (req, res) => {
  const token = req.body.token;
  const source = req.body.source;
  const target = req.body.target;
  const relation = req.body.relation;
  db.get('SELECT * FROM user WHERE token = ?', token, (uerr, urow) => {
    if (urow !== undefined) {
      const uid = urow.uid;
      db.run('INSERT INTO tagrel (source, target, relation, uid) VALUES (?, ?, ?, ?)', source, target, relation, uid);
      db.run('INSERT INTO tagrel (source, target, relation, uid) VALUES (?, ?, ?, ?)', target, source, relation, uid);
      res.json({ info: 'success' });
    }
  });
};

exports.deleteTagRelation = (req, res) => {
  const token = req.body.token;
  const source = req.body.source;
  const target = req.body.target;
  const relation = req.body.relation;
  db.get('SELECT * FROM user WHERE token = ?', token, (uerr, urow) => {
    if (urow !== undefined) {
      const uid = urow.uid;
      db.run('DELETE FROM tagrel WHERE source = ? AND target = ? AND relation = ? AND uid = ?', source, target, relation, uid);
      db.run('DELETE FROM tagrel WHERE source = ? AND target = ? AND relation = ? AND uid = ?', target, source, relation, uid);
      res.json({ info: 'success' });
    }
  });
};

exports.updateTagRelation = (req, res) => {
  const token = req.body.token;
  const source = req.body.source;
  const target = req.body.target;
  const relation = req.body.relation;
  db.get('SELECT * FROM user WHERE token = ?', token, (uerr, urow) => {
    if (urow !== undefined) {
      const uid = urow.uid;
      db.run('UPDATE tagrel SET relation = ? WHERE source = ? AND target = ? AND uid = ?', relation, source, target, uid);
      db.run('UPDATE tagrel SET relation = ? WHERE source = ? AND target = ? AND uid = ?', relation, target, source, uid);
      res.json({ info: 'success' });
    }
  });
};
