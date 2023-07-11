const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const RescueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the name of the organisation"],
    maxlength: 50,
    minlength: 2,
  },
  city: {
    type: String,
    required: [true, "Please provide city"],
  },
  state: {
    type: String,
    required: [true, "Please provide state"],
  },
  contact: {
    type: String,
    required: [true, "Please provide contact details"],
    maxlength: 10,
    minlength: 10,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  }
});

RescueSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

RescueSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      rescueId: this._id,
      name: this.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
};

RescueSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("RescueCenter", RescueSchema);