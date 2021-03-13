const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    imageUrl: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    creator: {
      id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true,
      },
      name: {
        type: String,
        require: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
