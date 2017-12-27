/**
 * Server-side APIs, '/apis' as URL prefix
 */

const express = require('express');
const db = require('./dataBase');

const router = express.Router();


/** User module */
router.post('/signup', db.signUp);

router.post('/signin', db.signIn);

router.post('/updatebook', db.updateBook);

router.post('/updatechaptertitle', db.updateChapterTitle);

router.post('/updatechaptercontent', db.updateChapterContent);

router.post('/addbook', db.addBookAndCreateChap);

router.post('/addchapter', db.addChapter);

router.post('/deletebook', db.deleteBook);

router.post('/deletechapter', db.deleteChapter);

router.post('/deletetag', db.deleteTag);

router.post('/addtag', db.addTag);

router.post('/searchbytags', db.searchByTags);

router.post('/searchbytitle', db.searchByTitle);

router.post('/searchbycontent', db.searchByContent);

router.post('/addlink', db.addLink);

router.post('/gettags', db.getTags);

router.post('/gettagrelations', db.getTagRelations);

router.post('/addtagrelation', db.addTagRelation);

router.post('/deletetagrelation', db.deleteTagRelation);

router.post('/updatetagrelation', db.updateTagRelation);

// get books of a user
router.post('/getbooks', (req, res) => {
  const token = req.body.token;
  db.getBooks(req, res, token);
});

// get chapter according to URL
router.post('/getchapter', (req, res) => {
  const cid = req.body.cid;
  db.getChapterContentAndTag(req, res, cid);
});

router.post('/upload', (req, res) => {
  res.redirect('/');
});

router.post('/saveChap', (req, res) => {

});

module.exports = router;
