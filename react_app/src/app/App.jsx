import { Routes, Route } from "react-router-dom";
import { publicRouters, privateRouter} from "../router/clientRouter";
import PrivateRoute from "../components/common/PrivateRoute";
import AdminRoute from "../components/common/AdminRoute";
import DefaultLayout from "../components/layout/client/DefaultLayout";
import AdminLayout from "~/components/admin/AdminLayout";
import { Fragment } from "react";
import {adminRouters} from "../router/AdminRoute"
export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      {publicRouters.map((route, i) => {
        const Page = route.component;
        const Layout = route.layout === null ? Fragment : (route.layout || DefaultLayout);
        return (
          <Route key={i} path={route.path} element={<Layout><Page /></Layout>} />
        );
      })}

      {/* PRIVATE (USER login) */}
       <Route element={<PrivateRoute />}>
        {privateRouter.map((route, i) => {
          const Page = route.component;
          const Layout = route.layout === null ? Fragment : (route.layout || DefaultLayout);
          return (
            <Route key={i} path={route.path} element={<Layout><Page /></Layout>} />
          );
        })}
      </Route>

      {/* ADMIN */}
      <Route element={<AdminRoute />}>
        {adminRouters.map((route, i) => {
          const Page = route.component;
          return (
            <Route
              key={i}
              path={route.path}
              element={<AdminLayout><Page /></AdminLayout>}
            />
          );
        })}
      </Route>
    </Routes>
  );
}
