import axiosClient from "./axiosClient";
const authApi = {
  signIn: (username, password) => {
    return axiosClient.post("/auth/signin", { username, password });
  },
  logOut: () => {
    return axiosClient.post("/auth/logout", {});
  },
};
const roomTypeApi = {
  getAll: () => {
    return axiosClient.get("/roomtype/getall");
  },
  getById: (id) => {
    return axiosClient.get(`/roomtype/${id}`);
  },
  add: ({
    name,
    area,
    default_rent_cost,
    default_number_of_bed,
    default_number_of_fridge,
    default_number_of_AC,
    default_number_of_desk,
  }) => {
    return axiosClient.post("/roomtype/add", {
      name,
      area,
      default_rent_cost,
      default_number_of_bed,
      default_number_of_fridge,
      default_number_of_AC,
      default_number_of_desk,
    });
  },
  delete: (id) => {
    return axiosClient.delete(`/roomtype/${id}`);
  },
};
export { authApi, roomTypeApi };
