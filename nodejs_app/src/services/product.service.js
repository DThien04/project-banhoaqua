const Product = require("../models/product.model");
const mongoose = require("mongoose");
const { uploadImageService, deleteImageService } = require("./upload.service");
const buildProductQuery = require("../helpers/productQuery");
module.exports.getAllProductsService = async (
  search,
  sort,
  page,
  limit,
  extraFilter = {}
) => {
  try {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const { onlyActiveCategory, ...productFilter } = extraFilter;

    const query = buildProductQuery({
      search,
      ...productFilter,
    });

    const sortMap = {
      name_asc: { name: 1 },
      name_desc: { name: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      countInStock_asc: { countInStock: 1 },
      countInStock_desc: { countInStock: -1 },
    };

    const sortOptions = sortMap[sort] || { createdAt: -1 };

    let productQuery = Product.find(query)
      .select("-__v")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    productQuery = productQuery.populate(
      onlyActiveCategory
        ? {
            path: "category",
            match: { isActive: true, isDeleted: false },
            select: "name",
          }
        : { path: "category", select: "name" }
    );

    const products = await productQuery;

    const finalProducts = onlyActiveCategory
      ? products.filter((p) => p.category)
      : products;

    const totalItems = onlyActiveCategory
      ? finalProducts.length
      : await Product.countDocuments(query);

    return {
      EC: 0,
      EM: "Lấy danh sách sản phẩm thành công",
      DT: {
        products: finalProducts,
        totalItems,
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

  try {
    const product = await Product.findById(_id);

    if (!product) {
      return { EC: 2, EM: "Không tìm thấy sản phẩm để xóa", DT: null };
    }

    if (product.isDeleted) {
      return { EC: 3, EM: "Sản phẩm đã bị xóa trước đó", DT: null };
    }

    product.isDeleted = true;
    product.isActive = false;
    await product.save();

    return {
      EC: 0,
      EM: "Xóa sản phẩm thành công",
      DT: product,
    };
  } catch (error) {
    console.log("deleteProductService error:", error);
    return {
      EC: -1,
      EM: "Lỗi server khi xóa sản phẩm",
      DT: null,
    };
  }
};

module.exports.getProductsByCategory = async (categoryId) => {
  try {
    const query = buildProductQuery({
      categoryId: categoryId,
      isActive: true,
    });

    const products = await Product.find(query)
      .populate("category", "name")
      .select("-__v")
      .sort({ createdAt: -1 });

    return {
      EC: 0,
      EM: "Lấy danh sách sản phẩm thành công",
      DT: products,
    };
  } catch (error) {
    console.log("getProductsByCategory error:", error);
    return {
      EC: -1,
      EM: "Lỗi server khi lấy danh sách sản phẩm",
      DT: [],
    };
  }
};
module.exports.toggleProductActiveService = async (_id) => {
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return { EC: 1, EM: "ID sản phẩm không hợp lệ", DT: null };
  }

  try {
    const product = await Product.findById(_id);

    if (!product) {
      return { EC: 2, EM: "Không tìm thấy sản phẩm", DT: null };
    }

    if (product.isDeleted) {
      return {
        EC: 3,
        EM: "Sản phẩm đã bị xóa, không thể thay đổi trạng thái",
        DT: null,
      };
    }

    product.isActive = !product.isActive;
    await product.save();

    return {
      EC: 0,
      EM: product.isActive
        ? "Kích hoạt sản phẩm thành công"
        : "Ngừng bán sản phẩm thành công",
      DT: product,
    };
  } catch (error) {
    console.log("toggleProductActiveService error:", error);
    return {
      EC: -1,
      EM: "Lỗi server khi thay đổi trạng thái sản phẩm",
      DT: null,
    };
  }
};
