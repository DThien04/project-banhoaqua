const productService = require("../../services/product.service");
const handleServerError = require("../../helpers/handleServerError");

module.exports.getAllProducts = async (req, res) => {
  try {
    const { search, sort, page, limit } = req.query;

    const filter = { isActive: true, onlyActiveCategory: true };
    const result = await productService.getAllProductsService(
      search,
      sort,
      page,
      limit,
      filter
    );
    if (result.EC !== 0) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    handleServerError(res, error, "getAllProducts controller");
  }
};

module.exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await productService.getProductByIdService(id);
    if (result.EC !== 0) {
      return res.status(404).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    handleServerError(res, error, "getProductById controller");
  }
};
module.exports.getProductByCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await productService.getProductsByCategory(id);
    if (result.EC !== 0) {
      return res.status(404).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    handleServerError(res, error, "getProductById controller");
  }
};
