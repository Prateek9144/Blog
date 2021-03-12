const Post = require("../models/post");
const { validationResult } = require("express-validator");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      console.log(posts);
      if (!posts) {
        const error = new Error("Posts not found!");
        error.statusCode = 404;
      }
      return res.status(200).json({
        message: "Posts fetched successfully",
        posts: posts,
      });
    })
    .catch((err) => {
      if (!errors.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    const error = new Error();
    error.message = "Validation Failed.Entered data is incorrect.";
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path;
  const newimageUrl = imageUrl.replace(/\\/g, "/");
  console.log(imageUrl);
  console.log(newimageUrl);
  if (!imageUrl) {
    const error = new Error();
    error.message = "Invalid image formate..";
    error.statusCode = 422;
    throw error;
  }

  const post = new Post({
    title: title,
    content: content,
    imageUrl: newimageUrl,
    creator: {
      name: "Prateek",
    },
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Post created successfully!",
        post: result,
      });
    })
    .catch((err) => {
      if (!errors.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  console.log(postId);
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found!");
        error.statusCode = 404;
        // console.log(error);
        throw error;
      }
      console.log(post);
      return res.status(200).json({
        message: "Post fetched successfully",
        post: post,
      });
    })
    .catch((err) => {
      if (!errors.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
