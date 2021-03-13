const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter valid email address!.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          console.log(value, user);
          if (user) {
            return Promise.reject("Email address already exist.");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  authController.signUp
);

router.post("/login", authController.login);

module.exports = router;
