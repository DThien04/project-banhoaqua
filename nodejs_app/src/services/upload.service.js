const cloudinary = require("../configs/cloudinary");

module.exports.uploadImageService = async (files) => {
  try {
    if (!files || files.length === 0) {
      throw new Error("Chưa chọn ảnh nào");
    }

    const uploadPromises = files.map((file) => {
      const dataURI = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;

      return cloudinary.uploader.upload(dataURI, {
        folder: "products",
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
      });
    });

    const results = await Promise.all(uploadPromises);

    return results.map((result) => ({
      url: result.secure_url,
      publicId: result.public_id,
    }));
  } catch (error) {
    console.error("Upload service error:", error);
    throw error;
  }
};
module.exports.deleteImageService = async (publicId) => {
  try {
    if (!publicId) {
      throw new Error("Không có publicId để xóa");
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      return {
        success: true,
        message: "Xóa ảnh thành công",
        publicId,
      };
    } else {
      throw new Error(`Không tìm thấy ảnh với publicId: ${publicId}`);
    }
  } catch (error) {
    console.error("Delete service error:", error);
    throw error;
  }
};

module.exports.deleteMultipleImagesService = async (publicIds) => {
  try {
    if (!publicIds || publicIds.length === 0) {
      throw new Error("Không có danh sách publicId để xóa");
    }

    const deletePromises = publicIds.map((publicId) =>
      cloudinary.uploader.destroy(publicId)
    );

    const results = await Promise.all(deletePromises);

    const deleted = [];
    const failed = [];

    results.forEach((result, index) => {
      if (result.result === "ok") {
        deleted.push(publicIds[index]);
      } else {
        failed.push({
          publicId: publicIds[index],
          reason: result.result,
        });
      }
    });

    return {
      success: true,
      message: `Đã xóa ${deleted.length} ảnh, thất bại ${failed.length} ảnh`,
      deleted,
      failed,
    };
  } catch (error) {
    console.error("Delete multiple service error:", error);
    throw error;
  }
};
