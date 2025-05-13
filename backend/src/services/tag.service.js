const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createTag(name) {
  // Check if tag already exists
  const existingTag = await prisma.tag.findUnique({
    where: { name },
  });
  if (existingTag) {
    throw new Error("Tag already exists");
  }

  const tag = await prisma.tag.create({
    data: { name },
  });
  return tag;
}

async function deleteTag(id) {
  const tag = await prisma.tag.findUnique({
    where: { id },
  });
  if (!tag) {
    throw new Error("Tag not found");
  }

  // Check if tag is used in any articles
  const usedInArticles = await prisma.articleTag.findFirst({
    where: { tagId: id },
  });
  if (usedInArticles) {
    throw new Error("Cannot delete tag that is used in articles");
  }

  const deletedTag = await prisma.tag.delete({
    where: { id },
  });
  return deletedTag;
}

async function getAllTags() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: {
      articles: true
    }
  });

  return tags.map(({ articles, ...tag }) => ({
    id: tag.id,
    name: tag.name,
    articleCount: articles.length
  }));
}

async function getTagById(id) {
  const tag = await prisma.tag.findUnique({
    where: { id },
  });
  if (!tag) {
    throw new Error("Tag not found");
  }
  return tag;
}

async function getTagsByArticle(articleId) {
  const articleTags = await prisma.articleTag.findMany({
    where: { articleId },
    include: {
      tag: true,
    },
  });
  return articleTags.map(at => at.tag);
}

module.exports = {
  createTag,
  deleteTag,
  getAllTags,
  getTagById,
  getTagsByArticle,
};