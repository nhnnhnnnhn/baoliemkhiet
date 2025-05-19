const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function createUser(userData) {
  const { email, password, fullname, role, avatar, bio, phone, address, status } = userData;

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullname,
      role,
      avatar,
      bio,
      phone,
      address,
      status
    },
    select: {
      id: true,
      email: true,
      fullname: true,
      role: true,
      avatar: true,
      bio: true,
      phone: true,
      address: true,
      status: true,
      created_at: true,
      updated_at: true,
    },
  });

  return user;
}

async function getAllUsers(filters = {}, pagination = {}) {
  const { role, search } = filters;
  const { page = 1, limit = 10 } = pagination;
  const skip = (page - 1) * limit;

  const where = {};
  
  // Add role filter if provided
  if (role) {
    where.role = role;
  }

  // Add search filter if provided
  if (search) {
    where.OR = [
      { fullname: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        fullname: true,
        role: true,
        avatar: true,
        bio: true,
        is_online: true,
        created_at: true,
        updated_at: true,
        _count: { select: { articles: true } },
      },
      skip,
      take: limit,
      orderBy: {
        id: 'asc',
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      fullname: true,
      role: true,
      avatar: true,
      bio: true,
      is_online: true,
      created_at: true,
      updated_at: true,
      articles: {
        select: {
          id: true,
          title: true,
          status: true,
          publishedAt: true,
          createdAt: true,
        },
      },
      followers: {
        select: {
          id: true,
          follower: {
            select: {
              id: true,
              fullname: true,
              avatar: true,
            },
          },
        },
      },
      following: {
        select: {
          id: true,
          journalist: {
            select: {
              id: true,
              fullname: true,
              avatar: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

async function deleteUser(id) {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new Error("User not found");
  }

  // Delete user
  await prisma.user.delete({
    where: { id },
  });

  return { message: "User deleted successfully" };
}

async function updateUser(id, userData) {
  const { email, password, fullname, role, avatar, bio } = userData;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new Error("User not found");
  }

  // If email is being changed, check if new email already exists
  if (email && email !== user.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new Error("Email already exists");
    }
  }

  // Prepare update data
  const updateData = {};
  if (email) updateData.email = email;
  if (password) updateData.password = await bcrypt.hash(password, 10);
  if (fullname) updateData.fullname = fullname;
  if (role) updateData.role = role;
  if (avatar !== undefined) updateData.avatar = avatar;
  if (bio !== undefined) updateData.bio = bio;

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      fullname: true,
      role: true,
      avatar: true,
      bio: true,
      is_online: true,
      created_at: true,
      updated_at: true,
    },
  });

  return updatedUser;
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
};