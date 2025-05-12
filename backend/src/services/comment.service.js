const { PrismaClient, CommentStatus } = require("@prisma/client");
const prisma = new PrismaClient();
const extractJSON = require("../utils/extractJson.util");
const deepseek = require("../deepseek/deepseek.js").deepseek;
const sendNotification = require("../websocket").sendNotification;

async function createComment(user_id, article_id, content) {
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

  const comment = await prisma.comment.create({
    data: {
      articleId: article_id,
      userId: user_id,
      content: content,
      status: CommentStatus.PENDING,
    },
  });

  const response = await deepseek(content);

  if (!response) {
    throw new Error("No response from Python script");
  }
  const jsonResponse = await extractJSON(response);
  console.log(jsonResponse.data.detect);

  let status = CommentStatus.PENDING;
  if (!jsonResponse.data.detect) {
    status = CommentStatus.APPROVED;
  } else if (jsonResponse.data.detect == true) {
    status = CommentStatus.REJECTED_BY_AI;
  }
  const commentId = comment.id;
  if (status == CommentStatus.REJECTED_BY_AI) {
    const notification = {
      receiver_id: user_id,
      content: "Your comment has been rejected",
      type: "COMMENT",
      article_id: article_id,
    };
    await sendNotification(
      notification.receiver_id,
      notification.content,
      notification.type,
      notification.article_id
    );
  }

  const updateComment = await prisma.comment.update({
    where: { id: commentId },
    data: {
      status: status,
    },
  });
  return updateComment;
}

async function getComments(article_id) {
  const article = await prisma.post.findUnique({
    where: { id: article_id },
  });
  if (!article) {
    throw new Error("Article not found");
  }

  const comments = await prisma.comment.findMany({
    where: { articleId: article_id, status: CommentStatus.APPROVED },
    orderBy: { createdAt: "desc" },
  });
  return comments;
}

async function updateComment(comment_id, content) {
  const comment = await prisma.comment.findUnique({
    where: { id: comment_id },
  });
  if (!comment) {
    throw new Error("Comment not found");
  }

  const updatedComment = await prisma.comment.update({
    where: { id: comment_id },
    data: {
      content: content,
      status: CommentStatus.PENDING, // Reset status to PENDING when updating
    },
  });
  const response = await deepseek(content);

  if (!response) {
    throw new Error("No response from Python script");
  }
  const jsonResponse = await extractJSON(response);
  console.log(jsonResponse.data.detect);

  let status = CommentStatus.PENDING;
  if (!jsonResponse.data.detect) {
    status = CommentStatus.APPROVED;
  } else if (jsonResponse.data.detect == true) {
    status = CommentStatus.REJECTED_BY_AI;
  }
  const commentId = comment.id;

  const updateCommentStatus = await prisma.comment.update({
    where: { id: commentId },
    data: {
      status: status,
    },
  });
  // Return the updated comment
  return updateCommentStatus;
}

async function deleteComment(comment_id) {
  const comment = await prisma.comment.findUnique({
    where: { id: comment_id },
  });
  if (!comment) {
    throw new Error("Comment not found");
  }

  const deletedComment = await prisma.comment.delete({
    where: { id: comment_id },
  });
  return deletedComment;
}

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
