const tagService = require("../services/tag.service");
const controllerHandler = require("../utils/controllerHandler");

const createTag = controllerHandler(async (req, res) => {
  const { name } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error("Tag name is required and must be a non-empty string");
  }

  const tag = await tagService.createTag(name.trim());
  res.status(201).json(tag);
});

const deleteTag = controllerHandler(async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    throw new Error("Invalid tag ID");
  }

  await tagService.deleteTag(parseInt(id));
  res.status(204).send();
});

const getAllTags = controllerHandler(async (req, res) => {
  const tags = await tagService.getAllTags();
  res.status(200).json(tags);
});

const getTagDetails = controllerHandler(async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    throw new Error("Invalid tag ID");
  }

  const tag = await tagService.getTagById(parseInt(id));
  res.status(200).json(tag);
});

const getArticleTags = controllerHandler(async (req, res) => {
  const { articleId } = req.params;

  if (isNaN(articleId)) {
    throw new Error("Invalid article ID");
  }

  const tags = await tagService.getTagsByArticle(parseInt(articleId));
  res.status(200).json(tags);
});

const updateTag = controllerHandler(async (req, res) => {
  const { id } = req.params;
  const { name} = req.body;

  if (isNaN(id)) {
    throw new Error("Invalid tag ID");
  }

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new Error("Tag name is required and must be a non-empty string");
  }

  const updatedTag = await tagService.updateTag(parseInt(id), name.trim());
  res.status(200).json(updatedTag);
});

module.exports = {
  createTag,
  deleteTag,
  getAllTags,
  getTagDetails,
  getArticleTags,
  updateTag,
};