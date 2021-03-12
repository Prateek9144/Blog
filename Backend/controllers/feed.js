const Post = require("../models/post");
const { validationResult } = require("express-validator");

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is the first post!",
        imageUrl: "images/watch.jpg",
        creator: {
          name: "Prateek",
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation Failed.Entered data is incorrect.",
      error: errors.array(),
    });
  }
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: "images/watch.jpg",
    creator: {
      name: "Prateek",
    },
  });
  post.save().then((result) => {
    console.log(result);
    res
      .status(201)
      .json({
        message: "Post created successfully!",
        post: result,
      })
	}).catch((err) => {
	  console.log(err);
	});
};
