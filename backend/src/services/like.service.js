const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const sendNotification = require("../websocket").sendNotification;

async function createLike(user_id, article_id) {
  const user = await prisma.user.findUnique({
    where: { id: user_id },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const article = await prisma.article.findUnique({
    where: { id: article_id },
  });
  if (!article) {
    throw new Error("Article not found");
  }

  const like = await prisma.articleLike.create({
    data: {
      userId: user_id,
      articleId: article_id,
    },
  });
  const notification = {
    receiver_id: article.authorId,
    content: `${user.fullname} has liked your article`,
    type: "LIKE",
    article_id: article_id,
  };
  await sendNotification(
    notification.receiver_id,
    notification.content,
    notification.type,
    notification.article_id
  );

  return like;
}

async function deleteLike(user_id, article_id) {
  const like = await prisma.articleLike.findUnique({
    where: {
      userId: user_id,
      articleId: article_id,
    },
  });
  if (!like) {
    throw new Error("Like not found");
  }

  const deletedLike = await prisma.articleLike.delete({
    where: {
      userId: user_id,
      articleId: article_id,
    },
  });
  return deletedLike;
}
async function getLikesByArticleId(article_id) {
  const article = await prisma.article.findUnique({
    where: { id: article_id },
  });
  if (!article) {
    throw new Error("Article not found");
  }

  const likes_count = await prisma.articleLike.count({
    where: { articleId: article_id },
  });

  return likes_count;
}

module.exports = {
  createLike,
  deleteLike,
  getLikesByArticleId,
};
