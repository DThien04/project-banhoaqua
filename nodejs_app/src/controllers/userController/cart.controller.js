const cartService = require("../../services/cart.service");
const handleServerError = require("../../helpers/handleServerError");
module.exports.getCart = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({
      EC: 1,
      EM: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập.",
      DT: null,
    });
  }

  try {
    const result = await cartService.getCart(userId);

    switch (result.EC) {
      case 0:
        return res.status(200).json({
          EC: 0,
          EM: result.EM,
          DT: result.DT,
        });
      case 1:
        return res.status(400).json(result);
      case 3:
        return res.status(404).json(result);
      default:
        return res.status(500).json(result);
    }
  } catch (error) {
    handleServerError(res, error, "getCart controller");
  }
};
module.exports.addToCart = async (req, res) => {
  const userId = req.user.id;

  const { productId, quantity } = req.body;

  const finalQuantity = quantity ? parseInt(quantity) : 1;

  if (!userId || !productId) {
    return res.status(400).json({
      EC: 1,
      EM: "Thiếu thông tin người dùng (userId) hoặc sản phẩm (productId).",
    });
  }

  try {
    const result = await cartService.addToCart(
      userId,
      productId,
      finalQuantity
    );

    switch (result.EC) {
      case 0:
        return res.status(200).json({
          EC: 0,
          EM: result.EM,
          DT: result.DT.items,
        });
      case 1:
        return res.status(400).json(result);
      case 2:
        return res.status(404).json(result);
      case 3:
        return res.status(404).json(result);
      case 5:
        return res.status(409).json(result);
      default:
        return res.status(500).json(result);
    }
  } catch (error) {
    handleServerError(res, error, "addToCart controller");
  }
};
module.exports.removeFromCart = async (req, res) => {
  const userId = req.user.id;

  const { productId } = req.params;
  console.log("Chạy đến đây rồi con lợn", productId);
  if (!userId || !productId) {
    return res.status(400).json({
      EC: 1,
      EM: "Thiếu thông tin người dùng hoặc sản phẩm.",
    });
  }

  try {
    const result = await cartService.removeFromCart(userId, productId);

    switch (result.EC) {
      case 0:
        return res.status(200).json({
          EC: 0,
          EM: result.EM,
          DT: result.DT.items,
        });
      case 1:
        return res.status(400).json(result);
      case 3:
        // Giỏ hàng không tìm thấy
        return res.status(404).json(result);
      default:
        // Lỗi server
        return res.status(500).json(result);
    }
  } catch (error) {
    handleServerError(res, error, "removeFromCart controller");
  }
};
module.exports.updateQuantity = async (req, res) => {
  const userId = req.user.id;

  const { productId, newQuantity } = req.body;
  console.log("chạy đến đây rồi con lợn nhựa");
  if (
    !userId ||
    !productId ||
    typeof newQuantity !== "number" ||
    newQuantity < 1
  ) {
    return res.status(400).json({
      EC: 1,
      EM: "Thiếu thông tin người dùng, ID sản phẩm, hoặc số lượng không hợp lệ.",
    });
  }

  try {
    const result = await cartService.updateItemQuantity(
      userId,
      productId,
      newQuantity
    );

    switch (result.EC) {
      case 0:
        return res.status(200).json({
          EC: 0,
          EM: result.EM,
          DT: result.DT,
        });

      case 4:
        return res.status(409).json(result);

      case 1:
      case 2:
      case 3:
        return res.status(404).json(result);

      default:
        return res.status(500).json(result);
    }
  } catch (error) {
    handleServerError(res, error, "updateQuantity controller");
  }
};
