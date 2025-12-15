const Product = require("../models/product.model");
const mongoose = require("mongoose");
const { uploadImageService, deleteImageService } = require("./upload.service");

module.exports.getAllProductsService = async (search, sort, page, limit) => {
  try {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    const query = {};
    let sortOptions = { createdAt: -1 };
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    switch (sort) {
      case "name_asc":
        sortOptions = { name: 1 };
        break;
      case "name_desc":
        sortOptions = { name: -1 };
        break;
      case "price_asc":
        sortOptions = { price: 1 };
        break;
      case "price_desc":
        sortOptions = { price: -1 };
        break;
      case "countInStock_asc":
        sortOptions = { countInStock: 1 };
        break;
      case "countInStock_desc":
        sortOptions = { countInStock: -1 };
        break;
      case "":
      default:
        break;
    }

    const totalItems = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category", "name")
      .select("-__v")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);
    return {
      EC: 0,
      EM: "Lấy danh sách sản phẩm thành công",
      DT: {
        products: products,
        totalItems: totalItems,
        page: pageNum,
        limit: limitNum,
      },
    };
  } catch (error) {
    console.log("getAllProductsService error:", error);
    return {
      EC: -1,
      EM: "Lỗi server khi lấy danh sách sản phẩm",
      DT: {
        products: [],
        totalItems: 0,
      },
    };
  }
};
module.exports.getProductByIdService = async (_id) => {
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return {
      EC: 1,
      EM: "ID sản phẩm không hợp lệ",
      DT: null,
    };
  }

  try {
    const product = await Product.findById(_id)
      .populate("category", "name")
      .select("-__v");

    if (!product) {
      return {
        EC: 2,
        EM: "Không tìm thấy sản phẩm",
        DT: null,
      };
    }

    return {
      EC: 0,
      EM: "Lấy chi tiết sản phẩm thành công",
      DT: product,
    };
  } catch (error) {
    console.log("getProductByIdService error:", error);
    return {
      EC: -1,
      EM: "Lỗi server khi lấy chi tiết sản phẩm",
      DT: null,
    };
  }
};
module.exports.createProductService = async (productData, imageFile) => {
  const { name, category } = productData;
  let uploadedImage = null;

  if (!mongoose.Types.ObjectId.isValid(category)) {
    return { EC: 1, EM: "ID danh mục không hợp lệ", DT: null };
  }

  try {
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return {
        EC: 2,
        EM: "Tên sản phẩm đã tồn tại. Vui lòng chọn tên khác.",
        DT: null,
      };
    }

    const [uploadResult] = await uploadImageService([imageFile]);
    uploadedImage = uploadResult;

    const newProduct = await Product.create({
      ...productData,
      image: uploadedImage,
    });

    const product = await newProduct.populate("category", "name");
    return { EC: 0, EM: "Tạo sản phẩm mới thành công", DT: product };
  } catch (error) {
    console.log("createProductService error:", error);

    if (uploadedImage && uploadedImage.publicId) {
      try {
        await deleteImageService(uploadedImage.publicId);
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }
    }

    return {
      EC: -1,
      EM: "Lỗi server khi tạo sản phẩm" + error.message,
      DT: null,
    };
  }
};
module.exports.updateProductService = async (_id, updateData, newFiles) => {
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return { EC: 1, EM: "ID sản phẩm không hợp lệ", DT: null };
  }

  let uploadedNewImage = null;
  let oldPublicId = null;

  try {
    const productToUpdate = await Product.findById(_id).select("image name");

    if (!productToUpdate) {
      return { EC: 2, EM: "Không tìm thấy sản phẩm để cập nhật", DT: null };
    }

    if (newFiles && newFiles.length > 0) {
      const newImageFile = [newFiles[0]];
      oldPublicId = productToUpdate.image?.publicId;

      [uploadedNewImage] = await uploadImageService(newImageFile);
      updateData.image = uploadedNewImage;
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate("category", "name")
      .select("-__v");

    if (uploadedNewImage && oldPublicId) {
      await deleteImageService(oldPublicId);
    }

    return { EC: 0, EM: "Cập nhật sản phẩm thành công", DT: updatedProduct };
  } catch (error) {
    console.log("updateProductService error:", error);

    if (uploadedNewImage && uploadedNewImage.publicId) {
      try {
        await deleteImageService(uploadedNewImage.publicId);
      } catch (rollbackError) {
        console.error("Rollback failed for new publicId:", rollbackError);
      }
    }

    if (error.code === 11000) {
      return { EC: 3, EM: "Tên sản phẩm đã tồn tại.", DT: null };
    }
    return { EC: -1, EM: "Lỗi server khi cập nhật sản phẩm", DT: null };
  }
};
module.exports.deleteProductService = async (_id) => {
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return { EC: 1, EM: "ID sản phẩm không hợp lệ", DT: null };
  }

  let publicIdToDelete = null;

  try {
    const productToDelete = await Product.findById(_id).select("image");

    if (!productToDelete) {
      return { EC: 2, EM: "Không tìm thấy sản phẩm để xóa", DT: null };
    }

    publicIdToDelete = productToDelete.image.publicId;

    const deletedProduct = await Product.deleteOne({ _id });

    if (deletedProduct.deletedCount === 0) {
      return {
        EC: 4,
        EM: "Không thể xóa sản phẩm khỏi cơ sở dữ liệu.",
        DT: null,
      };
    }

    if (publicIdToDelete) {
      await deleteImageService(publicIdToDelete);
    }

    return { EC: 0, EM: "Xóa sản phẩm thành công", DT: productToDelete };
  } catch (error) {
    console.log("deleteProductService error:", error);
    return {
      EC: -1,
      EM: "Lỗi server khi xóa sản phẩm" + error.message,
      DT: null,
    };
  }
};
module.exports.getProductsByCategory = async (id) => {
  try {
    const products = await Product.find({ category: id })
      .populate("category")
      .select("-__v")
      .sort({ createdAt: -1 });

    return {
      EC: 0,
      EM: "Lấy danh sách sản phẩm thành công",
      DT: products,
    };
  } catch (error) {
    console.log("getAllProductsService error:", error);
    return {
      EC: -1,
      EM: "Lỗi server khi lấy danh sách sản phẩm",
      DT: [],
    };
  }
};
