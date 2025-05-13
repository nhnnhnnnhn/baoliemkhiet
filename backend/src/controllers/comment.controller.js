const commentService = require("../services/comment.service");
const controllerHandler = require("../utils/controllerHandler");

const createComment = controllerHandler(async (req, res) => {
  const user_id = Number(req.user.id);
  const { articleId, authorId, content } = req.body;

  console.log("Request body:", req.body);
  console.log("User from token:", req.user);

  const comment = await commentService.createComment(
    user_id,
    Number(articleId),
    content
  );
  res.status(201).json(comment);
});

const getComments = controllerHandler(async (req, res) => {
  const article_id = Number(req.params.article_id);
  const comments = await commentService.getComments(article_id);
  res.status(200).json(comments);
});

const updateComment = controllerHandler(async (req, res) => {
  const comment_id = Number(req.params.comment_id);
  const { content } = req.body;
  const updatedComment = await commentService.updateComment(
    comment_id,
    content
  );
  res.status(200).json(updatedComment);
});

const deleteComment = controllerHandler(async (req, res) => {
  const comment_id = Number(req.params.comment_id);
  await commentService.deleteComment(comment_id);
  res.status(204).send();
});

const getAllComments = controllerHandler(async (req, res) => {
  const comments = await commentService.getAllComments();
  res.status(200).json(comments);
});

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  getAllComments,
};
