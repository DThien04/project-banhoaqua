import styles from "./ConfirmModal.module.scss";
import classNames from "classnames/bind";
import { useEffect } from "react";

const cx = classNames.bind(styles);

export default function ConfirmModal({
  open,
  title = "Xác nhận",
  message = "",
  confirmText = "OK",
  cancelText = "Hủy",
  loading = false,
  onConfirm,
  onCancel,
}) {
  // ESC để đóng
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className={cx("overlay")} onClick={onCancel}>
      <div className={cx("modal")} onClick={(e) => e.stopPropagation()}>
        <div className={cx("header")}>
          <h3 className={cx("title")}>{title}</h3>
          <button className={cx("close")} onClick={onCancel} aria-label="Close">
            ×
          </button>
        </div>

        <div className={cx("body")}>
          <p className={cx("message")}>{message}</p>
        </div>

        <div className={cx("footer")}>
          <button className={cx("btn", "cancel")} onClick={onCancel} disabled={loading}>
            {cancelText}
          </button>

          <button className={cx("btn", "confirm")} onClick={onConfirm} disabled={loading}>
            {loading ? "Đang xử lý..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
