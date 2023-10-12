import axiosClient from "./axiosClient";
const authApi = {
  signIn: (username, password) => {
    return axiosClient.post("/auth/signin", { username, password });
  },
  logOut: () => {
    return axiosClient.post("/auth/logout", {});
  },
  checkExpire: () => {
    return axiosClient.get("/auth/checkexpire");
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
    default_number_of_ac,
    default_number_of_desk,
  }) => {
    return axiosClient.post("/roomtype/add", {
      name,
      area,
      default_rent_cost,
      default_number_of_bed,
      default_number_of_fridge,
      default_number_of_ac,
      default_number_of_desk,
    });
  },
  delete: (id) => {
    return axiosClient.delete(`/roomtype/${id}`);
  },
  updateById: (
    id,
    {
      name,
      area,
      default_rent_cost,
      default_number_of_bed,
      default_number_of_fridge,
      default_number_of_ac,
      default_number_of_desk,
    }
  ) => {
    return axiosClient.post(`/roomtype/update/${id}`, {
      name,
      area,
      default_rent_cost,
      default_number_of_bed,
      default_number_of_fridge,
      default_number_of_ac,
      default_number_of_desk,
    });
  },
};
const roomApi = {
  getAll: () => {
    return axiosClient.get("/room/getall");
  },
  getById: (id) => {
    return axiosClient.get(`/room/${id}`);
  },
  add: ({
    number,
    type_id,
    status,
    number_of_bed,
    number_of_fridge,
    number_of_ac,
    number_of_desk,
  }) => {
    return axiosClient.post("/room/add", {
      number,
      type_id,
      status,
      number_of_bed,
      number_of_fridge,
      number_of_ac,
      number_of_desk,
    });
  },
  delete: (id) => {
    return axiosClient.delete(`/room/${id}`);
  },
  updateById: (
    id,
    {
      number,
      type_id,
      status,
      number_of_bed,
      number_of_fridge,
      number_of_ac,
      number_of_desk,
    }
  ) => {
    return axiosClient.post(`/room/update/${id}`, {
      number,
      type_id,
      status,
      number_of_bed,
      number_of_fridge,
      number_of_ac,
      number_of_desk,
    });
  },
};
const residentApi = {
  getAll: () => {
    return axiosClient.get("/resident/getall");
  },
  getById: (id) => {
    return axiosClient.get(`/resident/${id}`);
  },
  add: ({
    first_name,
    last_name,
    date_of_birth,
    citizen_id,
    phone_number,
    room_id,
    owner,
  }) => {
    return axiosClient.post("/resident/add", {
      first_name,
      last_name,
      date_of_birth,
      citizen_id,
      phone_number,
      room_id,
      owner,
    });
  },
  delete: (id) => {
    return axiosClient.delete(`/resident/${id}`);
  },
  updateById: (
    id,
    {
      first_name,
      last_name,
      date_of_birth,
      citizen_id,
      phone_number,
      room_id,
      owner,
    }
  ) => {
    return axiosClient.post(`/resident/update/${id}`, {
      first_name,
      last_name,
      date_of_birth,
      citizen_id,
      phone_number,
      room_id,
      owner,
    });
  },
};
export { authApi, roomTypeApi, roomApi, residentApi };
