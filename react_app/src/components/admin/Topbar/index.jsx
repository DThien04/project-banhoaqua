import styles from "./Topbar.module.scss";
import classNames from "classnames/bind";
import LogoutButton from "~/components/common/Logout";

const cx = classNames.bind(styles);

export default function Topbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <header className={cx("topbar")}>
      <div className={cx("left")}>Xin chào, {user?.fullName || user?.email}</div>
      <div className={cx("right")}>
        <LogoutButton />
      </div>
    </header>
  );
}
