import InputField from "~/components/common/InputField/InputField";
import AuthCardLayout from "~/components/common/AuthCardLayout/AuthCardLayout";
import classNames from "classnames/bind";
import styles from "./Register.module.scss";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

export default function RegisterView({
  form,
  fieldErrors,
  error,
  success,
  loading,
  onChange,
  onSubmit,
}) {
  return (
    <AuthCardLayout
      title="Đăng ký"
      footer={
        <p>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className={cx("form")}>
        <InputField
          label="Họ tên"
          name="fullName"
          type="text"
          placeholder="Nhập họ tên"
          value={form.fullName}
          onChange={onChange}
          error={fieldErrors.fullName}
        />

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

        <InputField
          label="Nhập lại mật khẩu"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={onChange}
          error={fieldErrors.confirmPassword}
        />
        {success && <div className={cx("success")}>{success}</div>}
        {error && <div className={cx("serverError")}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className={cx("button")}
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>
    </AuthCardLayout>
  );
}
