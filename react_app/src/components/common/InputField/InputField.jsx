import classNames from "classnames/bind";
import styles from "./InputField.module.scss";

const cx = classNames.bind(styles);

export default function InputField({
  label,
  name,
  error,
  className,
  ...rest
}) {
  return (
    <div className={cx("group", className)}>
      {label && <label className={cx("label")}>{label}</label>}

      <input
        name={name}
        {...rest}
        className={cx("input", { invalid: !!error })}
      />

      {error && <div className={cx("error")}>{error}</div>}
    </div>
  );
}
