import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./header.css";
import { AuthContext } from "../../../context/auth.context";

function Header() {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const { auth, setAuth } = useContext(AuthContext);

  const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("access_token");

  setAuth({
    isAuthenticated: false,
    user: { email: "", name: "" }
  });

  setOpenUserMenu(false);
}
  console.log(">>>check auth: ", auth)

  return (
    <header className="header">

      {/* ============ TOP BAR ============ */}
      <div className="container">
        <div className="top-bar">

          {/* Logo */}
          <img src="/logo.png" className="logo" />

          {/* Social icons */}
          <div className="social-box">
            <div className="circle-icon"><FaFacebookF /></div>
            <div className="circle-icon"><FaInstagram /></div>
          </div>

          {/* Hotline */}
          <div className="info-box">
            <FaPhoneAlt className="info-icon" />
            <div className="info-text">
              <span className="info-title">Hotline</span>
              <span className="info-value">+84 988.387.811</span>
            </div>
          </div>

          {/* Email */}
          <div className="info-box">
            <FaEnvelope className="info-icon" />
            <div className="info-text">
              <span className="info-title">Send email</span>
              <span className="info-value">Joygreenvn@gmail.com</span>
            </div>
          </div>

          {/* Address */}
          <div className="info-box address-box">
            <FaMapMarkerAlt className="info-icon" />
            <div className="info-text">
              <span className="info-title">226 Lê Trọng Tấn, Định Công, Hà Nội</span>
              <span className="info-value">
                131 Chu Huy Mân, P. Phúc Đồng, Hà Nội
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ============ NAVIGATION ============ */}
      <div className="nav-wrapper">
        <div className="container nav-bar">

          <nav className="menu">
            <Link to="/" className="dropdown">Home</Link>
            <Link to="/best-seller">Best Seller</Link>
            <Link to="/menu-hoa-qua" className="dropdown">Menu hoa quả</Link>
            <Link to="/hop-mix" className="dropdown">Hộp mix</Link>
            <Link to="/feedback">Feedback</Link>
            <Link to="/shop" className="dropdown">Shop</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <div className="actions">
            <Search className="nav-icon action-icon" />
            <ShoppingCart className="nav-icon action-icon" />

            <div className="user-area">
              <div
                className="user-display"
                onClick={() => setOpenUserMenu(!openUserMenu)}
              >
                <User className="nav-icon" />

                {/* Nếu đã đăng nhập → show tên */}
                {auth.isAuthenticated && (
                  <span className="user-text">{auth.user.name}</span>
                )}
              </div>

              {openUserMenu && (
                <div className="user-dropdown">
                  {!auth.isAuthenticated && <Link to="/login" className="dropdown-item">Đăng nhập</Link>}
                  {auth.isAuthenticated && <span className="dropdown-item" onClick={handleLogout}>Đăng xuất</span>}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

    </header>
  );
}

export default Header;
