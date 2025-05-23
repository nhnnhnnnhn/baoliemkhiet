const { PrismaClient, ArticleStatus } = require("@prisma/client");
const cron = require("node-cron");
const prisma = new PrismaClient();
const sendNotification = require("../websocket").sendNotification;

// Create a new article
module.exports.createArticle = async (
  title,
  content,
  thumbnail,
  authorId,
  categoryId,
  status,
  publishedAt
) => {
  try {
    // Bước 1: Khai báo biến mặc định
    let publishedDate = null;
    let isPublish = false;
    let slugify = (text) => {
      return text
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-");
    };
    let slug = slugify(title) + "-" + Date.now();

    // Bước 2: Xử lý trạng thái
    if (status === "APPROVED" || status === "PUBLISHED") {
      // Đặt cờ isPublish = true ngày khi được duyệt
      isPublish = true;

      // Bước 3: Xử lý ngày xuất bản
      if (publishedAt) {
        try {
          // Thử xử lý ngày để đảm bảo định dạng chính xác
          const date = new Date(publishedAt);

          if (!isNaN(date.getTime())) {
            // Nếu ngày hợp lệ, sử dụng
            publishedDate = date;
            console.log(
              "[CREATE] Sử dụng ngày xuất bản được chỉ định:",
              publishedDate.toISOString()
            );
          } else {
            // Nếu ngày không hợp lệ, sử dụng ngày hiện tại
            publishedDate = new Date();
            console.log(
              "[CREATE] Ngày xuất bản không hợp lệ, sử dụng ngày hiện tại:",
              publishedDate.toISOString()
            );
          }
        } catch (error) {
          // Nếu có lỗi, sử dụng ngày hiện tại
          publishedDate = new Date();
          console.log(
            "[CREATE] Lỗi xử lý ngày xuất bản, sử dụng ngày hiện tại:",
            publishedDate.toISOString()
          );
        }
      } else {
        // Nếu không cung cấp ngày, sử dụng ngày hiện tại
        publishedDate = new Date();
        console.log(
          "[CREATE] Không có ngày xuất bản, sử dụng ngày hiện tại:",
          publishedDate.toISOString()
        );
      }
    } else {
      // Nếu không phải trạng thái được duyệt, đặt cờ isPublish = false
      isPublish = false;
      publishedDate = null; // Rõ ràng về việc chưa có ngày xuất bản
      console.log(
        "[CREATE] Bài viết chưa được duyệt, không có ngày xuất bản và không được xuất bản"
      );
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        thumbnail,
        authorId,
        categoryId,
        status,
        publishedAt: publishedDate,
        isPublish: isPublish,
        view: 0,
      },
    });
    if (status === ArticleStatus.PENDING) {
      const user = await prisma.user.findUnique({
        where: { id: authorId },
      });
      if (user) {
        // Send notification to the admin
        const notification = {
          receiver_id: 1,
          content: `An article "${title}" of "${user.fullname}" is pending for review.`,
          type: "ARTICLE_STATUS",
          article_id: article.id,
        };
        await sendNotification(
          notification.receiver_id,
          notification.content,
          notification.type,
          notification.article_id
        );
        // Send notification to the author
        const author_notification = {
          receiver_id: authorId,
          content: `Your article "${title}" is pending for review.`,
          type: "ARTICLE_STATUS",
          article_id: article.id,
        };
        await sendNotification(
          author_notification.receiver_id,
          author_notification.content,
          author_notification.type,
          author_notification.article_id
        );
      }
    }
    return article;
  } catch (error) {
    throw new Error("Error creating article: " + error.message);
  }
};

