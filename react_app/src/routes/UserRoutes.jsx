import { Route } from "react-router-dom";

import HomePage from "../features/user/pages/HomePage";

import UserLayout from "../layouts/userlayout";

export const UserRoutes = (
  <Route element={<UserLayout />}>
    <Route path="/" element={<HomePage />} />
  </Route>
);
