import HeaderSection from "../features/user/components/HeaderSection";
import FooterSection from "../features/user/components/FooterSection";
import { Outlet } from "react-router-dom";
const UserLayout = () => {
  return (
    <div className="user-layout-wrapper">
      <HeaderSection />

      <main className="main-content-area">
        <Outlet />
      </main>

      <FooterSection />
    </div>
  );
};

export default UserLayout;
