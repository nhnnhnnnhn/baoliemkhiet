const { PrismaClient, Role } = require("@prisma/client");
const { getMostViewedArticles } = require("./article.service");
const prisma = new PrismaClient();

async function getStatisticByUserId(user_id) {
  const user = await prisma.user.findUnique({
    where: { id: user_id },
  });
  if (!user) {
    throw new Error("User not found");
  }
  let viewsInThisMonth;
  let viewsInPreviousMonth;
  let countArticlesInThisMonth;
  let countArticlesInPreviousMonth;
  let likesInThisMonth;
  let likesInPreviousMonth;
  let commentsInThisMonth;
  let commentsInPreviousMonth;

  if (user.role == Role.ADMIN) {
    const articlesInThisMonth = await prisma.article.findMany({
      where: {
        publishedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      select: { view: true, articleLikes: true, comments: true },
    });
    console.log(articlesInThisMonth);

    viewsInThisMonth = articlesInThisMonth.reduce((acc, article) => {
      return acc + article.view;
    }, 0);
    likesInThisMonth = articlesInThisMonth.reduce((acc, article) => {
      return acc + article.articleLikes.length;
    }, 0);
    commentsInThisMonth = articlesInThisMonth.reduce((acc, article) => {
      return acc + article.comments.length;
    }, 0);

    const articlesInPreviousMonth = await prisma.article.findMany({
      where: {
        publishedAt: {
          gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      select: { view: true, articleLikes: true },
    });
    viewsInPreviousMonth = articlesInPreviousMonth.reduce((acc, article) => {
      return acc + article.view;
    }, 0);
    likesInPreviousMonth = articlesInPreviousMonth.reduce((acc, article) => {
      return acc + article.articleLikes.length;
    }, 0);
    commentsInPreviousMonth = articlesInPreviousMonth.reduce((acc, article) => {
      return acc + article.comments.length;
    }, 0);
    countArticlesInThisMonth = articlesInThisMonth.length;
    countArticlesInPreviousMonth = articlesInPreviousMonth.length;
  } else {
    const articlesInThisMonth = await prisma.article.findMany({
      where: {
        userId: user_id,
        publishedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        authorId: user_id,
      },
      select: { view: true, articleLikes: true },
    });
    viewsInThisMonth = articlesInThisMonth.reduce((acc, article) => {
      return acc + article.view;
    }, 0);
    likesInThisMonth = articlesInThisMonth.reduce((acc, article) => {
      return acc + article.articleLikes.length;
    }, 0);
    commentsInThisMonth = articlesInThisMonth.reduce((acc, article) => {
      return acc + article.comments.length;
    }, 0);

    const articlesInPreviousMonth = await prisma.article.findMany({
      where: {
        userId: user_id,
        publishedAt: {
          gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        authorId: user_id,
      },
      select: { view: true, articleLikes: true },
    });
    viewsInPreviousMonth = articlesInPreviousMonth.reduce((acc, article) => {
      return acc + article.view;
    }, 0);
    likesInPreviousMonth = articlesInPreviousMonth.reduce((acc, article) => {
      return acc + article.articleLikes.length;
    }, 0);
    commentsInPreviousMonth = articlesInPreviousMonth.reduce((acc, article) => {
      return acc + article.comments.length;
    }, 0);
    countArticlesInThisMonth = articlesInThisMonth.length;
    countArticlesInPreviousMonth = articlesInPreviousMonth.length;
  }
  return {
    viewsInThisMonth: viewsInThisMonth,
    viewsInPreviousMonth: viewsInPreviousMonth,
    countArticlesInThisMonth: countArticlesInThisMonth,
    countArticlesInPreviousMonth: countArticlesInPreviousMonth,
    likesInThisMonth: likesInThisMonth,
    likesInPreviousMonth: likesInPreviousMonth,
    commentsInThisMonth: commentsInThisMonth,
    commentsInPreviousMonth: commentsInPreviousMonth,
    viewPercentage:
      viewsInPreviousMonth === 0
        ? viewsInThisMonth > 0
          ? "100.00"
          : "0.00"
        : (
            (viewsInThisMonth - viewsInPreviousMonth) /
            viewsInPreviousMonth
          ).toFixed(2),
    articlePercentage:
      countArticlesInPreviousMonth === 0
        ? countArticlesInThisMonth > 0
          ? "100.00"
          : "0.00"
        : (
            (countArticlesInThisMonth - countArticlesInPreviousMonth) /
            countArticlesInPreviousMonth
          ).toFixed(2),
    likePercentage:
      likesInPreviousMonth === 0
        ? likesInThisMonth > 0
          ? "100.00"
          : "0.00"
        : (
            (likesInThisMonth - likesInPreviousMonth) /
            likesInPreviousMonth
          ).toFixed(2),
    commentPercentage:
      commentsInPreviousMonth === 0
        ? commentsInThisMonth > 0
          ? "100.00"
          : "0.00"
        : (
            (commentsInThisMonth - commentsInPreviousMonth) /
            commentsInPreviousMonth
          ).toFixed(2),
  };
}

async function getViewByWeekInMonth(user_id) {
  const user = await prisma.user.findUnique({
    where: { id: user_id },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const viewsByWeek = [0, 0, 0, 0];
  const now = new Date();

  if (user.role == Role.ADMIN) {
    const articles = await prisma.article.findMany({
      where: {
        publishedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      select: { view: true, publishedAt: true },
    });
    articles.forEach((article) => {
      const weekIndex = Math.floor(
        (now - new Date(article.publishedAt)) / (7 * 24 * 60 * 60 * 1000)
      );
      if (weekIndex >= 0 && weekIndex < 4) {
        viewsByWeek[weekIndex] += article.view;
      }
    });
  } else {
    const articles = await prisma.article.findMany({
      where: {
        userId: user_id,
        publishedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        authorId: user_id,
      },
      select: { view: true, publishedAt: true },
    });
    articles.forEach((article) => {
      const weekIndex = Math.floor(
        (now - new Date(article.publishedAt)) / (7 * 24 * 60 * 60 * 1000)
      );
      if (weekIndex >= 0 && weekIndex < 4) {
        viewsByWeek[weekIndex] += article.view;
      }
    });
  }
  return {
    week1: viewsByWeek[0],
    week2: viewsByWeek[1],
    week3: viewsByWeek[2],
    week4: viewsByWeek[3],
  };
}

async function getMostViewedArticlesInThisMonth(user_id) {
  const user = await prisma.user.findUnique({
    where: { id: user_id },
  });
  if (!user) {
    throw new Error("User not found");
  }
  let mostViewedArticles;
  if (user.role == Role.ADMIN) {
    mostViewedArticles = await prisma.article.findMany({
      where: {
        publishedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { view: "desc" },
      take: 5,
    });
  } else {
    mostViewedArticles = await prisma.article.findMany({
      where: {
        userId: user_id,
        publishedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        authorId: user_id,
      },
      orderBy: { view: "desc" },
      take: 5,
    });
  }
  return mostViewedArticles;
}
module.exports = {
  getStatisticByUserId,
  getViewByWeekInMonth,
  getMostViewedArticlesInThisMonth,
};
