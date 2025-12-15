const v1 = "/api/v1"

export const endpoints = {
  auth: {
    login: `${v1}/auth/login`,
    refresh: `${v1}/auth/refresh-token`,
    register: `${v1}/auth/register`,
    logout: `${v1}/auth/logout`,
  },
  users: {
    getAll: `${v1}/user`,
    bulkSetStatus: `${v1}/user/bulk/status`,
  },
};
