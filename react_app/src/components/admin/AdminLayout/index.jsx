import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import styles from "./AdminLayout.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function AdminLayout({ children }) {
  return (
    <div className={cx("wrap")}>
      <Sidebar />
      <div className={cx("main")}>
        <Topbar />
        <div className={cx("content")}>{children}</div>
      </div>
    </div>
  );
}
