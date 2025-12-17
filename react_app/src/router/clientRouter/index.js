import Home from "~/pages/client/Home";
import ProductList from "~/pages/client/ProductList";
import { Login,Register } from "../../pages/Auth";

const publicRouters = [
  {
    path: "/login",
    component: Login,
    layout: null,
  },
  { path: "/register", component: Register, layout: null }

];

const privateRouter = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/product",
    component: ProductList,
  },
];

export { publicRouters, privateRouter };
