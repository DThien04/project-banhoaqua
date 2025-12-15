import React, { Fragment } from "react";
import { Route } from "react-router-dom";
import SignInPage from "../features/auth/pages/SignInPage";
import SignUpPage from "../features/auth/pages/SignUpPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
export const AuthRoutes = (
  <Fragment>
    <Route path="/sign-in" element={<SignInPage />} />
    <Route path="/sign-up" element={<SignUpPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
  </Fragment>
);
