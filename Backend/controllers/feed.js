const fs = require("fs");
const path = require("path");

const Post = require("../models/post");
const User = require("../models/user");
const { validationResult } = require("express-validator");

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;

  const perPage = 2;
  let totalItems;
  Post.countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      console.log("post", posts);
      if (!posts) {
        const error = new Error("Posts not found!");
        error.statusCode = 404;
      }
      return res.status(200).json({
        message: "Posts fetched successfully",
        posts: posts,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
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
  let creator;
  let post;
  if (!imageUrl) {
    const error = new Error();
    error.message = "Invalid image formate..";
    error.statusCode = 422;
    throw error;
  }
  User.findById(req.userId)
    .then((user) => {
      creator = user;
      post = new Post({
        title: title,
        content: content,
        imageUrl: newimageUrl,
        creator: {
          id: creator._id,
          name: creator.name,
        },
      });
      return post.save();
    })
    .then((result) => {
      creator.post.push(post);
      return creator.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Post created successfully!",
        post: post,
        creator: { _id: creator._id, name: creator.name },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found!");
        error.statusCode = 404;
        throw error;
      }
      return res.status(200).json({
        message: "Post fetched successfully",
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(res);
  if (!errors.isEmpty()) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  imageUrl = imageUrl.replace(/\\/g, "/");
  if (!imageUrl) {
    const error = new Error();
    error.message = "No image picked.";
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found!");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.id.toString() !== req.userId) {
        const error = new Error("Unauthorized user!");
        error.statusCode = 403;
        throw error;
      }
      post.title = title;
      post.content = content;
      if (post.imageUrl !== imageUrl) {
        clearImage(post.imageUrl);
      }
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      return res.json({
        message: "Post updated.",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  let imageUrl;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found!");
        error.statusCode = 404;
        throw error;
      }
      imageUrl = post.imageUrl;
      if (post.creator.id.toString() !== req.userId) {
        const error = new Error("Unauthorized user!");
        error.statusCode = 403;
        throw error;
      }
      return Post.deleteOne({ _id: postId })
        .then((result) => {
          clearImage(imageUrl);
          return User.findById(req.userId);
        })
        .then((user) => {
          user.post.pull(postId);
          return user.save();
        })
        .then((result) => {
          return res.status(200).json({
            message: "Post delteed successful",
            result: result,
          });
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (imagePath) => {
  const filePath = path.join(__dirname, "..", imagePath);
  fs.unlink(filePath, (err) => {
    console.log(err);
  });
};
