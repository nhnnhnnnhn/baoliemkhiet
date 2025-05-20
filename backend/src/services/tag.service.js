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

  const deletedTag = await prisma.tag.delete({
    where: { id },
  });
  return deletedTag;
}

async function getAllTags() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });
  const tagsWithArticleCount = await Promise.all(
    tags.map(async (tag) => {
      const articleCount = await prisma.articleTag.count({
        where: { tagId: tag.id },
      });
      return { ...tag, articleCount };
    })
  );
  return tagsWithArticleCount;
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

async function updateTag(id, name) {
  const tag = await prisma.tag.findUnique({
    where: { id },
  });
  if (!tag) {
    throw new Error("Tag not found");
  }

  const existingTag = await prisma.tag.findUnique({
    where: { name },
  });
  if (existingTag) {
    throw new Error("Tag already exists");
  }

  const updatedTag = await prisma.tag.update({  
    where: { id },
    data: { name},
  });
  return updatedTag;
}


module.exports = {
  createTag,
  deleteTag,
  getAllTags,
  getTagById,
  getTagsByArticle,
  updateTag,
};