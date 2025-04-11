const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addTagToArticle(articleId, tagId) {
  // Check if article exists
  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });
  if (!article) {
    throw new Error("Article not found");
  }

  // Check if tag exists
  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
  });
  if (!tag) {
    throw new Error("Tag not found");
  }

  // Check if relation already exists
  const existingRelation = await prisma.articleTag.findFirst({
    where: {
      articleId,
      tagId,
    },
  });
  if (existingRelation) {
    throw new Error("Tag is already added to this article");
  }

  const articleTag = await prisma.articleTag.create({
    data: {
      articleId,
      tagId,
    },
    include: {
      tag: true,
    },
  });
  return articleTag;
}

async function removeTagFromArticle(articleId, tagId) {
  // Check if relation exists
  const articleTag = await prisma.articleTag.findFirst({
    where: {
      articleId,
      tagId,
    },
  });
  if (!articleTag) {
    throw new Error("Tag is not associated with this article");
  }

  const deletedArticleTag = await prisma.articleTag.delete({
    where: {
      id: articleTag.id,
    },
    include: {
      tag: true,
    },
  });
  return deletedArticleTag;
}

async function getArticleTags(articleId) {
  // Check if article exists
  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });
  if (!article) {
    throw new Error("Article not found");
  }

  const articleTags = await prisma.articleTag.findMany({
    where: {
      articleId,
    },
    include: {
      tag: true,
    },
  });
  
  // Return only the tags
  return articleTags.map(at => at.tag);
}

async function updateArticleTags(articleId, tagIds) {
  // Check if article exists
  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });
  if (!article) {
    throw new Error("Article not found");
  }

  // Check if all tags exist
  const tags = await prisma.tag.findMany({
    where: {
      id: {
        in: tagIds,
      },
    },
  });
  if (tags.length !== tagIds.length) {
    throw new Error("One or more tags not found");
  }

  // Delete existing relations
  await prisma.articleTag.deleteMany({
    where: {
      articleId,
    },
  });

  // Create new relations
  const newArticleTags = await prisma.articleTag.createMany({
    data: tagIds.map(tagId => ({
      articleId,
      tagId,
    })),
  });

  // Return updated tags
  return getArticleTags(articleId);
}

module.exports = {
  addTagToArticle,
  removeTagFromArticle,
  getArticleTags,
  updateArticleTags,
};