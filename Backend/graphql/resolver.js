const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");

module.exports = {
  createUser: async ({ userInputData }, req) => {
    const errors = [];
    if (!validator.isEmail(userInputData.email)) {
      errors.push({ message: "E-mail is invalid" });
    }
    if (
      validator.isEmpty(userInputData.password) ||
      !validator.isLength(userInputData.password, {min : 5})
    ) {
      errors.push({ message: "Password is too short" });
    }
    if (errors.length > 0) {
      const err = new Error("Invalid input!");
      err.data = errors;
	  err.statusCode = 422
      throw err;
    }
    const existingUser = await User.findOne({ email: userInputData.email });
    if (existingUser) {
      const error = new Error();
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInputData.password, 12);

    const newUser = new User({
      email: userInputData.email,
      name: userInputData.name,
      password: hashedPw,
    });

    const createdUser = await newUser.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
};
