const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
  const hashedPassword = await bcrypt.hash("Abc@12345", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {
      password: hashedPassword,
    },
    create: {
      email: "admin@gmail.com",
      fullname: "Admin",
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
      phone: "0123456789",
      address: "Hà Nội",
    },
  });
  const user = await prisma.user.upsert({
    where: { email: "user@gmail.com" },
    update: {
      password: hashedPassword,
    },
    create: {
      email: "user@gmail.com",
      fullname: "User",
      password: hashedPassword,
      role: "USER",
      status: "ACTIVE",
      phone: "0987654321",
      address: "Hồ Chí Minh",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
