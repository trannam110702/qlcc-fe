import axios from "axios";
// import qs from "query-string";
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use(async (config) => config);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      window.localStorage.removeItem("userId");
      window.localStorage.removeItem("accountType");
      window.location.reload();
    }
    throw error;
  }
);

export default axiosClient;
