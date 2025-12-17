import AdminDashboard from "~/pages/Admin/Dashboard";
import AdminProductList from "~/pages/Admin/Products";
// import AdminOrders from "~/pages/Admin/Orders";
import AdminUsers from "~/pages/Admin/Users";

export const adminRouters = [
  { path: "/admin", component: AdminDashboard },
  { path: "/admin/products", component: AdminProductList },
  // { path: "/admin/orders", component: AdminOrders },
  { path: "/admin/users", component: AdminUsers },
];
