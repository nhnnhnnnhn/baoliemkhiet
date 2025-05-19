const { PrismaClient, CommentStatus } = require("@prisma/client");
const prisma = new PrismaClient();
const extractJSON = require("../utils/extractJson.util");
const deepseek = require("../deepseek/deepseek.js").deepseek;
const sendNotification = require("../websocket").sendNotification;
const notificationService = require("./notification.service");

async function createComment(user_id, article_id, content) {
  try {
    // Đảm bảo chuyển đổi thành số nguyên
    const userId = Number(user_id);
    const articleId = Number(article_id);

    console.log(
      `[DEBUG] Creating comment for user ${userId} on article ${articleId}`
    );

    // Kiểm tra user
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Kiểm tra article
    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
      },
      include: {
        author: {
          select: {
            id: true,
            fullname: true,
            email: true,
          },
        },
      },
    });

    if (!article) {
      throw new Error("Article not found");
    }

    // Tạo comment với trạng thái PENDING
    const comment = await prisma.comment.create({
      data: {
        articleId: articleId,
        userId: userId,
        content: content,
        status: CommentStatus.PENDING,
      },
    });
    console.log(`[DEBUG] Comment created with ID: ${comment.id}`);

    // Biến để lưu trạng thái cuối cùng
    let finalStatus = CommentStatus.PENDING;

    try {
      // Gọi deepseek (bọc trong try/catch riêng để không ảnh hưởng đến việc tạo comment)
      const response = await deepseek(content);
      if (response) {
        const jsonResponse = await extractJSON(response);
        console.log("Deepseek response:", jsonResponse);

        if (!jsonResponse.data.detect) {
          finalStatus = CommentStatus.APPROVED;
        } else if (jsonResponse.data.detect == true) {
          finalStatus = CommentStatus.REJECTED_BY_AI;
        }

        // Xử lý thông báo nếu bị từ chối
        if (finalStatus === CommentStatus.REJECTED_BY_AI) {
          try {
            const notification = {
              receiver_id: userId,
              content: "Your comment has been rejected",
              type: "COMMENT",
              article_id: articleId,
            };
            await sendNotification(
              notification.receiver_id,
              notification.content,
              notification.type,
              notification.article_id
            );
          } catch (notifError) {
            console.error("Failed to send notification:", notifError);
          }
        }
      }
    } catch (deepseekError) {
      console.error(
        "Error with deepseek API, defaulting to PENDING status:",
        deepseekError
      );
      // Không ném lỗi, để tiếp tục xử lý và tạo comment thành công
    }

    // Cập nhật trạng thái của comment
    const updateComment = await prisma.comment.update({
      where: {
        id: comment.id,
      },
      data: {
        status: finalStatus,
      },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    // Gửi thông báo đến admin
    try {
      // Lấy thông tin bài viết để đưa vào thông báo
      const articleInfo = await prisma.article.findUnique({
        where: { id: articleId },
        select: {
          title: true,
          authorId: true,
        },
      });

      const articleTitle = articleInfo?.title || `Bài viết #${articleId}`;
      const commenterName =
        user.fullname || user.email || `Người dùng #${userId}`;
      const authorId = articleInfo?.author_id;

      // Tìm tất cả admin users
      const admins = await prisma.user.findMany({
        where: {
          role: "ADMIN",
        },
      });

      console.log(
        `[DEBUG] Found ${admins.length} admins:`,
        admins.map((a) => a.id)
      );

      // Notification content
      const notificationContent = `${commenterName} đã bình luận về "${articleTitle}"`;
      console.log(`[DEBUG] Notification content: "${notificationContent}"`);

      // Tạo danh sách người nhận (đảm bảo không trùng lặp)
      const recipientIds = new Set();

      // 1. Thêm các admin vào danh sách người nhận
      if (admins.length > 0) {
        for (const admin of admins) {
          recipientIds.add(admin.id);
        }
      }

      // 2. Thêm tác giả bài viết vào danh sách người nhận (nếu không phải là người comment)
      if (authorId && authorId !== userId) {
        recipientIds.add(authorId);
      }

      console.log(
        `[DEBUG] Recipients for notification:`,
        Array.from(recipientIds)
      );

      // Gửi thông báo cho tất cả người nhận
      for (const recipientId of recipientIds) {
        try {
          console.log(`[DEBUG] Sending notification to user ${recipientId}`);
          // Chỉ sử dụng sendNotification vì hàm này đã lưu vào DB
          await sendNotification(
            recipientId,
            notificationContent,
            "COMMENT",
            articleId
          );
        } catch (wsError) {
          console.error(
            `Failed to send notification to user ${recipientId}:`,
            wsError
          );
        }
      }
    } catch (notifError) {
      console.error("Failed to send notifications:", notifError);
      // Không throw error để không ảnh hưởng đến việc tạo comment
    }

    return updateComment;
  } catch (error) {
    console.error("Error in createComment:", error);
    throw error;
  }
}

