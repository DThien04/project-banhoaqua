const productService = require("../../services/product.service");
const handleServerError = require("../../helpers/handleServerError");
module.exports.getAllProducts = async (req, res) => {
  try {
    const { search, sort, page, limit } = req.query;
    const result = await productService.getAllProductsService(
      search,
      sort,
      page,
      limit
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
module.exports.createProduct = async (req, res) => {
  const productData = req.body;
  const imageFile = req.files ? req.files[0] : null;
  console.log(req.body);
  if (
    !productData.name ||
    !productData.category ||
    !productData.price ||
    !imageFile
  ) {
    return res.status(400).json({
      EC: 10,
      EM: "Thiếu dữ liệu bắt buộc: Tên, Danh mục, Giá hoặc Hình ảnh.",
      DT: null,
    });
  }

  try {
    const result = await productService.createProductService(
      productData,
      imageFile
    );

    if (result.EC !== 0) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    handleServerError(res, error, "createProduct controller");
  }
};

module.exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const newFiles = req.files;

  try {
    const result = await productService.updateProductService(
      id,
      updateData,
      newFiles
    );

    if (result.EC !== 0) {
      const statusCode = result.EC === 2 || result.EC === 1 ? 404 : 400;
      return res.status(statusCode).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    handleServerError(res, error, "updateProduct controller");
  }
};

module.exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await productService.deleteProductService(id);

    if (result.EC !== 0) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    handleServerError(res, error, "deleteProduct controller");
  }
};
