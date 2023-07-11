const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide first name"],
    maxlength: 50,
    minlength: 2,
  },
  lastName: {
    type: String,
    required: [true, "Please provide last name"],
    maxlength: 50,
    minlength: 2,
  },
  age: {
    type: Number,
    required: [true, "Please provide age"],
    minlength: 18,
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
  },
  profilePicture: {
    publicId: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Fpremium-vector%2Faccount-icon-user-icon-vector-graphics_39674128.htm&psig=AOvVaw3OWUvsf9EcBmSQ73epEKtr&ust=1687536648749000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCMCgwIai1_8CFQAAAAAdAAAAABAE",
    },
  }
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      name: this.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);