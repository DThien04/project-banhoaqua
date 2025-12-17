import { useNavigate } from "react-router-dom";
import { authService } from "~/features/auth/authService";
import { authStorage } from "~/features/auth/authStorage";
import classNames from "classnames/bind";
import styles from "./Logout.module.scss";
const cx = classNames.bind(styles);
export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout(); 
    } catch (e) {
      console.log("logout api error", e);
    } finally {
      authStorage.clear();
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  return (
    <button onClick={handleLogout} className={cx("btn")} >
      Đăng xuất
    </button>
  );
}
