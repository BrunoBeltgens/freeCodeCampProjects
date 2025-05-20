'use strict';
const Reply = require('../models').Reply;
const Thread = require('../models').Thread;
const Board = require('../models').Board;

module.exports = function (app) {
  
  app.route('/api/threads/:board').post((req, res) => {
    const { text, delete_password } = req.body;
    let board = req.body.board;
    if (!board) {
      board = req.params.board;
    }
    const newThread = new Thread({
      text: text,
      delete_password: delete_password,
      replies: [],
    });
    Board.findOne({ name: board }, (err, data) => {
      if (!data) {
        const newBoard = new Board({
          name: board,
          threads: [],
        });
        newBoard.threads.push(newThread);
        newBoard.save((err, data) => {
          if (err || !data) {
            res.send('post saving error');
          } else {
            res.json(newThread);
          }
        });
      } else {
        data.threads.push(newThread);
        data.save((err, data) => {
          if (err || !data) {
            res.send('error');
          } else {
            res.json(newThread);
          }
        });
      }
    })
  }).get((req, res) =>{
    const board = req.params.board;
    Board.findOne({ name: board }, (err, data) => {
      if (!data) {
        res.send('Could not find a board with this name');
      } else {
        const threads = data.threads.map((thread) => {
          const {
            _id,
            text,
            created_on,
            bumped_on,
            reported,
            delete_password,
            replies,
          } = thread;
          return {
            _id,
            text,
            created_on,
            bumped_on,
            reported,
            delete_password,
            replies,
            replycount: thread.replies.length,
          };
        });
        res.json(threads);
      }
    });
  }).put((req, res) => {
    const { report_id } = req.body;
    const board = req.params.board;
    Board.findOne({ name: board }, (err, data) => {
      if (!data) {
        res.send('Could not find a board with this name');
      } else {
        const date = new Date();
        let reportedThread = data.threads.id(report_id);
        reportedThread.reported = true;
        reportedThread.bumped_on = date;
        data.save(err => {
            res.send('Success');
        });
      }
    });
  }).delete((req, res) => {
    const { thread_id, delete_password } = req.body;
    const board = req.params.board;
    Board.findOne({ name: board }, (err, data) => {
      if (!data) {
        res.send('Could not find a board with this name');
      } else {
        let threadToDelete = data.threads.id(thread_id);
        if (threadToDelete.delete_password === delete_password) {
          threadToDelete.remove();
        } else {
          res.send('Incorrect password');
          return;
        }
        data.save(err => {
          res.send('Success');
        });
      }
    });
  });
    
  app.route('/api/replies/:board').post((req, res) => {
    const { thread_id, text, delete_password } = req.body;
    const board = req.params.board;
    const newReply = new Reply({
      text: text,
      delete_password: delete_password,
    });
    Board.findOne({ name: board }, (err, data) => {
      if (!data) {
        res.send('Could not find a board with this name');
      } else {
        const date = new Date();
        let threadToAddReply = data.threads.id(thread_id);
        threadToAddReply.bumped_on = date;
        threadToAddReply.replies.push(newReply);
        data.save((err, data) => {
          res.json(data);
        });
      }
    });
  }).get((req, res) => {
    const board = req.params.board;
    Board.findOne({ name: board }, (err, data) => {
      if (!data) {
        res.send('Could not find a board with this name');
      } else {
        const thread = data.threads.id(req.query.thread_id);
        res.json(thread);
      }
    });
  }).put((req, res) => {
    const { thread_id, reply_id } = req.body;
    const board = req.params.board;
    Board.findOne({ name: board }, (err, data) => {
      if (!data) {
        res.send('Could not find a board with this name');
      } else {
        let thread = data.threads.id(thread_id);
        let reply = thread.replies.id(reply_id);
        reply.reported = true;
        reply.bumped_on = new Date();
        data.save(err => {
          if (!err) {
            res.send('Success');
          }
        });
      }
    });
  }).delete((req, res) => {
    const { thread_id, reply_id, delete_password } = req.body;
    const board = req.params.board;
    Board.findOne({ name: board }, (err, data) => {
      if (!data) {
        res.send('Could not find a board with this name');
      } else {
        let thread = data.threads.id(thread_id);
        let reply = thread.replies.id(reply_id);
        if (reply.delete_password === delete_password) {
          reply.remove();
        } else {
          res.send('Incorrect password');
          return;
        }
        data.save(err => {
          if (!err) {
            res.send('Success');
          }
        });
      }
    });
  });
};