import { useEffect, useState } from "react";
import { authService } from "../features/auth/authService";
import { authStorage } from "../features/auth/authStorage";

export default function Providers({ children }) {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const data = await authService.refresh();
        const token = data.accessToken || data.token;
        if (token) authStorage.set(token);
      } catch (e) {
        authStorage.clear();
      } finally {
        setBooting(false);
      }
    };
    bootstrap();
  }, []);

  if (booting) return null; // hoặc spinner
  return children;
}
