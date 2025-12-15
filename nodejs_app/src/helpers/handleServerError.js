module.exports =  (res, error, message) => {
  console.log(`${message} error:`, error);
  return res.status(500).json({
    EC: -1,
    EM: "Lỗi server không mong muốn",
    DT: null,
  });
};