import express from "express";
import PostModel from "../TABLES/postTable.js";
import CommentModel from "../TABLES/commentSchema.js";
import q2m from "query-to-mongo";
import { parseFile } from "../../../utils/upload.js";

//------------------------------------ global variables------------
const postRouter = express.Router();

postRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);

    const { total, posts } = await PostModel.findPostWithComments(mongoQuery);
    res.send({
      links: mongoQuery.links("/posts", total),
      total,
      pageTotal: Math.ceil(total / mongoQuery.options.limit),
      posts,
    });
  } catch (error) {
    next(error);
  }
});

//----------------------------GET ------------------------------------
/* postRouter.get("/", async (req, res, next) => {
  try {
    const post = await PostModel.find();
    res.send(post);
  } catch (error) {
    next(error);
  }
}); */

//----------------------------GET by ID------------------------------------
postRouter.get("/:postId", async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await PostModel.findById(postId);
    if (post) {
      res.send(post);
    } else {
      next(createHttpError(404, `Post with id ${postId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

//----------------------------POST -------------------------------------
postRouter.post("/", async (req, res, next) => {
  try {
    const newPost = new PostModel(req.body);
    const { _id } = await newPost.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

//----------------------------POST COMMENT-------------------------------------
// postRouter.post("/:postId/comment", async (req, res, next) => {
//   try {
//     const newComment = new CommentModel(req.body);
//     await newComment.save();

//     res.send("Comment posted");
//   } catch (error) {
//     next(error);
//   }
// });

postRouter.post("/:id/comment", async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) {
      res
        .status(404)
        .send({ message: `post with ${req.params.id} is not found!` });
    } else {
     
      await PostModel.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            comments: req.body,
          },
        },
        { new: true }
      );
      res.status(204).send();
    }
  } catch (error) {
    console.log(error);
    res.send(500).send({ message: error.message });
  }
});
///--------------------- get for comments
postRouter.get("/:postId/comment", async (req, res, next) => {
  try {
    const comments = await CommentModel.find();
    res.send(comments);
  } catch (error) {
    next(error);
  }
});

//---------------------------DELETE -------------------
postRouter.delete("/:postId", async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const deletedPost = await PostModel.findByIdAndDelete(postId);
    if (deletedPost) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `Post with id ${postId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

//---------------------PUT POST ---------------------------
postRouter.put("/:postId", async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.postId);
    const updatedPost = await PostModel.findByIdAndUpdate(post, req.body, {
      new: true,
    });
    if (updatedPost) {
      res.send(updatedPost);
    } else {
      next(
        createHttpError(404, `Post with id ${req.params.postId} doesn't exist`)
      );
    }
  } catch (error) {
    next(error);
  }
});

//--------------------------post img to post---------------------

postRouter.put(
  "/:postId/image",
  parseFile.single("image"),
  async (req, res, next) => {
    try {
      //console.log("PAth: ", req.file.path);
      const changedPost = await PostModel.findByIdAndUpdate(
        req.params.postId,
        { image: req.file.path },
        {
          new: true,
        }
      );
      res.status(201).send(changedPost);
    } catch (error) {
      next(error);
      console.log(error);
    }
  }
);

//---------------------PUT POST ---------------------------
postRouter.put("/:postId", async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.postId);
    const updatedPost = await PostModel.findByIdAndUpdate(post, req.body, {
      new: true,
    });
    if (updatedPost) {
      res.send(updatedPost);
    } else {
      next(
        createHttpError(404, `Post with id ${req.params.postId} doesn't exist`)
      );
    }
  } catch (error) {
    next(error);
  }
});

//LIKES

postRouter.get("/:postId/like", async (req, res, next) => {
  const posts = await PostModel.find({}).populate({
    path: "likes",
    select: "name surname",
  });
  res.send(posts);
});

postRouter.put("/:postId/like", async (req, res, next) => {
  try {
    const { id } = req.body;
    const isLiked = await PostModel.findOne({
      _id: req.params.postId,
      likes: id,
    });
    if (isLiked) {
      await PostModel.findByIdAndUpdate(req.params.postId, {
        $pull: { likes: id },
      });
      res.send("Unliked");
    } else {
      await PostModel.findByIdAndUpdate(req.params.postId, {
        $push: { likes: id },
      });
      res.send("Liked");
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
});
export default postRouter;
