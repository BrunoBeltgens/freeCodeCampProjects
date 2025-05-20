/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const Book = require('../models').Book;
module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find({}, (err, data) => {
        if (!data) {
          res.json([]);
        } else {
          const List = data.map((book) => {
            return {
              _id: book._id,
              title: book.title,
              comments: book.comments,
              commentcount: book.comments.length,
            }
          })
          res.json(List);
        }
      });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if (!title) {
        res.send('missing required field title');
        return;
      }
      const newBook = new Book({ title, comment: [] });
      newBook.save((err, data) => {
        if (err || !data) {
          res.send('error saving')
        } else {
          res.json({ _id: data._id, title: data.title });
        }
      });
    })
    
    .delete(function(req, res){
      Book.deleteMany({}, (err, data) => {
        if (err || !data) {
          res.send('error deleting all');
        } else {
          res.send('complete delete successful')
        }
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      Book.findById(bookid, (err, data) => {
        if (!data) {
          res.send('no book exists');
        } else {
          res.json({
            comments: data.comments,
            _id: data._id,
            title: data.title,
            commentcount: data.comments.length,
          });
        }
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        res.send('missing required field comment');
        return;
      }
      Book.findById(bookid, (err, book) => {
        if (!book) {
          res.send('no book exists');
        } else {
          book.comments.push(comment);
          book.save((err, data) => {
            res.json({
              comments: data.comments,
              _id: data._id,
              title: data.title,
              commentcount: data.comments.length,
            });
          });
        }
      });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      Book.findByIdAndRemove(bookid, (err, data) => {
        if (err || !data) {
          res.send('no book exists');
        } else {
          res.send('delete successful')
        }
      })
    });
  
};
