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
      email: "admind@gmail.com",
      fullname: "Admin",
      password: hashedPassword,
      role: "ADMIN",
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
