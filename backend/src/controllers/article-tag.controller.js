const articleTagService = require("../services/article-tag.service");
const controllerHandler = require("../utils/controllerHandler");

const addTagToArticle = controllerHandler(async (req, res) => {
  const { articleId } = req.params;
  const { tagId } = req.body;

  if (isNaN(articleId) || isNaN(tagId)) {
    throw new Error("Article ID and Tag ID must be valid numbers");
  }

  const articleTag = await articleTagService.addTagToArticle(
    parseInt(articleId),
    parseInt(tagId)
  );
  res.status(201).json(articleTag);
});

const removeTagFromArticle = controllerHandler(async (req, res) => {
  const { articleId, tagId } = req.params;

  if (isNaN(articleId) || isNaN(tagId)) {
    throw new Error("Article ID and Tag ID must be valid numbers");
  }

  await articleTagService.removeTagFromArticle(
    parseInt(articleId),
    parseInt(tagId)
  );
  res.status(204).send();
});

const getArticleTags = controllerHandler(async (req, res) => {
  const { articleId } = req.params;

  if (isNaN(articleId)) {
    throw new Error("Article ID must be a valid number");
  }

  const tags = await articleTagService.getArticleTags(parseInt(articleId));
  res.status(200).json(tags);
});

const updateArticleTags = controllerHandler(async (req, res) => {
  const { articleId } = req.params;
  const { tagIds } = req.body;

  if (isNaN(articleId)) {
    throw new Error("Article ID must be a valid number");
  }

  if (!Array.isArray(tagIds)) {
    throw new Error("tagIds must be an array");
  }

  if (tagIds.some(id => isNaN(id))) {
    throw new Error("All tag IDs must be valid numbers");
  }

  const tags = await articleTagService.updateArticleTags(
    parseInt(articleId),
    tagIds.map(id => parseInt(id))
  );
  res.status(200).json(tags);
});

module.exports = {
  addTagToArticle,
  removeTagFromArticle,
  getArticleTags,
  updateArticleTags,
};