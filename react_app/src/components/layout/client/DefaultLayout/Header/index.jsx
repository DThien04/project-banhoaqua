import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import LogoutButton from "~/components/common/Logout";
import { authStorage } from "~/features/auth/authStorage";

const cx = classNames.bind(styles);

export default function Header() {
  const token = authStorage.get();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const name = user?.fullName || user?.name || user?.email;
  return (
    <header className={cx("header")}>
      <div className={cx("container")}>
        <Link to="/" className={cx("logo")}>
          MyShop
        </Link>

        <nav className={cx("nav")}>
          <Link to="/" className={cx("link")}>Trang chủ</Link>
          <Link to="/product" className={cx("link")}>Sản phẩm</Link>
          <Link to="/cart" className={cx("link")}>Giỏ hàng</Link>
        </nav>

        <div className={cx("actions")}>
          {!token ? (
            <Link to="/login" className={cx("btnOutline")}>
              Đăng nhập
            </Link>
          ) : (
             <div className={cx("userBox")}>
              <span className={cx("userName")}>
                Xin chào, {name}
              </span>
              <LogoutButton/>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
