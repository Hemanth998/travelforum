const express = require("express");
const slugify = require("slugify");

const { check, validationResult } = require("express-validator");
const router = express.Router();

const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const User = require("../../models/User");

//Get all posts test route

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", ["userName"])
      .populate("likes.user", ["userName"])
      .populate("comments.user", ["userName"])
      .populate("places.place", ["placeName", "urlSlug"])
      .sort({ date: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server error");
  }
});

//Insert New Post route
router.post(
  "/",
  [
    auth,
    [
      check("title", "Title cannot be empty")
        .not()
        .isEmpty(),
      check("content", "COntent cannot be empty")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, content, places } = req.body;
      const user = await User.findById(req.user.id).select("-password");

      const urlSlug = slugify(title, {
        remove: /[*+~.(),#^'"!:@]/g,
        lower: true
      });

      const isExist = await Post.findOne({ urlSlug });

      if (isExist) {
        return res
          .status(400)
          .json({
            errors: [
              {
                msg:
                  "Hii!!, A post with similar or same title already exists, theres no unique slug for the title, try changing few characters for the title for now, we are working to generate unique slugs for each post, Thanks!!"
              }
            ]
          });
      }

      const newPost = new Post({
        user: req.user.id,
        title,
        urlSlug,
        content,
        places
      });

      await newPost.save();
      res.json({ msg: "Post Saved!" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server error");
    }
  }
);

//edit post route, only title,content,places are editable in UI.

router.put("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post Not Found!!" });
    }
    if (post.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({
          msg: "You are not authorized to edit,Only who posted can edit!!"
        });
    }

    const { title, content, places } = req.body;

    const updateFields = {};

    if (title) updateFields.title = title;
    if (content) updateFields.content = content;
    if (places) updateFields.places = places;

    await post.update(updateFields);

    res.status(200).json({ msg: "Post Changes Saved!!!" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post Not Found!!" });
    }
    res.status(500).send("Internal Server error");
  }
});

//delete post route

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post Not Found!!" });
    }

    if (post.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({
          msg: "You are not authorized to delete,Only who posted can delete!!"
        });
    }

    await post.remove();

    res.status(200).json({ msg: "Post Removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post Not Found!!" });
    }
    res.status(500).send("Internal Server error");
  }
});

//Api to like a post

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post Not Found!!" });
    }

    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post Not Found!!" });
    }
    res.status(500).send("Internal Server error");
  }
});

//api to unlike a post

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post Not Found!!" });
    }

    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    const removeIndex = post.likes.findIndex(
      like => like.user.toString() === req.user.id
    );

    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post Not Found!!" });
    }
    res.status(500).send("Internal Server error");
  }
});

//add comment

router.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "Comment Cannot Be Empty")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ msg: "Post Not Found!!" });
      }

      const newComment = {
        user: req.user.id,
        text: req.body.text
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Post Not Found!!" });
      }
      res.status(500).send("Internal Server error");
    }
  }
);

//remove comment

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post Not Found!!" });
    }

    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: "Comment NOt found" });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized to delete" });
    }

    const removeIndex = post.comments.findIndex(c => c.id === comment.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post Not Found!!" });
    }
    res.status(500).send("Internal Server error");
  }
});

//edit comment

router.put(
  "/comment/:id/:comment_id",
  [
    auth,
    [
      check("text", "comment cannot be empty")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ msg: "Post Not Found!!" });
      }

      const comment = post.comments.find(
        comment => comment.id === req.params.comment_id
      );

      if (!comment) {
        return res.status(404).json({ msg: "Comment NOt found" });
      }

      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "Not Authorized to edit" });
      }

      const editIndex = post.comments.findIndex(c => c.id === comment.id);

      post.comments[editIndex].text = req.body.text;

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Post Not Found!!" });
      }
      res.status(500).send("Internal Server error");
    }
  }
);

module.exports = router;
