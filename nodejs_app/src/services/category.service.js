const Category = require("../models/category.model");
module.exports.getAllCategoriesService = async (
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

    // 🔒 isDeleted luôn false, không cho override
    const query = {
      ...extraFilter, // ví dụ: { isActive: true }
      isDeleted: false,
    };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const sortMap = {
      name_asc: { name: 1 },
      name_desc: { name: -1 },
      createdAt_asc: { createdAt: 1 },
      createdAt_desc: { createdAt: -1 },
    };

    const sortOptions = sortMap[sort] || { createdAt: -1 };

    const totalItems = await Category.countDocuments(query);

    const categories = await Category.find(query)
      .select("-__v")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    return {
      EC: 0,
      EM: "Lấy danh sách danh mục thành công",
      DT: {
        categories,
        totalItems,
        page: pageNum,
        limit: limitNum,
      },
    };
  } catch (error) {
    console.log("getAllCategoriesService error:", error);
    return {
      EC: -1,
      EM: "Lỗi server khi lấy danh sách danh mục",
      DT: {
        categories: [],
        totalItems: 0,
      },
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
module.exports.createNewCategoryService = async (
  categoryName,
  type = "single"
) => {
  if (!categoryName) {
    return {
      EC: 1,
      EM: "Vui lòng nhập tên danh mục và loại danh mục.",
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
      type: type,
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
module.exports.updateCategoryService = async (
  id,
  newName,
  newType = "single"
) => {
  if (!id || !newName) {
    return {
      EC: 1,
      EM: "Vui lòng cung cấp ID tên danh mục mới.",
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
      { type: newType },
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
      DT: null,
    };
  }

  try {
    const category = await Category.findById(id);

    if (!category) {
      return {
        EC: 3,
        EM: "Không tìm thấy danh mục để xóa.",
        DT: null,
      };
    }

    if (category.isDeleted) {
      return {
        EC: 4,
        EM: "Danh mục đã bị xóa trước đó.",
        DT: null,
      };
    }

    category.isDeleted = true;
    category.isActive = false;
    await category.save();

    return {
      EC: 0,
      EM: `Xóa danh mục "${category.name}" thành công!`,
      DT: category,
    };
  } catch (error) {
    console.error("deleteCategoryService error:", error);

    if (error.name === "CastError") {
      return {
        EC: 1,
        EM: "ID danh mục không hợp lệ.",
        DT: null,
      };
    }

    return {
      EC: -1,
      EM: "Lỗi hệ thống! Vui lòng thử lại sau.",
      DT: null,
    };
  }
};
module.exports.toggleCategoryActiveService = async (id) => {
  if (!id) {
    return {
      EC: 1,
      EM: "Thiếu ID danh mục",
      DT: null,
    };
  }

  try {
    const category = await Category.findById(id);

    if (!category) {
      return {
        EC: 2,
        EM: "Không tìm thấy danh mục",
        DT: null,
      };
    }

    if (category.isDeleted) {
      return {
        EC: 3,
        EM: "Danh mục đã bị xóa, không thể thay đổi trạng thái",
        DT: null,
      };
    }

    category.isActive = !category.isActive;
    await category.save();

    return {
      EC: 0,
      EM: `Danh mục đã được ${
        category.isActive ? "kích hoạt" : "vô hiệu hóa"
      }`,
      DT: category,
    };
  } catch (error) {
    console.error("toggleCategoryActiveService error:", error);
    return {
      EC: -1,
      EM: "Lỗi server khi thay đổi trạng thái danh mục",
      DT: null,
    };
  }
};