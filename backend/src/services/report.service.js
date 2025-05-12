const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const sendNotification = require("../websocket").sendNotification;

// Create a new report
module.exports.createReport = async (
  reportedBy,
  articleId,
  commentId,
  reason
) => {
  const report = await prisma.report.create({
    data: {
      reportedBy: Number(reportedBy),
      articleId: articleId ? Number(articleId) : null,
      commentId: commentId ? Number(commentId) : null,
      reason,
    },
  });
  const reporter = await prisma.user.findUnique({
    where: {
      id: Number(reportedBy),
    },
  });
  if (reporter) {
    //Send notifiation to the reporter
    const notification = {
      receiver_id: reportedBy,
      content: "Your report has been submitted",
      type: "REPORT",
      article_id: articleId,
    };
    await sendNotification(
      notification.receiver_id,
      notification.content,
      notification.type,
      notification.article_id
    );
  }
  //Send notification to admin
  const admin = await prisma.user.findFirst({
    where: {
      role: "ADMIN",
    },
  });
  if (admin) {
    const notificationToAdmin = {
      receiver_id: admin.id,
      content: `A new report has been submitted by user ${reporter.fullname}`,
      type: "REPORT",
      article_id: articleId,
    };
    await sendNotification(
      notificationToAdmin.receiver_id,
      notificationToAdmin.content,
      notificationToAdmin.type,
      notificationToAdmin.article_id
    );
  }

  return report;
};

// Get all reports
module.exports.getAllReports = async () => {
  const reports = await prisma.report.findMany({
    include: {
      article: true,
      comment: true,
      reportedByUser: {
        select: {
          id: true,
          fullname: true,
        },
      },
    },
  });

  return reports;
};

// Get report by ID
module.exports.getReportById = async (id) => {
  const report = await prisma.report.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      article: true,
      comment: true,
      reportedByUser: {
        select: {
          id: true,
          fullname: true,
        },
      },
    },
  });

  return report;
};

// Get report by article ID
module.exports.getReportByArticleId = async (articleId) => {
  const reports = await prisma.report.findMany({
    where: {
      articleId: Number(articleId),
    },
    include: {
      article: true,
      comment: true,
      reportedByUser: {
        select: {
          id: true,
          fullname: true,
        },
      },
    },
  });

  return reports;
};

// Get report by comment ID
module.exports.getReportByCommentId = async (commentId) => {
  const reports = await prisma.report.findMany({
    where: {
      commentId: Number(commentId),
    },
    include: {
      article: true,
      comment: true,
      reportedByUser: {
        select: {
          id: true,
          fullname: true,
        },
      },
    },
  });

  return reports;
};

// Edit a report
module.exports.editReport = async (id, reason) => {
  const report = await prisma.report.update({
    where: {
      id: Number(id),
    },
    data: {
      reason: reason,
    },
  });

  return report;
};

// Delete a report
module.exports.deleteReport = async (id) => {
  try {
    const exist = await prisma.report.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!exist) {
      return null;
    }
    const report = await prisma.report.delete({
      where: {
        id: Number(id),
      },
    });
    return report;
  } catch (error) {
    console.error("Error finding report:", error);
    return null;
  }
};

// Delete multiple reports
module.exports.deleteMultipleReports = async (ids) => {
  try {
    const reports = await prisma.report.deleteMany({
      where: {
        id: {
          in: ids.map((id) => Number(id)),
        },
      },
    });
    return reports;
  } catch (error) {
    console.error("Error deleting reports:", error);
    return null;
  }
};
