const {
  getAllCategoriesService,
  getCategoryById,
} = require("../../services/category.service");
const handleServerError = require("../../helpers/handleServerError");
module.exports.getAllCategories = async (req, res) => {
  try {
    const filter = { isActive: true };
    const result = await getAllCategoriesService(filter);
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
    handleServerError(res, error, "getAllCategorydetails controller");
  }
};
