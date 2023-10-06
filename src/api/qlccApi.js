import axiosClient from "./axiosClient";
const authApi = {
  signIn: (username, password) => {
    return axiosClient.post("/auth/signin", { username, password });
  },
  logOut: () => {
    return axiosClient.post("/auth/logout", {});
  },
};
export { authApi };
