const likeService = require("../services/like.service");
const controllerHandler = require("../utils/controllerHandler");

const createLike = controllerHandler(async (req, res) => {
  const user_id = req.user.id;
  const article_id = Number(req.params.article_id);
  if (isNaN(article_id)) {
    throw new Error("Invalid article_id");
  }
  const like = await likeService.createLike(user_id, article_id);
  res.status(201).json(like);
});
const deleteLike = controllerHandler(async (req, res) => {
  const user_id = req.user.id;
  const article_id = Number(req.params.article_id);
  if (isNaN(article_id)) {
    throw new Error("Invalid article_id");
  }
  await likeService.deleteLike(user_id, article_id);
  res.status(204).send();
});
const getLikesByArticleId = controllerHandler(async (req, res) => {
  const article_id = Number(req.params.article_id);
  if (isNaN(article_id)) {
    throw new Error("Invalid article_id");
  }
  const likes = await likeService.getLikesByArticleId(article_id);
  res.status(200).json(likes);
});
module.exports = {
  createLike,
  deleteLike,
  getLikesByArticleId,
};
