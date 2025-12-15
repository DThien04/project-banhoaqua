// src/middleware/upload.js

const multer = require("multer");

// Dùng memoryStorage = không lưu file tạm xuống ổ cứng → an toàn khi deploy Render/Vercel/K8S
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // tối đa 10MB mỗi file
    files: 10,                  // tối đa 10 file 1 lần upload
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp|svg/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(file.originalname.toLowerCase().split('.').pop());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Chỉ được upload file ảnh!"));
  },
});

module.exports = upload;