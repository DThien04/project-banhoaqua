import axios from "axios";
import { notification } from "antd";
import { createBrowserHistory } from "history";
const isDev = import.meta.env.DEV;
const history = createBrowserHistory();
const instance = axios.create({
  baseURL: isDev ? "" : import.meta.env.VITE_BACKEND_URL,
});

instance.interceptors.request.use(
  function (config) {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  function (error) {
    if (error?.response?.data) return;
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    if (response && response.data) return response.data;
    return response;
  },
  function (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");

      notification.error({
        message: "Phiên đăng nhập hết hạn",
        description: "Vui lòng đăng nhập lại để tiếp tục sử dụng!",
        duration: 2,
        placement: "topRight",
        style: { background: "#ff4d4f", color: "#fff" },
      });

      setTimeout(() => {
        history.replace("/");
        window.location.reload();
      }, 500);

      return Promise.reject(error);
    }
    if (error.response?.status === 403) {
      notification.error({
        message: "Error",
        description: "Bạn không có quyền truy cập vào chức năng này",
        duration: 2,
        placement: "topRight",
        style: { background: "#ff4d4f", color: "#fff" },
      });
      setTimeout(() => {
        history.replace("/");
        window.location.reload();
      }, 1000);
      return Promise.reject(error);
    }

    if (error?.response?.data) {
      return error.response.data;
    }
    return Promise.reject(error);
  }
);
export default instance;
