const configurationService = require("../services/configuration.service");
const controllerHandler = require("../utils/controllerHandler");

const createConfiguration = controllerHandler(async (req, res) => {
  const { facebook, zalo, aboutUs, hotline, address, email } = req.body;
  const configuration = await configurationService.createConfiguration(
    facebook,
    zalo,
    aboutUs,
    hotline,
    address,
    email
  );
  res.status(201).json(configuration);
});

const getConfiguration = controllerHandler(async (req, res) => {
  const configuration = await configurationService.getConfiguration();
  res.status(200).json(configuration);
});

const updateConfiguration = controllerHandler(async (req, res) => {
  const { id, facebook, zalo, aboutUs, hotline, address, email } = req.body;
  const configuration = await configurationService.updateConfiguration(
    id,
    facebook,
    zalo,
    aboutUs,
    hotline,
    address,
    email
  );
  res.status(200).json(configuration);
});

module.exports = {
  createConfiguration,
  getConfiguration,
  updateConfiguration,
};
