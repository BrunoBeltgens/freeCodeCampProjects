const mongoose = require('mongoose');
const { Schema } = mongoose;
const date = new Date();
const ReplySchema = new Schema({
  text: { type: String },
  delete_password: { type: String },
  created_on: { type: Date, default: date },
  bumped_on: { type: Date, default: date },
  reported: { type: Boolean, default: false },
});
const ThreadSchema = new Schema({
  text: { type: String, required: true },
  delete_password: { type: String },
  reported: { type: Boolean, default: false },
  created_on: { type: Date, default: date},
  bumped_on: { type: Date, default: date},
  replies: [ReplySchema],
});
const BoardSchema = new Schema({
  name: { type: String },
  threads: [ThreadSchema],
});
const Reply = mongoose.model('Reply', ReplySchema);
const Thread = mongoose.model('Thread', ThreadSchema);
const Board = mongoose.model('Board', BoardSchema);

exports.Thread = Thread;
exports.Reply = Reply;
exports.Board = Board;