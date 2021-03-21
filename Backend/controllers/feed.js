const fs = require("fs");
const path = require("path");

const io = require("../socket");
const Post = require("../models/post");
const User = require("../models/user");
const { validationResult } = require("express-validator");

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;

  const perPage = 2;
  let totalItems;
  try {
    const totalItems = await Post.countDocuments();
    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .sort({ CreatedAt: -1 });
    if (!posts) {
      const error = new Error("Posts not found!");
      error.statusCode = 404;
    }
    res.status(200).json({
      message: "Posts fetched successfully",
      posts: posts,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  try {
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
    if (!imageUrl) {
      const error = new Error();
      error.message = "Invalid image formate..";
      error.statusCode = 422;
      throw error;
    }
    const creator = await User.findById(req.userId);
    const post = new Post({
      title: title,
      content: content,
      imageUrl: newimageUrl,
      creator: {
        id: creator._id,
        name: creator.name,
      },
    });
    await post.save();
    await creator.post.push(post);
    await creator.save();
    io.getIO().emit("posts", {
      action: "create",
      post: { ...post._doc, creator: { _id: req.userId, name: creator.name } },
    });
    res.status(201).json({
      message: "Post created successfully!",
      post: post,
      creator: { _id: creator._id, name: creator.name },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post not found!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "Post fetched successfully",
      post: post,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
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
  try {
    const post = await Post.findById(postId).populate("creator");
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
    await post.save();
    io.getIO().emit("posts", { action: "update", post: post });

    res.json({
      message: "Post updated.",
      post: post,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  console.log(postId);
  let imageUrl;
  try {
    const post = await Post.findById(postId);
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
    await Post.deleteOne({ _id: postId });
    clearImage(imageUrl);
    const user = await User.findById(req.userId);

    await user.post.pull(postId);
    await user.save();
    io.getIO().emit("posts", {
      action: "delete",
      post: { postId: postId },
    });
    return res.status(200).json({
      message: "Post delteed successful",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const clearImage = (imagePath) => {
  const filePath = path.join(__dirname, "..", imagePath);
  fs.unlink(filePath, (err) => {
    console.log(err);
  });
};
