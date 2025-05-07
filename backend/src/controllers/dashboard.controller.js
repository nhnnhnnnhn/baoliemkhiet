const dashboardService = require("../services/dashboard.service");
const controllerHandler = require("../utils/controllerHandler");

const getStatisticByUserId = controllerHandler(async (req, res) => {
  const user_id = req.user.id;
  if (isNaN(user_id)) {
    throw new Error("Invalid user_id");
  }
  const statistic = await dashboardService.getStatisticByUserId(user_id);
  res.status(200).json(statistic);
});

const getViewByWeekInMonth = controllerHandler(async (req, res) => {
  const user_id = req.user.id;
  if (isNaN(user_id)) {
    throw new Error("Invalid user_id");
  }
  const view = await dashboardService.getViewByWeekInMonth(user_id);
  res.status(200).json(view);
});

const getMostViewedArticles = controllerHandler(async (req, res) => {
  const user_id = req.user.id;
  if (isNaN(user_id)) {
    throw new Error("Invalid user_id");
  }
  const articles = await dashboardService.getMostViewedArticlesInThisMonth(
    user_id
  );

  res.status(200).json(articles);
});

module.exports = {
  getStatisticByUserId,
  getViewByWeekInMonth,
  getMostViewedArticles,
};
