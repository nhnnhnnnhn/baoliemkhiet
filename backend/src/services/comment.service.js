const { PrismaClient, CommentStatus } = require("@prisma/client");
const prisma = new PrismaClient();
const extractJSON = require("../utils/extractJson.util");
const deepseek = require("../deepseek/deepseek.js").deepseek;
const sendNotification = require("../websocket").sendNotification;

async function createComment(user_id, article_id, content) {
  try {
    // Đảm bảo chuyển đổi thành số nguyên
    const userId = Number(user_id);
    const articleId = Number(article_id);

    // Kiểm tra user
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    });
    
    if (!user) {
      throw new Error("User not found");
    }

    // Kiểm tra article
    const article = await prisma.article.findFirst({
      where: {
        id: articleId
      }
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

    // Biến để lưu trạng thái cuối cùng
    let finalStatus = CommentStatus.PENDING;
    
    try {
      // Gọi deepseek (bọc trong try/catch riêng để không ảnh hưởng đến việc tạo comment)
      const response = await deepseek(content);
      if (response) {
        const jsonResponse = await extractJSON(response);
        console.log('Deepseek response:', jsonResponse);
        
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
      console.error("Error with deepseek API, defaulting to PENDING status:", deepseekError);
      // Không ném lỗi, để tiếp tục xử lý và tạo comment thành công
    }

    // Cập nhật trạng thái của comment
    const updateComment = await prisma.comment.update({
      where: { 
        id: comment.id 
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
            avatar: true
          }
        }
      }
    });
    
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
        id: articleId
      }
    });
    
    if (!article) {
      throw new Error("Article not found");
    }

    // Lấy các comment của article
    const comments = await prisma.comment.findMany({
      where: { 
        articleId: articleId,
        status: CommentStatus.APPROVED 
      },
      orderBy: { 
        createdAt: "desc" 
      },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
            avatar: true
          }
        }
      }
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
        id: commentId
      }
    });
    
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Cập nhật nội dung comment
    const updatedComment = await prisma.comment.update({
      where: { 
        id: commentId 
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
        id: commentId 
      },
      data: {
        status: status,
      },
    });
    
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
        id: commentId
      }
    });
    
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Xóa comment
    const deletedComment = await prisma.comment.delete({
      where: { 
        id: commentId 
      },
    });
    
    return deletedComment;
  } catch (error) {
    console.error("Error in deleteComment:", error);
    throw error;
  }
}

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
