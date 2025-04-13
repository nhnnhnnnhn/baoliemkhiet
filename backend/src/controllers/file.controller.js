const fileService = require("../services/file.service");
const controllerHandler = require("../utils/controllerHandler");

const uploadFile = controllerHandler(async (req, res) => {
  const file = req.file;
  console.log("File uploaded:", file);

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const uploadedFile = await fileService.uploadFile(file);
    res.status(200).json({
      success: true,
      file: uploadedFile,
    });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message,
    });
  }
});

module.exports = {
  uploadFile,
};
