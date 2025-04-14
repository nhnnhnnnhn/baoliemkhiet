const controllerHandler = require("../utils/controllerHandler");
const service = require("../services/category.service");

// Create a new category
module.exports.createCategory = controllerHandler(async (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    const category = await service.createCategory(name, description);
    res.status(201).json({ message: 'Create successfully!', category });
});

// Get all categories
module.exports.getAllCategories = controllerHandler(async (req, res) => {
    const categories = await service.getAllCategories();
    res.status(200).json(categories);
});

// Get a single category by ID
module.exports.getCategoryById = controllerHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "Missing category ID" });
    }
    const category = await service.getCategoryById(id);
    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
});

// Edit a category
module.exports.editCategory = controllerHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "Missing category ID" });
    }
    if (!name || !description) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    const category = await service.editCategory(id, name, description);
    res.status(200).json({ message: 'Edit successfully!', category });
});

// Delete a category
module.exports.deleteCategory = controllerHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "Missing category ID" });
    }
    await service.deleteCategory(id);
    res.status(200).json({ message: 'Delete successfully!' });
});

// Delete multiple categories
module.exports.deleteMultipleCategories = controllerHandler(async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ message: "Missing category IDs" });
    }
    await service.deleteMultipleCategories(ids);
    res.status(200).json({ message: 'Delete successfully!' });
});

// Get articles count by category
module.exports.getArticlesCountByCategory = controllerHandler(async (req, res) => {
    const categories = await service.getArticlesCountByCategory();
    res.status(200).json(categories);
});