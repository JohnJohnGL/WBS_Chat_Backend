const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateJoined: {
    type: Date,
    default: Date.now,
  },
});

userSchema.statics.signup = async function (email, password) {
  const existingEmail = await this.findOne({ email });
  if (existingEmail) {
    throw Error("Email already in use");
  }
  if (!email || !password) {
    throw Error("All fields need to be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Please enter a valid email");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Make sure to use at least 8 characters, 1 Upper Case, 1 Lower Case, 1 Number and a symbol"
    );
  }

  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);

  const newUser = await this.create({ email, password: hash });
  return newUser;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  const newUser = await this.findOne({ email });
  if (!newUser) {
    throw Error("Incorrect email");
  }
  const match = await bcrypt.compare(password, newUser.password);
  if (!match) {
    throw Error("Incorrect password");
  }
  return newUser;
};

module.exports = mongoose.model("User", userSchema);
