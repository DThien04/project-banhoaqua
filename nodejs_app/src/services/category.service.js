const Category = require("../models/category.model");
module.exports.getAllCategoriesService = async (search, sort, page, limit) => {
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
      case "createdAt_asc":
        sortOptions = { createdAt: 1 };
        break;
      case "createdAt_desc":
        sortOptions = { createdAt: -1 };
        break;
      case "":
      default:
        break;
    }

    const totalItems = await Category.countDocuments(query);
    const categories = await Category.find(query)
      .select("-__v")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);
    return {
      EC: 0,
      EM: "Lấy danh sách sản phẩm thành công",
      DT: {
        categories: categories,
        totalItems: totalItems,
        page: pageNum,
        limit: limitNum,
      },
    };
  } catch (error) {
    console.log("getAllCategoriesService error:", error);
    return {
      EC: -1,
      EM: "Lỗi server khi lấy danh sách danh mục",
      DT: [],
    };
  }
};
module.exports.getCategoryById = async (_id) => {
  try {
    const category = await Category.findOne({ _id }).select("-__v");
    return {
      EC: 0,
      EM: "Lấy danh mục thành công",
      DT: category,
    };
  } catch (error) {
    return {
      EC: -1,
      EM: "Lỗi server khi danh mục" + error.message,
    };
  }
};
module.exports.createNewCategoryService = async (categoryName) => {
  if (!categoryName) {
    return {
      EC: 1,
      EM: "Vui lòng nhập tên danh mục.",
    };
  }
  const trimmedName = categoryName.trim();
  if (trimmedName.length < 3) {
    return {
      EC: 1,
      EM: "Tên danh mục phải có ít nhất 3 ký tự!",
    };
  }

  try {
    const existingCategory = await Category.findOne({ name: trimmedName });
    if (existingCategory) {
      return {
        EC: 2,
        EM: `Danh mục "${trimmedName}" đã tồn tại.`,
      };
    }

    const newCategory = await Category.create({
      name: trimmedName,
    });

    return {
      EC: 0,
      message: "Tạo danh mục thành công!",
      DT: newCategory,
    };
  } catch (error) {
    console.error("Lỗi khi tạo danh mục:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return {
        EC: 1,
        EM: messages.join(", "),
      };
    }

    return {
      EC: -1,
      EM: "Lỗi hệ thống! Vui lòng thử lại sau.",
    };
  }
};
module.exports.updateCategoryService = async (id, newName) => {
  if (!id || !newName) {
    return {
      EC: 1,
      EM: "Vui lòng cung cấp ID và tên danh mục mới.",
    };
  }

  const trimmedName = newName.trim();

  if (trimmedName.length < 3) {
    return {
      EC: 1,
      EM: "Tên danh mục phải có ít nhất 3 ký tự!",
    };
  }

  try {
  
    const categoryToUpdate = await Category.findById(id);
    if (!categoryToUpdate) {
      return {
        EC: 3, 
        EM: "Không tìm thấy danh mục để cập nhật.",
      };
    }

  
    const existingCategory = await Category.findOne({
      name: trimmedName,
      _id: { $ne: id },
    });

    if (existingCategory) {
      return {
        EC: 2,
        EM: `Danh mục "${trimmedName}" đã tồn tại.`,
      };
    }

    
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name: trimmedName },
      { new: true, runValidators: true } 
    ).select("-__v");

    return {
      EC: 0,
      message: "Cập nhật danh mục thành công!",
      DT: updatedCategory,
    };
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);

    return {
      EC: -1,
      EM: "Lỗi hệ thống! Vui lòng thử lại sau.",
    };
  }
};
module.exports.deleteCategoryService = async (id) => {
  if (!id) {
    return {
      EC: 1,
      EM: "Vui lòng cung cấp ID danh mục cần xóa.",
    };
  }

  try {
    // 1. Thực hiện xóa
    const deletedCategory = await Category.findByIdAndDelete(id);

    // 2. Kiểm tra xem có bản ghi nào bị xóa không
    if (!deletedCategory) {
      return {
        EC: 3, // Mã lỗi: Không tìm thấy
        EM: "Không tìm thấy danh mục để xóa.",
      };
    }

    return {
      EC: 0,
      message: `Xóa danh mục "${deletedCategory.name}" thành công!`,
      DT: deletedCategory,
    };
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);

    if (error.name === "CastError") {
      return {
        EC: 1,
        EM: "ID danh mục không hợp lệ.",
      };
    }

    return {
      EC: -1,
      EM: "Lỗi hệ thống! Vui lòng thử lại sau.",
    };
  }
};
