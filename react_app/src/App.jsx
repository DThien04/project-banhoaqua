// src/App.jsx (Phiên bản ĐÚNG VÀ HOÀN CHỈNH)

// CHÚ Ý: Đảm bảo đã chuyển BrowserRouter sang main.jsx
import { Routes, Route } from "react-router-dom"; // <-- Chỉ import Routes và Route (KHÔNG CÓ Router)

import { UserRoutes } from "./routes/UserRoutes";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import { AuthRoutes } from "./routes/AuthRoutes";

export default function App() {
  return (
    <Routes>
      {UserRoutes}
      {AuthRoutes}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
