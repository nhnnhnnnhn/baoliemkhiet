const followService = require("../services/follow.service");
const controllerHandler = require("../utils/controllerHandler");

const createFollow = controllerHandler(async (req, res) => {
  const followerId = req.user.id;
  const { journalistId } = req.body;
  
  if (isNaN(journalistId)) {
    throw new Error("Invalid journalist ID");
  }

  const follow = await followService.createFollow(followerId, parseInt(journalistId));
  res.status(201).json(follow);
});

const deleteFollow = controllerHandler(async (req, res) => {
  const followerId = req.user.id;
  const { journalistId } = req.params;

  if (isNaN(journalistId)) {
    throw new Error("Invalid journalist ID");
  }

  await followService.deleteFollow(followerId, parseInt(journalistId));
  res.status(204).send();
});

const deleteFollowerByJournalist = controllerHandler(async (req, res) => {
  const journalistId = req.user.id;
  const { followerId } = req.params;

  if (isNaN(followerId)) {
    throw new Error("Invalid follower ID");
  }

  await followService.deleteFollow(parseInt(followerId), journalistId);
  res.status(204).send();
});

const getFollowers = controllerHandler(async (req, res) => {
  const { userId } = req.params;
  if (isNaN(userId)) {
    throw new Error("Invalid user ID");
  }
  const followers = await followService.getFollowers(parseInt(userId));
  res.status(200).json(followers);
});

const getFollowing = controllerHandler(async (req, res) => {
  const { userId } = req.params;
  if (isNaN(userId)) {
    throw new Error("Invalid user ID");
  }
  const following = await followService.getFollowing(parseInt(userId));
  res.status(200).json(following);
});

const checkFollowing = controllerHandler(async (req, res) => {
  const followerId = req.user.id;
  const { journalistId } = req.params;

  if (isNaN(journalistId)) {
    throw new Error("Invalid journalist ID");
  }

  const isFollowing = await followService.isFollowing(followerId, parseInt(journalistId));
  res.status(200).json({ isFollowing });
});

module.exports = {
  createFollow,
  deleteFollow,
  deleteFollowerByJournalist,
  getFollowers,
  getFollowing,
  checkFollowing,
};