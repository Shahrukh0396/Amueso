const mongoose = require('mongoose');
const uuidv1 = require("uuid");
const passwordHash = require("password-hash");

const Schema = mongoose.Schema;

const user = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },

  hash_password: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  reset_password_expires: {
    type: Date
  },
  reset_password_token: {
    type: String
  },
}, {
  timestamps: true
});

user.virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = uuidv1.v1();
        this.hash_password = this.encryptPassword(password);
        //console.log("check", this.salt, this.hashPassword);
    })
    .get(function () {
        return this._password;
    });

user.methods = {
    authentication: function (password) {

        return passwordHash.verify(password, this.hash_password);
    },
    encryptPassword: function (password) {
        if (!password) {
            return "";
        }
        try {
            return passwordHash.generate(password);
        } catch (error) {
            console.log(error);
            return "";
        }
    }
};

module.exports = mongoose.model('user', user);