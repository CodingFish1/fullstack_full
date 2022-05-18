const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please input your name']
  },
  tags: [
    {
      type: String,
      // required: [true, 'Please fill the Tags of post'],
      validate: [value => value.length > 0, 'Tag is reuired'] // Array.isArray(value) && 
    }
  ],
  type: {
    type: String,
    enum:["group","person"],
    required: [true, 'Please fill the Type of post']
  },
  image: {
    type: String,
    default: ""
  },
  createAt: {
    type: Date,
    default: Date.now,
    select: false
  },
  content: {
    type: String,
    required: [true, 'Please fill the Content'],
  },
  likes: {
    type: Number,
    default: 0
  },
  comments:{
    type: Number,
    default: 0
  }
},
  {
    versionKey: false
  }
);

const Post = mongoose.model('Post',postsSchema);

module.exports = Post;