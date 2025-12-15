import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../authService";
import { authStorage } from "../authStorage";
import { validateLogin } from "~/utils/validators";

export function useLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // đã login thì đá về home
  useEffect(() => {
    const token = authStorage.get();
    if (token) navigate("/", { replace: true });
  }, [navigate]);

const onChange = (e) => {
  const { name, value, isTrusted } = e.target;
  setForm(p => ({ ...p, [name]: value }));

  if (isTrusted) { // chỉ clear khi user tự gõ
    setFieldErrors(p => ({ ...p, [name]: "" }));
    setError("");
  }
};


 const onSubmit = async (e) => {
  e.preventDefault();

  const { isValid, errors } = validateLogin(form);
  if (!isValid) {
    setFieldErrors(errors);
    return;
  }

  setLoading(true);
  setError("");         // chỉ clear lỗi chung
  // KHÔNG clear fieldErrors ở đây

  try {
    const res = await authService.login(form);

    const accessToken =
      res?.data?.accessToken ||
      res?.accessToken ||
      res?.token;

    if (!accessToken) {
      throw new Error("Backend không trả access token");
    }

    authStorage.set(accessToken);
  const user = res?.data?.user || res?.user;
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

   if (user?.role === "ADMIN") {
  navigate("/admin", { replace: true });
} else {
  navigate("/", { replace: true });
}
  } catch (err) {
    const backendError =
      err?.backendError || err?.raw?.response?.data?.error;

   if (backendError?.statusCode === 401) {
  const msg = backendError.message?.toLowerCase() || "";

  if (msg.includes("email")) {
    setFieldErrors({ email: backendError.message });
  } else if (msg.includes("mật khẩu") || msg.includes("password")) {
    setFieldErrors({ password: backendError.message });
  } else {
    setError(backendError.message); // không rõ field thì show chung
  }
  return;
}


    if (
      backendError?.code === "VALIDATION_ERROR" &&
      Array.isArray(backendError.details)
    ) {
      const mapped = {};
      backendError.details.forEach((d) => {
        if (d?.field) mapped[d.field] = d.message;
      });
      setFieldErrors((p) => ({ ...p, ...mapped }));
      setError(backendError.message || "Dữ liệu không hợp lệ");
      return;
    }

    setError(backendError?.message || err?.message || "Đăng nhập thất bại");
  } finally {
    setLoading(false);
  }
};


  return {
    form,
    fieldErrors,
    error,
    loading,
    onChange,
    onSubmit,
  };
}
