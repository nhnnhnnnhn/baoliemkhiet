const { PrismaClient } = require("@prisma/client");
const cron = require('node-cron');
const prisma = new PrismaClient();

// Create a new article
module.exports.createArticle = async (title, content, thumbnail, authorId, categoryId, status, publishedAt) => {
    try {
        const publishedDate = new Date(publishedAt);
        const article = await prisma.article.create({
            data: {
                title,
                content,
                thumbnail,
                authorId,
                categoryId,
                status,
                publishedAt: publishedDate,
                isPublish: false,
                view: 0,
            }
        });
        return article;
    } catch (error) {
        throw new Error("Error creating article: " + error.message);
    }
};

// Get all articles
module.exports.getAllArticles = async () => {
    const articles = await prisma.article.findMany({
        include: {
            author: {
                select: {
                    id: true, fullname: true, avatar: true
                }
            },
            category: {
                select: {
                    id: true, name: true
                }
            }
        }
    });
    return articles;
};

// Get all posted articles
module.exports.getAllPostedArticles = async () => {
    const articles = await prisma.article.findMany({
        where: {
            isPublish: true
        },
        include: {
            author: {
                select: {
                    id: true, fullname: true, avatar: true
                }
            },
            category: {
                select: {
                    id: true, name: true
                }
            }
        }
    });
    return articles;
};

// Get a single article by ID
module.exports.getArticleById = async (id) => {
    const article = await prisma.article.findUnique({
        where: { 
            id: Number(id),
            isPublish: true
         }
    });
    return article;
};

// Get most 5 viewed articles
module.exports.getMostViewedArticles = async (timePeriod) => {
    const currentTime = new Date();
    let timeAgo;
    switch (timePeriod) {
        case '24h':
            timeAgo = new Date(currentTime.setHours(currentTime.getHours() - 24));  // 24 giờ trước
            break;
        case '7d':
            timeAgo = new Date(currentTime.setDate(currentTime.getDate() - 7));  // 7 ngày trước
            break;
        case '30d':
            timeAgo = new Date(currentTime.setMonth(currentTime.getMonth() - 1));  // 30 ngày trước
            break;
        default:
            throw new Error('Invalid time period');
    }

    const articles = await prisma.article.findMany({
        where: {
            isPublish: true,
            publishedAt: {
                gte: timeAgo
            },
        },
        orderBy: {
            view: 'desc'
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
            categoryId: Number(categoryId)
        }
    });
    return articles;
};

// Get articles by author
module.exports.getArticlesByAuthor = async (authorId) => {
    const articles = await prisma.article.findMany({
        where: {
            isPublish: true,
            authorId: Number(authorId)
        }
    });
    return articles;
};

// Get most 5 liked articles
module.exports.getMostLikedArticles = async () => {
    const topLiked = await prisma.articleLike.groupBy({
        by: ['articleId'],
        _count: {
            articleId: true,
        },
        orderBy: {
            _count: {
                articleId: 'desc',
            },
        },
        take: 5,
    });

    const articlesWithLikes = await Promise.all(
        topLiked.map(async (item) => {
            const article = await prisma.article.findUnique({
                where: {
                    isPublish: true, 
                    id: item.articleId
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
            status: status
        },
        include: {
            author: {
                select: {
                    id: true, fullname: true, avatar: true
                }
            },
            category: {
                select: {
                    id: true, name: true
                }
            }
        }
    });
    return articles;
};

// Get articles by tag
module.exports.getArticlesByTag = async (tagId) => {
    const articles = await prisma.article.findMany({
        where: {
            articleTags: {
                some: {
                    tagId: Number(tagId)
                }
            }
        },
        include: {
            author: {
                select: {
                    id: true, fullname: true, avatar: true
                }
            },
            category: {
                select: {
                    id: true, name: true
                }
            },
            articleTags: {
                include: {
                    tag: true,
                },
            },
        }
    });
    return articles;
};

// Get articles by date range
module.exports.getArticlesByDateRange = async (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const articles = await prisma.article.findMany({
        where: {
            publishedAt: {
                gte: start,
                lte: end
            }
        },
        orderBy: {
            publishedAt: 'desc'
        },
        include: {
            author: {
                select: {
                    id: true, fullname: true, avatar: true
                }
            },
            category: {
                select: {
                    id: true, name: true
                }
            },
            articleTags: {
                include: {
                    tag: true,
                },
            },
        }
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
        }
    });

    if (!article) {
        throw new Error('Article not found');
    }

    const tagIds = article.articleTags.map(tag => tag.tagId);

    if (tagIds.length === 0) {
        return [];
    }

    const relatedArticles = await prisma.article.findMany({
        where: {
            id: { not: Number(id) },
            articleTags: {
                some: {
                    tagId: { in: tagIds }
                }
            }
        },
        take: 5,
        include: {
            author: {
                select: {
                    id: true, fullname: true, avatar: true
                }
            },
            category: {
                select: {
                    id: true, name: true
                }
            },
            articleTags: {
                include: {
                    tag: true,
                },
            },
        }
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
                lte: end
            }
        }
    });

    const totalViews = await prisma.article.aggregate({
        _sum: {
            view: true
        },
        where: {
            publishedAt: {
                gte: start,
                lte: end
            }
        }
    });

    return {
        totalArticles,
        totalViews: totalViews._sum.view || 0
    };
}

