//  phân quyền

 // định nghĩa permission theo dạng string
const PERMISSIONS = {
  USER_READ: "user:read",
  USER_WRITE: "user:write",
  PRODUCT_WRITE: "product:write",
  ORDER_READ: "order:read",
  ORDER_WRITE: "order:write",
};

const ROLE_PERMISSIONS = {
  ADMIN: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_WRITE,
    PERMISSIONS.PRODUCT_WRITE,
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_WRITE,
  ],
  USER: [
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_WRITE,
  ],
  // sau này thêm STAFF/SHIPPER thì chỉ cần thêm ở đây
  
};

module.exports = { PERMISSIONS, ROLE_PERMISSIONS };
