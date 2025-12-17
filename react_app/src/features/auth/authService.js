import apiClient from "../../services/apiClient";
import { endpoints } from "../../services/endpoints";

export const authService = {
  login: (payload) => apiClient.post(endpoints.auth.login, payload),
  register: (payload) => apiClient.post(endpoints.auth.register, payload),
   refresh: () => apiClient.post(endpoints.auth.refresh),
     logout: () => apiClient.post(endpoints.auth.logout),
     
};
