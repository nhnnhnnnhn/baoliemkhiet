const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const sendNotification = require("../websocket").sendNotification;

async function createFollow(followerId, journalistId) {
  // Check if follower exists
  const follower = await prisma.user.findUnique({
    where: { id: followerId },
  });
  if (!follower) {
    throw new Error("Follower not found");
  }

  // Check if journalist exists
  const journalist = await prisma.user.findUnique({
    where: { id: journalistId },
  });
  if (!journalist) {
    throw new Error("Journalist not found");
  }

  // Check if follow already exists
  const existingFollow = await prisma.follow.findFirst({
    where: {
      followerId,
      journalistId,
    },
  });
  if (existingFollow) {
    throw new Error("Already following this journalist");
  }

  const follow = await prisma.follow.create({
    data: {
      followerId,
      journalistId,
    },
  });
  const notification = {
    receiver_id: journalistId,
    content: `${follower.fullname} has followed you`,
    type: "FOLLOW",
    article_id: null,
  };
  await sendNotification(
    notification.receiver_id,
    notification.content,
    notification.type,
    notification.article_id
  );
  return follow;
}

async function deleteFollow(followerId, journalistId) {
  const follow = await prisma.follow.findFirst({
    where: {
      followerId,
      journalistId,
    },
  });
  if (!follow) {
    throw new Error("Follow relationship not found");
  }

  const deletedFollow = await prisma.follow.delete({
    where: { id: follow.id },
  });
  return deletedFollow;
}

async function getFollowers(journalistId) {
  const journalist = await prisma.user.findUnique({
    where: { id: journalistId },
  });
  if (!journalist) {
    throw new Error("Journalist not found");
  }

  const followers = await prisma.follow.findMany({
    where: { journalistId },
    include: {
      follower: {
        select: {
          id: true,
          fullname: true,
          avatar: true,
          email: true,
          bio: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return followers;
}

async function getFollowing(followerId) {
  const follower = await prisma.user.findUnique({
    where: { id: followerId },
  });
  if (!follower) {
    throw new Error("User not found");
  }

  const following = await prisma.follow.findMany({
    where: { followerId },
    include: {
      journalist: {
        select: {
          id: true,
          fullname: true,
          avatar: true,
          email: true,
          bio: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return following;
}

async function isFollowing(followerId, journalistId) {
  const follow = await prisma.follow.findFirst({
    where: {
      followerId,
      journalistId,
    },
  });
  return !!follow;
}

module.exports = {
  createFollow,
  deleteFollow,
  getFollowers,
  getFollowing,
  isFollowing,
};
