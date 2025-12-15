const {
  getAllCategoriesService,
  getCategoryById,
  createNewCategoryService,
  updateCategoryService,
  deleteCategoryService,
} = require("../../services/category.service");
const handleServerError = require("../../helpers/handleServerError");
module.exports.getAllCategories = async (req, res) => {
  const { search, sort, page, limit } = req.query;
  try {
    const result = await getAllCategoriesService(search, sort, page, limit);
    return res.status(200).json(result);
  } catch (error) {
    handleServerError(res, error, "getAllCategories controller");
  }
};

module.exports.getCategoryDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await getCategoryById(id);

    if (result.EC === 0 && !result.DT) {
      return res.status(404).json({
        EC: 3,
        EM: "Không tìm thấy danh mục",
        DT: null,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    handleServerError(res, error, "getCategoryDetails controller");
  }
};

module.exports.createNewCategory = async (req, res) => {
  console.log(req.body);
  const { categoryName } = req.body;

  try {
    const result = await createNewCategoryService(categoryName);

    if (result.EC === 1) {
      return res.status(400).json(result);
    }
    if (result.EC === 2) {
      return res.status(409).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    handleServerError(res, error, "createNewCategory controller");
  }
};

module.exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { categoryName } = req.body;
  try {
    const result = await updateCategoryService(id, categoryName);

    if (result.EC === 1) {
      return res.status(400).json(result);
    }
    if (result.EC === 3) {
      return res.status(404).json(result);
    }
    if (result.EC === 2) {
      return res.status(409).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    handleServerError(res, error, "updateCategory controller");
  }
};

module.exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteCategoryService(id);

    if (result.EC === 1) {
      return res.status(400).json(result);
    }
    if (result.EC === 3) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    handleServerError(res, error, "deleteCategory controller");
  }
};
