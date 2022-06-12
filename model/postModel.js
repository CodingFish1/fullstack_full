const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref:"user", //Associated collection(table)'s name
    required: [true, 'Please input your name']
  },
  tags: {
    type: [String],
    validate: {
      validator: (value) => {
        if (Array.isArray(value) && value.length === 0) return false
        else if (value.some(text => text === '')) return false
        else return true
      },
      message: `Tag format error`
    }
  },
  type: {
    type: String,
    enum:["group","person"],
    required: [true, 'Please fill the Type of post']
  },
  image: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false
  },
  content: {
    type: String,
    required: [true, 'Please fill the Content'],
  },
  likes: [
    { 
      type: mongoose.Schema.ObjectId, 
      ref: 'User' 
    }
  ],
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