import apiClient from "~/services/apiClient";
import { endpoints } from "../../services/endpoints";

export const userService = {
  async getAll(params = {}) {
    // params: { page, limit } nếu cần
    const res = await apiClient.get(endpoints.users.getAll, { params });

    // res bây giờ là nguyên object data do interceptor trả:
    // { result: { items: [...], pagination: {...} } }
    const items = res?.result?.items || [];
    const pagination = res?.result?.pagination || null;

    return { items, pagination };
  },
  bulkSetStatus(ids, isActive) {
    // payload phổ biến
    return apiClient.patch(endpoints.users.bulkSetStatus, {
      ids,
      isActive,
      action: "SET_STATUS", // nếu BE không cần thì bỏ dòng này
    });
  },
  getById(id) {
    return apiClient.get(endpoints.users.getById(id));
  },

  update(id, payload) {
    return apiClient.put(endpoints.users.update(id), payload);
  },

  remove(id) {
    return apiClient.delete(endpoints.users.remove(id));
  },
};
