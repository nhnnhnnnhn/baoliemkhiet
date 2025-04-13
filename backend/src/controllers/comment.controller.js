const commentService = require("../services/comment.service");
const controllerHandler = require("../utils/controllerHandler");

const createComment = controllerHandler(async (req, res) => {
  const user_id = Number(req.user.id);
  const { article_id, content } = req.body;
  const comment = await commentService.createComment(
    user_id,
    Number(article_id),
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

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
