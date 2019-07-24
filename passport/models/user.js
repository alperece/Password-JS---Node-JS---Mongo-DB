const mongoose = require('mongoose');

// we need to create all the schema that is why we create user.js

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// model name is user and we will use User for schema
const User = mongoose.model('User', UserSchema);

module.exports = User;