// Get all articles
module.exports.getAllArticles = async (params = {}) => {
  const { 
    page = 1, 
    limit = 10, 
    sort = 'id', 
    order = 'asc',
    search = '', 
    status,
    category_id,
    author_id
  } = params;
  
  // Tính toán số lượng bản ghi cần bỏ qua
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Xây dựng điều kiện tìm kiếm
  const where = {};
  
  // Thêm điều kiện tìm kiếm nếu có
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  // Thêm điều kiện lọc theo trạng thái
  if (status) {
    where.status = status;
  }
  
  // Thêm điều kiện lọc theo danh mục
  if (category_id) {
    where.categoryId = parseInt(category_id);
  }
  
  // Thêm điều kiện lọc theo tác giả
  if (author_id) {
    where.authorId = parseInt(author_id);
  }
  
  // Xây dựng điều kiện sắp xếp
  let orderBy = {};
  if (sort === 'id') {
    // Đảm bảo sắp xếp theo ID bằng số nguyên, không phải chuỗi
    orderBy.id = order.toLowerCase();
  } else if (sort) {
    orderBy[sort] = order.toLowerCase();
  }
  
  // Thực hiện truy vấn để lấy số lượng tổng các bài viết
  const totalArticles = await prisma.article.count({ where });
  
  // Tính tổng số trang
  const totalPages = Math.ceil(totalArticles / parseInt(limit));
  
  // Thực hiện truy vấn để lấy danh sách bài viết với phân trang và sắp xếp
  const articles = await prisma.article.findMany({
    where,
    skip,
    take: parseInt(limit),
    orderBy,
    include: {
      author: {
        select: {
          id: true,
          fullname: true,
          avatar: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  
  // Trả về kết quả bao gồm cả thông tin phân trang
  return {
    articles,
    totalArticles,
    currentPage: parseInt(page),
    totalPages
  };
};

// Get all posted articles
module.exports.getAllPostedArticles = async (author_id) => {
  const user = await prisma.user.findUnique({
    where: { id: author_id },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const articles = await prisma.article.findMany({
    where: {
      isPublish: true,
      authorId: Number(author_id),
    },
    include: {
      author: {
        select: {
          id: true,
          fullname: true,
          avatar: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return articles;
};

// Get a single article by ID
module.exports.getArticleById = async (id) => {
  const article = await prisma.article.findUnique({
    where: {
      id: Number(id),
      // Đã bỏ điều kiện isPublish: true để có thể xem tất cả bài viết từ trang admin
    },
    include: {
      author: {
        select: {
          id: true,
          fullname: true,
          avatar: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      articleTags: {
        include: {
          tag: true,
        },
      },
      _count: {
        select: {
          articleLikes: true,
          comments: true,
        },
      },
    },
  });
  await prisma.article.update({
    where: { id: Number(id) },
    data: {
      view: {
        increment: 1,
      },
    },
  });
  return article;
};

// Get most 5 viewed articles
module.exports.getMostViewedArticles = async (timePeriod) => {
  const currentTime = new Date();
  let timeAgo;
  switch (timePeriod) {
    case "24h":
      timeAgo = new Date(currentTime.setHours(currentTime.getHours() - 24)); // 24 giờ trước
      break;
    case "7d":
      timeAgo = new Date(currentTime.setDate(currentTime.getDate() - 7)); // 7 ngày trước
      break;
    case "30d":
      timeAgo = new Date(currentTime.setMonth(currentTime.getMonth() - 1)); // 30 ngày trước
      break;
    default:
      throw new Error("Invalid time period");
  }

  const articles = await prisma.article.findMany({
    where: {
      isPublish: true,
      publishedAt: {
        gte: timeAgo,
      },
    },
    orderBy: {
      view: "desc",
    },
    take: 5,
  });
  return articles;
};

// Get articles by category
module.exports.getArticlesByCategory = async (categoryId) => {
  const articles = await prisma.article.findMany({
    where: {
      isPublish: true,
      categoryId: Number(categoryId),
    },
  });
  const numberOfArticles = await prisma.article.count({
    where: {
      isPublish: true,
      categoryId: Number(categoryId),
    },
  });
  return { articles, numberOfArticles };
};

// Get articles by author
module.exports.getArticlesByAuthor = async (authorId) => {
  console.log(
    "-----------------Running getArticlesByAuthor with authorId:",
    authorId
  );
  const articles = await prisma.article.findMany({
    where: {
      isPublish: true,
      authorId: Number(authorId),
    },
  });
  const numberOfArticles = await prisma.article.count({
    where: {
      isPublish: true,
      authorId: Number(authorId),
    },
  });
  return { articles, numberOfArticles };
};

// Get articles by author
module.exports.getPostArticlesByAuthor = async (authorId) => {
  console.log(
    "-----------------Running getArticlesByAuthor with authorId:",
    authorId
  );
  const articles = await prisma.article.findMany({
    where: {
      //isPublish: true,
      authorId: Number(authorId),
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      articleTags: {
        include: {
          tag: true,
        },
      },
      _count: {
        select: {
          articleLikes: true,
          comments: true,
        },
      },
    },
  });
  const numberOfArticles = await prisma.article.count({
    where: {
      isPublish: true,
      authorId: Number(authorId),
    },
  });
  return { articles, numberOfArticles };
};

// Get articles statistics
module.exports.getArticlesStatistics = async (id) => {
  const article = await prisma.article.findUnique({
    where: { id: Number(id) },
    include: {
      articleLikes: true,
      articleComments: true,
    },
    _count: {
      articleLikes: true,
      articleComments: true,
    },
  });
  return article;
};

// Get most 5 liked articles
module.exports.getMostLikedArticles = async () => {
  const topLiked = await prisma.articleLike.groupBy({
    by: ["articleId"],
    _count: {
      articleId: true,
    },
    orderBy: {
      _count: {
        articleId: "desc",
      },
    },
    take: 5,
  });

  const articlesWithLikes = await Promise.all(
    topLiked.map(async (item) => {
      const article = await prisma.article.findFirst({
        where: {
          isPublish: true,
          id: item.articleId,
        },
      });
      return {
        ...article,
        likeCount: item._count.articleId,
      };
    })
  );

  return articlesWithLikes;
};

// Get articles by status
module.exports.getArticlesByStatus = async (status) => {
  const articles = await prisma.article.findMany({
    where: {
      status: status,
    },
    include: {
      author: {
        select: {
          id: true,
          fullname: true,
          avatar: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return articles;
};

// Get articles by tag
module.exports.getArticlesByTag = async (tagId) => {
  const articles = await prisma.article.findMany({
    where: {
      articleTags: {
        some: {
          tagId: Number(tagId),
        },
      },
    },
    include: {
      author: {
        select: {
          id: true,
          fullname: true,
          avatar: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      articleTags: {
        include: {
          tag: true,
        },
      },
    },
  });
  // Đếm số lượng bài viết
  const numberOfArticles = await prisma.article.count({
    where: {
      articleTags: {
        some: {
          tagId: Number(tagId),
        },
      },
    },
  });
  return { articles, numberOfArticles };
};

// Get articles by date range
module.exports.getArticlesByDateRange = async (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const articles = await prisma.article.findMany({
    where: {
      publishedAt: {
        gte: start,
        lte: end,
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          fullname: true,
          avatar: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      articleTags: {
        include: {
          tag: true,
        },
      },
    },
  });
  return articles;
};

// Get related articles
module.exports.getRelatedArticles = async (id) => {
  const article = await prisma.article.findUnique({
    where: { id: Number(id) },
    include: {
      articleTags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!article) {
    throw new Error("Article not found");
  }

  const tagIds = article.articleTags.map((tag) => tag.tagId);

  console.log("ccccc");

  const relatedArticles = await prisma.article.findMany({
    where: {
      id: { not: Number(id) },
      OR: [
        {
          articleTags: {
            some: {
              tagId: { in: tagIds },
            },
          },
        },
        {
          categoryId: article.categoryId,
        },
      ],
    },
    take: 5,
    include: {
      author: {
        select: {
          id: true,
          fullname: true,
          avatar: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      articleTags: {
        include: {
          tag: true,
        },
      },
    },
  });
  return relatedArticles;
};

// Get statistics
module.exports.getStatistics = async (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const totalArticles = await prisma.article.count({
    where: {
      publishedAt: {
        gte: start,
        lte: end,
      },
    },
  });

  const totalViews = await prisma.article.aggregate({
    _sum: {
      view: true,
    },
    where: {
      publishedAt: {
        gte: start,
        lte: end,
      },
    },
  });

  return {
    totalArticles,
    totalViews: totalViews._sum.view || 0,
  };
};

// Search articles
module.exports.searchArticles = async (keyword) => {
  const articles = await prisma.article.findMany({
    where: {
      OR: [
        {
          title: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          author: {
            fullname: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        },
        {
          articleTags: {
            some: {
              tag: {
                name: {
                  contains: keyword,
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    include: {
      author: {
        select: {
          id: true,
          fullname: true,
          avatar: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      articleTags: {
        include: {
          tag: true,
        },
      },
    },
  });
  return articles;
};

// Edit an article
module.exports.editArticle = async (
  id,
  title,
  content,
  thumbnail,
  authorId,
  categoryId,
  status,
  publishedAt
) => {
  try {
    const existingArticle = await prisma.article.findUnique({
      where: { id: Number(id) },
    });
    if (!existingArticle) {
      throw new Error("Article not found");
    }
    if (!title || !content || !status) {
      throw new Error("Missing required fields");
    }

    // Khai báo biến để cập nhật dữ liệu
    let publishedDate = undefined;
    let isPublish = undefined;

    // Xử lý trạng thái và ngày xuất bản
    if (status === "APPROVED" || status === "PUBLISHED") {
      // Đặt trạng thái xuất bản
      isPublish = true;

      // Xử lý ngày xuất bản
      if (publishedAt) {
        try {
          // Thử xử lý ngày xuất bản được cung cấp
          const date = new Date(publishedAt);

          if (!isNaN(date.getTime())) {
            // Nếu ngày hợp lệ, sử dụng
            publishedDate = date;
            console.log(
              "[EDIT] Sử dụng ngày xuất bản được chỉ định:",
              publishedDate.toISOString()
            );
          } else {
            // Nếu ngày không hợp lệ, kiểm tra xem có ngày xuất bản cũ không
            if (existingArticle.publishedAt) {
              publishedDate = new Date(existingArticle.publishedAt);
              console.log(
                "[EDIT] Ngày xuất bản mới không hợp lệ, sử dụng ngày cũ:",
                publishedDate.toISOString()
              );
            } else {
              // Nếu không có ngày cũ, sử dụng ngày hiện tại
              publishedDate = new Date();
              console.log(
                "[EDIT] Không có ngày xuất bản hợp lệ, sử dụng ngày hiện tại:",
                publishedDate.toISOString()
              );
            }
          }
        } catch (error) {
          // Xử lý lỗi - sử dụng ngày hiện tại
          publishedDate = new Date();
          console.log(
            "[EDIT] Lỗi xử lý ngày xuất bản, sử dụng ngày hiện tại:",
            publishedDate.toISOString()
          );
        }
      } else if (!existingArticle.isPublish || !existingArticle.publishedAt) {
        // Nếu trước đây chưa xuất bản và giờ được duyệt
        publishedDate = new Date();
        console.log(
          "[EDIT] Bài viết mới được duyệt, sử dụng ngày hiện tại:",
          publishedDate.toISOString()
        );
      } else if (existingArticle.publishedAt) {
        // Nếu đã có ngày xuất bản, giữ nguyên
        publishedDate = new Date(existingArticle.publishedAt);
        console.log(
          "[EDIT] Giữ nguyên ngày xuất bản cũ:",
          publishedDate.toISOString()
        );
      }
    } else {
      // Nếu đặt trạng thái không phải APPROVED/PUBLISHED
      isPublish = false;

      // Giữ nguyên ngày xuất bản nếu có, để khi duyệt lại sẽ dùng ngày cũ
      if (existingArticle.publishedAt) {
        publishedDate = existingArticle.publishedAt;
        console.log(
          "[EDIT] Giữ lại ngày xuất bản cho tương lai:",
          publishedDate
        );
      }
    }

    // Tạo đối tượng dữ liệu cập nhật
    const updateData = {
      title,
      content,
      thumbnail,
      status,
      isPublish,
    };

    // Chỉ cập nhật các trường có dữ liệu
    if (publishedDate !== undefined) {
      updateData.publishedAt = publishedDate;
    }

    // Cập nhật bài viết
    const article = await prisma.article.update({
      where: { id: Number(id) },
      data: updateData,
    });
    return article;
  } catch (error) {
    throw new Error("Error updating article: " + error.message);
  }
};

// Approve an article
module.exports.approveArticle = async (id) => {
  try {
    const existingArticle = await prisma.article.findUnique({
      where: { id: Number(id) },
    });
    if (!existingArticle) {
      throw new Error("Article not found");
    }
    if (existingArticle.status === "approved") {
      throw new Error("Article already approved");
    }
    const article = await prisma.article.update({
      where: { id: Number(id) },
      data: {
        status: ArticleStatus.APPROVED,
      },
    });
    autoPublish(article);
    const user = await prisma.user.findUnique({
      where: { id: article.authorId },
    });

    if (user) {
      const author_notification = {
        receiver_id: article.authorId,
        content: `Your article "${article.title}" has been approved.`,
        type: "ARTICLE_STATUS",
        article_id: article.id,
      };
      await sendNotification(
        author_notification.receiver_id,
        author_notification.content,
        author_notification.type,
        author_notification.article_id
      );
    }
    const admin = await prisma.user.findUnique({
      where: { id: 1 },
    });
    if (admin) {
      const notification = {
        receiver_id: admin.id,
        content: `The article "${article.title}" has been approved.`,
        type: "ARTICLE_STATUS",
        article_id: article.id,
      };
      await sendNotification(
        notification.receiver_id,
        notification.content,
        notification.type,
        notification.article_id
      );
    }
    return article;
  } catch (error) {
    throw new Error("Error approving article: " + error.message);
  }
};

// Reject an article
module.exports.rejectArticle = async (id) => {
  try {
    const existingArticle = await prisma.article.findUnique({
      where: { id: Number(id) },
    });
    if (!existingArticle) {
      throw new Error("Article not found");
    }
    if (existingArticle.status === ArticleStatus.REJECTED) {
      throw new Error("Article already rejected");
    }
    const article = await prisma.article.update({
      where: { id: Number(id) },
      data: {
        status: ArticleStatus.REJECTED,
      },
    });
    const user = await prisma.user.findUnique({
      where: { id: article.authorId },
    });
    if (user) {
      const notification = {
        receiver_id: article.authorId,
        content: `Your article "${article.title}" has been rejected.`,
        type: "ARTICLE_STATUS",
        article_id: article.id,
      };
      await sendNotification(
        notification.receiver_id,
        notification.content,
        notification.type,
        notification.article_id
      );
    }
    const admin = await prisma.user.findUnique({
      where: { id: 1 },
    });
    if (admin) {
      const notification = {
        receiver_id: admin.id,
        content: `The article "${article.title}" has been rejected.`,
        type: "ARTICLE_STATUS",
        article_id: article.id,
      };
      await sendNotification(
        notification.receiver_id,
        notification.content,
        notification.type,
        notification.article_id
      );
    }
    return article;
  } catch (error) {
    throw new Error("Error rejecting article: " + error.message);
  }
};

// Delete an article
module.exports.deleteArticle = async (id) => {
  try {
    const existingArticle = await prisma.article.findUnique({
      where: { id: Number(id) },
    });
    if (!existingArticle) {
      throw new Error("Article not found");
    }
    const article = await prisma.article.delete({
      where: { id: Number(id) },
    });
    return article;
  } catch (error) {
    throw new Error("Error deleting article: " + error.message);
  }
};

// Delete multiple articles
module.exports.deleteMultipleArticles = async (ids) => {
  try {
    const articles = await prisma.article.deleteMany({
      where: {
        id: {
          in: ids.map((id) => Number(id)),
        },
      },
    });
    return articles;
  } catch (error) {
    throw new Error("Error deleting articles: " + error.message);
  }
};

// Auto publish an article
const autoPublish = async (article) => {
  try {
    const now = new Date();
    if (
      article.publishedAt &&
      new Date(article.publishedAt) <= now &&
      !article.isPublish
    ) {
      await prisma.article.update({
        where: { id: article.id },
        data: { isPublish: true },
      });
      console.log(`Article ${article.id} published automatically.`);
      const user = await prisma.user.findUnique({
        where: { id: article.authorId },
      });
      if (user) {
        const notification = {
          receiver_id: article.authorId,
          content: `Your article "${article.title}" has been published.`,
          type: "ARTICLE_STATUS",
          article_id: article.id,
        };
        await sendNotification(
          notification.receiver_id,
          notification.content,
          notification.type,
          notification.article_id
        );

        const followers = await prisma.follow.findMany({
          where: {
            journalistId: user.id,
          },
        });
        for (const follower of followers) {
          const notification = {
            receiver_id: follower.followerId,
            content: `The article "${article.title}" of "${user.fullname}" has been published.`,
            type: "ARTICLE_STATUS",
            article_id: article.id,
          };
          await sendNotification(
            notification.receiver_id,
            notification.content,
            notification.type,
            notification.article_id
          );
        }
      }
      const admin = await prisma.user.findUnique({
        where: { id: 1 },
      });
      if (admin) {
        const notification = {
          receiver_id: admin.id,
          content: `The article "${article.title}" has been published.`,
          type: "ARTICLE_STATUS",
          article_id: article.id,
        };
        await sendNotification(
          notification.receiver_id,
          notification.content,
          notification.type,
          notification.article_id
        );
      }
    }
  } catch (error) {
    console.error(
      `Error auto publishing article ${article.id}:`,
      error.message
    );
  }
};

// Schedule the auto publish task
cron.schedule("*/5 * * * *", async () => {
  try {
    const articles = await prisma.article.findMany({
      where: {
        isPublish: false,
        publishedAt: {
          lte: new Date(),
        },
      },
    });
    for (const article of articles) {
      await prisma.article.update({
        where: { id: article.id },
        data: { isPublish: true },
      });
      console.log(`Article ${article.id} published`);
      const user = await prisma.user.findUnique({
        where: { id: article.authorId },
      });
      if (user) {
        const notification = {
          receiver_id: article.authorId,
          content: `Your article "${article.title}" has been published.`,
          type: "ARTICLE_STATUS",
          article_id: article.id,
        };
        await sendNotification(
          notification.receiver_id,
          notification.content,
          notification.type,
          notification.article_id
        );

        const followers = await prisma.follow.findMany({
          where: {
            journalistId: user.id,
          },
        });
        for (const follower of followers) {
          const notification = {
            receiver_id: follower.followerId,
            content: `The article "${article.title}" of "${user.fullname}" has been published.`,
            type: "ARTICLE_STATUS",
            article_id: article.id,
          };
          await sendNotification(
            notification.receiver_id,
            notification.content,
            notification.type,
            notification.article_id
          );
        }
      }
      const admin = await prisma.user.findUnique({
        where: { id: 1 },
      });
      if (admin) {
        const notification = {
          receiver_id: admin.id,
          content: `The article "${article.title}" has been published.`,
          type: "ARTICLE_STATUS",
          article_id: article.id,
        };
        await sendNotification(
          notification.receiver_id,
          notification.content,
          notification.type,
          notification.article_id
        );
      }
    }
  } catch (error) {
    console.error("Error in scheduled task:", error.message);
  }
});

// Auto update statistics
cron.schedule("0 0 * * *", async () => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    const endDate = new Date();

    const statistics = await module.exports.getStatistics(startDate, endDate);
    console.log(`Daily Statistics: ${JSON.stringify(statistics)}`);
  } catch (error) {
    console.error("Error in scheduled statistics update:", error.message);
  }
});

// Author Dashboard
module.exports.getAuthorDashboard = async (authorId) => {
  try {
    // 3 bài viết mới nhất
    const latestArticles = await prisma.article.findMany({
      where: {
        authorId: Number(authorId),
      },
      include: {
        _count: {
          select: {
            articleLikes: true,
            comments: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        articleTags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });

    // số like tháng này
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyLikes = await prisma.articleLike.count({
      where: {
        article: {
          authorId: Number(authorId),
          isPublish: true,
        },
        createdAt: {
          gte: new Date(currentYear, currentMonth, 1),
          lte: new Date(currentYear, currentMonth + 1, 0),
        },
      },
    });

    // số like tháng trước
    const previousMonth = new Date().getMonth() - 1;
    const previousYear = new Date().getFullYear();
    const previousMonthlyLikes = await prisma.articleLike.count({
      where: {
        article: {
          authorId: Number(authorId),
          isPublish: true,
        },
        createdAt: {
          gte: new Date(previousYear, previousMonth, 1),
          lte: new Date(previousYear, previousMonth + 1, 0),
        },
      },
    });

    // tỉ lệ phần trăm
    let likePercentage =
      ((monthlyLikes - previousMonthlyLikes) / previousMonthlyLikes) * 100;
    if (isNaN(likePercentage)) {
      likePercentage = 0;
    }

    // số bình luận tháng này
    const monthlyComments = await prisma.comment.count({
      where: {
        article: {
          authorId: Number(authorId),
          isPublish: true,
        },
        createdAt: {
          gte: new Date(currentYear, currentMonth, 1),
          lte: new Date(currentYear, currentMonth + 1, 0),
        },
      },
    });

    // số bình luận tháng trước
    const previousMonthlyComments = await prisma.comment.count({
      where: {
        article: {
          authorId: Number(authorId),
          isPublish: true,
        },
        createdAt: {
          gte: new Date(previousYear, previousMonth, 1),
          lte: new Date(previousYear, previousMonth + 1, 0),
        },
      },
    });

    // tỉ lệ phần trăm
    let commentPercentage =
      ((monthlyComments - previousMonthlyComments) / previousMonthlyComments) *
      100;
    if (isNaN(commentPercentage)) {
      commentPercentage = 0;
    }
    // số danh mục tác giả đã viết
    const categoryCount = await prisma.article.groupBy({
      by: ["categoryId"],
      where: {
        authorId: Number(authorId),
      },
      _count: {
        categoryId: true,
      },
    });

    const uniqueCategoryCount = categoryCount.length;

    return {
      latestArticles,
      monthlyLikes,
      previousMonthlyLikes,
      likePercentage,
      monthlyComments,
      previousMonthlyComments,
      commentPercentage,
      uniqueCategoryCount,
    };
  } catch (error) {
    throw new Error("Error fetching author dashboard: " + error.message);
  }
};
