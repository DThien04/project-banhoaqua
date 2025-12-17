import classNames from "classnames/bind";
import styles from "./AuthCardLayout.module.scss";

const cx = classNames.bind(styles);

export default function AuthCardLayout({ title, children, footer }) {
  return (
    <div className={cx("wrap")}>
      <div className={cx("card")}>
        <h2 className={cx("title")}>{title}</h2>
        {children}
        {footer && <div className={cx("footer")}>{footer}</div>}
      </div>
    </div>
  );
}
