const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const mongoose = require("mongoose")
module.exports.addToCart = async (userId, productId, quantity = 1) => {
  if (!userId || !productId || quantity <= 0) {
    return {
      EC: 1,
      EM: "Dữ liệu đầu vào không hợp lệ (userId, productId, hoặc quantity).",
    };
  }

  try {
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return {
        EC: 2,
        EM: "Sản phẩm không tồn tại.",
      };
    }

    quantity = Math.max(1, Math.floor(quantity));

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return {
        EC: 3,
        EM: "Giỏ hàng của người dùng không tìm thấy. Vui lòng thử đăng nhập lại.",
      };
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingItemIndex !== -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity,
      });
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select: "name price image.url", // Chỉ lấy những trường cần thiết
    });
    return {
      EC: 0,
      EM: "Thêm/cập nhật sản phẩm vào giỏ hàng thành công",
      DT: populatedCart,
    };
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    return {
      EC: -1,
      EM: "Lỗi Server.",
      DT: error.message,
    };
  }
};
module.exports.removeFromCart = async (userId, productId) => {
  console.log("Chạy đến service rồi con lợn", userId + "  " + productId);
  if (!userId || !productId) {
    return {
      EC: 1,
      EM: "Thiếu thông tin người dùng hoặc sản phẩm.",
      DT: null,
    };
  }

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId },
      {
        $pull: {
          items: {
            product: productId,
          },
        },
      },
      { new: true }
    ).populate("items.product");

    if (!updatedCart) {
      return {
        EC: 3,
        EM: "Giỏ hàng của người dùng không tìm thấy.",
        DT: null,
      };
    }

    return {
      EC: 0,
      EM: "Đã xóa sản phẩm khỏi giỏ hàng thành công.",
      DT: updatedCart,
    };
  } catch (error) {
    console.error("Lỗi service removeFromCart:", error);
    return {
      EC: -1,
      EM: "Lỗi Server.",
      DT: error.message,
    };
  }
};
module.exports.getCart = async (userId) => {
  if (!userId) {
    return {
      EC: 1,
      EM: "Thiếu thông tin người dùng (userId).",
      DT: null,
    };
  }

  try {
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name price image.url",
    });

    if (!cart) {
      return {
        EC: 3,
        EM: "Giỏ hàng của người dùng không tìm thấy.",
        DT: null,
      };
    }

    return {
      EC: 0,
      EM: "Lấy thông tin giỏ hàng thành công.",
      DT: cart,
    };
  } catch (error) {
    console.error("Lỗi service getCart:", error);
    return {
      EC: -1,
      EM: "Lỗi Server.",
      DT: error.message,
    };
  }
};
module.exports.updateItemQuantity = async (userId, productId, newQuantity) => {
  if (
    !userId ||
    !productId ||
    typeof newQuantity !== "number" ||
    newQuantity < 1
  ) {
    return {
      EC: 1,
      EM: "Dữ liệu đầu vào không hợp lệ (ID hoặc số lượng).",
      DT: null,
    };
  }

  try {
    const objectProductId = new mongoose.Types.ObjectId(productId);
    const quantityToUpdate = Math.floor(newQuantity);
    const productExists = await Product.findById(
      objectProductId,
      "countInStock name"
    );
    if (!productExists) {
      return {
        EC: 2,
        EM: "Sản phẩm không tồn tại trong hệ thống.",
        DT: null,
      };
    }

    if (quantityToUpdate > productExists.countInStock) {
      return {
        EC: 4,
        EM: `Chỉ còn ${productExists.countInStock} sản phẩm ${productExists.name} trong kho.`,
        DT: { maxQuantity: productExists.countInStock },
      };
    }

    const updatedCart = await Cart.findOneAndUpdate(
      {
        user: userId,

        "items.product": objectProductId,
      },
      {
        $set: {
          "items.$.quantity": quantityToUpdate,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate({
      path: "items.product",
      select: "name price image.url countInStock",
    });

    if (!updatedCart) {
      return {
        EC: 3,
        EM: "Giỏ hàng không tìm thấy hoặc sản phẩm không có trong giỏ.",
        DT: null,
      };
    }

    return {
      EC: 0,
      EM: "Cập nhật số lượng sản phẩm thành công.",
      DT: updatedCart.items,
    };
  } catch (error) {
    console.error("Lỗi service updateItemQuantity:", error);
    return {
      EC: -1,
      EM: "Lỗi Server nội bộ.",
      DT: error.message,
    };
  }
};
