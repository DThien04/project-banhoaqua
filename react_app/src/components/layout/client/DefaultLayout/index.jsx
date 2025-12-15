import Header from "./Header";
import styles from "./DefaultLayout.module.scss";
import Sidebar from "./Sidebar";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
function DefaultLayout({ children }) {
  return (
    <>
      <Header></Header>
      <div className={cx("container")}>
        <Sidebar />
        <div className={cx("content")}>{children}</div>
      </div>
    </>
  );
}

export default DefaultLayout;