// Search articles
module.exports.searchArticles = async (keyword) => {
    const articles = await prisma.article.findMany({
        where: {
            OR: [
                {
                    title: {
                        contains: keyword,
                        mode: 'insensitive',
                    },
                },
                {
                    author: {
                        fullname: {
                            contains: keyword,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    articleTags: {
                        some: {
                            tag: {
                                name: {
                                    contains: keyword,
                                    mode: 'insensitive',
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
                    id: true, fullname: true, avatar: true
                }
            },
            category: {
                select: {
                    id: true, name: true
                }
            },
            articleTags: {
                include: {
                    tag: true,
                },
            },
        }
    });
    return articles;
};

// Edit an article
module.exports.editArticle = async (id, title, content, thumbnail, authorId, categoryId, status, publishedAt) => {
    try {
        const existingArticle = await prisma.article.findUnique({
            where: { id: Number(id) }
        });
        if (!existingArticle) {
            throw new Error("Article not found");
        }
        if (!title || !content || !authorId || !categoryId || !status) {
            throw new Error("Missing required fields");
        }
        const publishedDate = new Date(publishedAt);
        const article = await prisma.article.update({
            where: { id: Number(id) },
            data: {
                title,
                content,
                thumbnail,
                authorId,
                categoryId,
                status,
                publishedAt: publishedDate
            }
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
            where: { id: Number(id) }
        });
        if (!existingArticle) {
            throw new Error("Article not found");
        }
        if (existingArticle.status === 'approved') {
            throw new Error("Article already approved");
        }
        const article = await prisma.article.update({
            where: { id: Number(id) },
            data: {
                status: 'approved',
            }
        });
        autoPublish(article);
        return article;
    } catch (error) {
        throw new Error("Error approving article: " + error.message);
    }
};

// Reject an article
module.exports.rejectArticle = async (id) => {
    try {
        const existingArticle = await prisma.article.findUnique({
            where: { id: Number(id) }
        });
        if (!existingArticle) {
            throw new Error("Article not found");
        }
        if (existingArticle.status === 'rejected') {
            throw new Error("Article already rejected");
        }
        const article = await prisma.article.update({
            where: { id: Number(id) },
            data: {
                status: 'rejected',
            }
        });
        return article;
    } catch (error) {
        throw new Error("Error rejecting article: " + error.message);
    }
};

// Delete an article
module.exports.deleteArticle = async (id) => {
    try {
        const existingArticle = await prisma.article.findUnique({
            where: { id: Number(id) }
        });
        if (!existingArticle) {
            throw new Error("Article not found");
        }
        const article = await prisma.article.delete({
            where: { id: Number(id) }
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
                    in: ids.map(id => Number(id))
                }
            }
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
        if (article.publishedAt && new Date(article.publishedAt) <= now && !article.isPublish) {
            await prisma.article.update({
                where: { id: article.id },
                data: { isPublish: true }
            });
            console.log(`Article ${article.id} published automatically.`);
        }
    } catch (error) {
        console.error(`Error auto publishing article ${article.id}:`, error.message);
    }
};

// Schedule the auto publish task
cron.schedule('*/5 * * * *', async () => {
    try {
        const articles = await prisma.article.findMany({
            where: {
                isPublish: false,
                publishedAt: {
                    lte: new Date()
                }
            }
        });
        for (const article of articles) {
            await prisma.article.update({
                where: { id: article.id },
                data: { isPublish: true }
            });
            console.log(`Article ${article.id} published`);
        }
    } catch (error) {
        console.error("Error in scheduled task:", error.message);
    }
});

// Auto update statistics
cron.schedule('0 0 * * *', async () => {
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