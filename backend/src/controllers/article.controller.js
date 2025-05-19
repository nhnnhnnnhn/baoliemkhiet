const express = require("express");
const controllerHandler = require("../utils/controllerHandler");
const service = require("../services/article.service");

// Create a new article
module.exports.createArticle = controllerHandler(async (req, res) => {
  const {
    title,
    content,
    thumbnail,
    authorId,
    categoryId,
    status,
    publishedAt,
  } = req.body;
  if (!title || !content || !authorId || !categoryId) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const article = await service.createArticle(
    title,
    content,
    thumbnail,
    authorId,
    categoryId,
    status,
    publishedAt
  );
  res.status(201).json({ message: "Create successfully!", article });
});

// Get all articles
module.exports.getAllArticles = controllerHandler(async (req, res) => {
  const articles = await service.getAllArticles();
  res.status(200).json(articles);
});

// Get all posted articles
module.exports.getAllPostedArticles = controllerHandler(async (req, res) => {
  const author_id = req.user.id;
  const articles = await service.getAllPostedArticles(author_id);
  res.status(200).json(articles);
});

// Get a single article by ID
module.exports.getArticleById = controllerHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Missing article ID" });
  }
  const article = await service.getArticleById(id);
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }
  res.status(200).json(article);
});

// Get most 5 viewed articles
module.exports.getMostViewedArticles = controllerHandler(async (req, res) => {
  const { timePeriod } = req.query;
  if (!timePeriod) {
    return res.status(400).json({ message: "Missing time period" });
  }
  const articles = await service.getMostViewedArticles(timePeriod);
  res.status(200).json(articles);
});

// Get articles by category
module.exports.getArticlesByCategory = controllerHandler(async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId) {
    return res.status(400).json({ message: "Missing category ID" });
  }
  const {articles, numberOfArticles} = await service.getArticlesByCategory(categoryId);
  res.status(200).json({articles, numberOfArticles});
});

// Get articles by author
module.exports.getArticlesByAuthor = controllerHandler(async (req, res) => {
  const { authorId } = req.params;
  if (!authorId) {
    return res.status(400).json({ message: "Missing author ID" });
  }
  const {articles, numberOfArticles} = await service.getArticlesByAuthor(authorId);
  res.status(200).json({articles, numberOfArticles});
});

// Get articles by author
module.exports.getPostArticlesByAuthor = controllerHandler(async (req, res) => {
  const { authorId } = req.params;
  if (!authorId) {
    return res.status(400).json({ message: "Missing author ID" });
  }
  const {articles, numberOfArticles} = await service.getPostArticlesByAuthor(authorId);
  res.status(200).json({articles, numberOfArticles});
});

// Get articles statistics
module.exports.getArticlesStatistics = controllerHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Missing article ID" });
  }
  const statistics = await service.getArticlesStatistics(id);
  res.status(200).json(statistics);
});

// Get most 5 liked articles
module.exports.getMostLikedArticles = controllerHandler(async (req, res) => {
  const articles = await service.getMostLikedArticles();
  res.status(200).json(articles);
});

// Get articles by status
module.exports.getArticlesByStatus = controllerHandler(async (req, res) => {
  const { status } = req.params;
  if (!status) {
    return res.status(400).json({ message: "Missing status" });
  }
  const articles = await service.getArticlesByStatus(status);
  res.status(200).json(articles);
});

// Get articles by tag
module.exports.getArticlesByTag = controllerHandler(async (req, res) => {
  const { tagId } = req.params;
  if (!tagId || isNaN(tagId)) {
    return res.status(400).json({ message: "Missing tag ID" });
  }
  const articles = await service.getArticlesByTag(tagId);
  res.status(200).json(articles);
});

// Get articles by date range
module.exports.getArticlesByDateRange = controllerHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Missing date range" });
  }
  const articles = await service.getArticlesByDateRange(startDate, endDate);
  res.status(200).json(articles);
});

// Get related articles
module.exports.getRelatedArticles = controllerHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Missing article ID" });
  }
  const articles = await service.getRelatedArticles(id);
  res.status(200).json(articles);
});

// Get statistics
module.exports.getStatistics = controllerHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  if (
    !startDate ||
    !endDate ||
    isNaN(Date.parse(startDate)) ||
    isNaN(Date.parse(endDate))
  ) {
    return res.status(400).json({ message: "Missing date range" });
  }
  const statistics = await service.getStatistics(startDate, endDate);
  res.status(200).json(statistics);
});

// Search articles
module.exports.searchArticles = controllerHandler(async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) {
    return res.status(400).json({ message: "Missing search keyword" });
  }
  const articles = await service.searchArticles(keyword);
  res.status(200).json(articles);
});

// Edit an article
module.exports.editArticle = controllerHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Missing article ID" });
  }
  const {
    title,
    content,
    thumbnail,
    authorId,
    categoryId,
    status,
    publishedAt,
  } = req.body;
  const article = await service.editArticle(
    id,
    title,
    content,
    thumbnail,
    authorId,
    categoryId,
    status,
    publishedAt
  );
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }
  res.status(200).json({ message: "Update successfully!", article });
});

// Approve an article
module.exports.approveArticle = controllerHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Missing article ID" });
  }
  const article = await service.approveArticle(id);
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }
  res.status(200).json({ message: "Approve successfully!", article });
});

// Reject an article
module.exports.rejectArticle = controllerHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Missing article ID" });
  }
  const article = await service.rejectArticle(id);
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }
  res.status(200).json({ message: "Reject successfully!", article });
});

// Delete an article
module.exports.deleteArticle = controllerHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Missing article ID" });
  }
  const article = await service.deleteArticle(id);
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }
  res.status(200).json({ message: "Delete successfully!", article });
});

// Delete multiple articles
module.exports.deleteMultipleArticles = controllerHandler(async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ message: "Missing article IDs" });
  }
  const articles = await service.deleteMultipleArticles(ids);
  if (!articles) {
    return res.status(404).json({ message: "Articles not found" });
  }
  res.status(200).json({ message: "Delete successfully!", articles });
});
