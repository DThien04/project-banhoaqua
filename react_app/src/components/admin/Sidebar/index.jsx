import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function Sidebar() {
  return (
    <aside className={cx("sidebar")}>
      <div className={cx("logo")}>MyShop Admin</div>

      <nav className={cx("nav")}>
        <NavLink to="/admin" end className={({isActive}) => cx("link", { active: isActive })}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/products" className={({isActive}) => cx("link", { active: isActive })}>
          Products
        </NavLink>
        <NavLink to="/admin/orders" className={({isActive}) => cx("link", { active: isActive })}>
          Orders
        </NavLink>
        <NavLink to="/admin/users" className={({isActive}) => cx("link", { active: isActive })}>
          Users
        </NavLink>
      </nav>
    </aside>
  );
}
