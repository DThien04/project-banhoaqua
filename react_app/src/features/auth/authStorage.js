const KEY = "access_token";

export const authStorage = {
  
  get() {
    return localStorage.getItem(KEY);
  },
  set(token) {
    console.log("Lưu localStorage")
    localStorage.setItem(KEY, token);
  },
  clear() {
    localStorage.removeItem(KEY);
  },
};
