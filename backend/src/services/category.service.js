const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new category
module.exports.createCategory = async (name, description) => {
    const existingCategory = await prisma.category.findUnique({
        where: {
            name,
        },
    });
    if (existingCategory) {
        throw new Error("Category already exists");
    }
    const category = await prisma.category.create({
        data: {
            name,
            description,
        },
    });
    return category;
};

// Get all categories
module.exports.getAllCategories = async () => {
    const categories = await prisma.category.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            articles: {
                select: {
                    id: true
                }
            }
        }
    });
    
    return categories.map(category => ({
        ...category,
        articleCount: category.articles.length,
        articles: undefined // Remove articles from response
    }));
};

// Get a single category by ID
module.exports.getCategoryById = async (id) => {
    const category = await prisma.category.findUnique({
        where: {
            id: id
        }
    });
    if (!category) {
        throw new Error("Category not found");
    }
    return category;
};

// Edit a category
module.exports.editCategory = async (id, name, description) => {
    const category = await prisma.category.update({
        where: {
            id: id
        },
        data: {
            name,
            description,
        }
    });
    return category;
};

// Delete a category
module.exports.deleteCategory = async (id) => {
    try {
        const exist = await prisma.category.findUnique({
            where: {
                id: id
            }
        });
        if (!exist) {
            throw new Error("Category not found");
        }
        const category = await prisma.category.delete({
            where: {
                id: id
            }
        });
        return category;
    } catch (error) {
        console.error("Error finding category:", error);
        throw error;
    }
};

// Delete multiple categories
module.exports.deleteMultipleCategories = async (ids) => {
    const categories = await prisma.category.deleteMany({
        where: {
            id: {
                in: ids
            }
        }
    });
    return categories;
};

// Get articles count by category
module.exports.getArticlesCountByCategory = async () => {
    const categories = await prisma.category.findMany({
        include: {
            articles: {
                select: {
                    id: true,
                }
            }
        }
    });
    const categoriesWithCount = categories.map(category => ({
        ...category,
        articlesCount: category.articles.length,
        viewsCount: category.articles.reduce((acc, article) => acc + article.views, 0),
    }));
    return categoriesWithCount;
};