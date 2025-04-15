const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createConfiguration(
  facebook,
  zalo,
  aboutUs,
  hotline,
  address,
  email
) {
  const configuration = await prisma.configuration.create({
    data: {
      facebook,
      zalo,
      aboutUs,
      hotline,
      address,
      email,
    },
  });
  return configuration;
}

async function getConfiguration() {
  const configuration = await prisma.configuration.findFirst();
  return configuration;
}

async function updateConfiguration(
  id,
  facebook,
  zalo,
  aboutUs,
  hotline,
  address,
  email
) {
  const configuration = await prisma.configuration.update({
    where: { id },
    data: {
      facebook,
      zalo,
      aboutUs,
      hotline,
      address,
      email,
    },
  });
  return configuration;
}

module.exports = {
  createConfiguration,
  getConfiguration,
  updateConfiguration,
};