async function getComments(article_id) {
  try {
    // Đảm bảo chuyển đổi thành số nguyên
    const articleId = Number(article_id);

    // Kiểm tra article
    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
      },
      include: {
        author: {
          select: {
            id: true,
            fullname: true,
            email: true,
          },
        },
      },
    });

    if (!article) {
      throw new Error("Article not found");
    }

    // Lấy các comment của article
    const comments = await prisma.comment.findMany({
      where: {
        articleId: articleId,
        status: CommentStatus.APPROVED,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return comments;
  } catch (error) {
    console.error("Error in getComments:", error);
    throw error;
  }
}

async function updateComment(comment_id, content) {
  try {
    // Đảm bảo chuyển đổi thành số nguyên
    const commentId = Number(comment_id);

    // Kiểm tra comment
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
          },
        },
        article: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    // Cập nhật nội dung comment
    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: content,
        status: CommentStatus.PENDING, // Reset status to PENDING when updating
      },
    });

    // Gọi deepseek
    const response = await deepseek(content);
    if (!response) {
      throw new Error("No response from Python script");
    }

    // Xử lý phản hồi
    const jsonResponse = await extractJSON(response);
    console.log(jsonResponse.data.detect);

    let status = CommentStatus.PENDING;
    if (!jsonResponse.data.detect) {
      status = CommentStatus.APPROVED;
    } else if (jsonResponse.data.detect == true) {
      status = CommentStatus.REJECTED_BY_AI;
    }

    // Cập nhật trạng thái
    const updateCommentStatus = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        status: status,
      },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    // Gửi thông báo đến admin khi comment được cập nhật
    try {
      // Chỉ gửi thông báo nếu comment được phê duyệt
      if (status === CommentStatus.APPROVED) {
        const articleId = comment.article.id;
        const articleTitle = comment.article.title || `Bài viết #${articleId}`;
        const commenterName =
          comment.user.fullname ||
          comment.user.email ||
          `Người dùng #${comment.user.id}`;
        const authorId = comment.article.author_id;

        // Tìm tất cả admin users
        const admins = await prisma.user.findMany({
          where: {
            role: "ADMIN",
          },
        });

        // Notification content
        const notificationContent = `${commenterName} đã cập nhật bình luận về "${articleTitle}"`;

        // Tạo danh sách người nhận (đảm bảo không trùng lặp)
        const recipientIds = new Set();

        // 1. Thêm các admin vào danh sách người nhận
        if (admins.length > 0) {
          for (const admin of admins) {
            recipientIds.add(admin.id);
          }
        }

        // 2. Thêm tác giả bài viết vào danh sách người nhận (nếu không phải là người comment)
        if (authorId && authorId !== comment.user.id) {
          recipientIds.add(authorId);
        }

        // Gửi thông báo cho tất cả người nhận
        for (const recipientId of recipientIds) {
          // Chỉ sử dụng sendNotification vì hàm này đã lưu vào DB
          try {
            await sendNotification(
              recipientId,
              notificationContent,
              "COMMENT",
              articleId
            );
          } catch (wsError) {
            console.error(
              `Failed to send notification to user ${recipientId}:`,
              wsError
            );
          }
        }
      }
    } catch (notifError) {
      console.error("Failed to send notifications:", notifError);
      // Không throw error để không ảnh hưởng đến việc cập nhật comment
    }

    return updateCommentStatus;
  } catch (error) {
    console.error("Error in updateComment:", error);
    throw error;
  }
}

async function deleteComment(comment_id) {
  try {
    // Đảm bảo chuyển đổi thành số nguyên
    const commentId = Number(comment_id);

    // Kiểm tra comment
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    // Xóa comment
    const deletedComment = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return deletedComment;
  } catch (error) {
    console.error("Error in deleteComment:", error);
    throw error;
  }
}

async function getAllComments(offset = 0, limit = 10) {
  return await prisma.comment.findMany({
    skip: (offset - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },

    include: {
      user: {
        select: {
          id: true,
          fullname: true,
          email: true,
          avatar: true,
        },
      },
      article: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  getAllComments,
};
