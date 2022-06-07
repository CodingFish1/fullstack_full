const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please input your name']
    },
    email: {
      type: String,
      required: [true, 'Please input your Email'],
      unique: true,
      lowercase: true,
      select: false
    },
    gender: {
      type: String,
      enum: ['male', 'female']
    },
    avatar: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: true
    },
    password:{
      type:String,
      required:[true,"Please input your password"],
      minlength:8,
      select:false
    }
  },{ versionKey: false });

const User = mongoose.model('user', userSchema);

module.exports = User;