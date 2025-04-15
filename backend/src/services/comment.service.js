const { PrismaClient, CommentStatus } = require("@prisma/client");
const prisma = new PrismaClient();
const extractJSON = require("../utils/extractJson.util");
const deepseek = require("../deepseek/deepseek.js").deepseek;

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

  const updateComment = await prisma.comment.update({
    where: { id: commentId },
    data: {
      status: status,
    },
  });
  return updateComment;
}

async function getComments(article_id) {
  const article = await prisma.article.findUnique({
    where: { id: article_id },
  });
  if (!article) {
    throw new Error("Article not found");
  }

  const comments = await prisma.comment.findMany({
    where: { articleId: article_id },
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
  shell.send({ content: content });
  shell.on("message", async function (message) {
    const response = message.response;
    if (!response) {
      throw new Error("No response from Python script");
    }
    const jsonResponse = extractJSON(response);
    let status = CommentStatus.PENDING;
    if (jsonResponse.data.detect) status = CommentStatus.APPROVED;
    else if (jsonResponse.data.detect === false)
      status = CommentStatus.REJECTED_BY_AI;

    await prisma.comment.update({
      where: { id: comment_id },
      data: {
        status: status,
      },
    });
    console.log(`Comment status updated to: ${status}`);
  });
  shell.end(function (err, code, signal) {
    if (err) throw err;
    console.log(`Script finished with code ${code}`);
  });
  // Return the updated comment
  return updatedComment;
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
