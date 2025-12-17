import InputField from "~/components/common/InputField/InputField";

import AuthCardLayout from "~/components/common/AuthCardLayout/AuthCardLayout";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

export default function LoginView({
  form,
  fieldErrors,
  error,
  loading,
  onChange,
  onSubmit,
}) {
  return (
    <AuthCardLayout
      title="Đăng nhập"
      footer={
        <p>
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className={cx("form")}>
        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="you@gmail.com"
          value={form.email}
          onChange={onChange}
          error={fieldErrors.email}
        />

        <InputField
          label="Mật khẩu"
          name="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={onChange}
          error={fieldErrors.password}
        />

        {error && <div className={cx("serverError")}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className={cx("button")}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </AuthCardLayout>
  );
}
