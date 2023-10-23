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
  getRoomStatus: (id) => {
    return axiosClient.get(`/room/status/id/${id}`);
  },
  getRoomsByStatus: (status) => {
    return axiosClient.get(`/room/status/${status}`);
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
const serviceApi = {
  getAll: () => {
    return axiosClient.get("/service/getall");
  },
  getById: (id) => {
    return axiosClient.get(`/service/${id}`);
  },
  getByType: (type) => {
    return axiosClient.get(`/service/type/${type}`);
  },
  add: ({ name, price, unit }) => {
    return axiosClient.post("/service/add", {
      name,
      price,
      unit,
    });
  },
  delete: (id) => {
    return axiosClient.delete(`/service/${id}`);
  },
  updateById: (id, { name, price, unit }) => {
    return axiosClient.post(`/service/update/${id}`, {
      name,
      price,
      unit,
    });
  },
};
const contractApi = {
  getAll: () => {
    return axiosClient.get("/contract/getall");
  },
  getById: (id) => {
    return axiosClient.get(`/contract/${id}`);
  },
  getByStatus: (status) => {
    return axiosClient.get(`/contract/status/${status}`);
  },
  add: ({
    room_id,
    signer,
    from_date,
    to_date,
    rent_cost_per_month,
    resident_list,
    deposit,
    type,
    option_service,
  }) => {
    return axiosClient.post("/contract/add", {
      room_id,
      signer,
      from_date,
      to_date,
      rent_cost_per_month,
      resident_list,
      deposit,
      type,
      option_service,
    });
  },
  delete: (id) => {
    return axiosClient.delete(`/contract/${id}`);
  },
  updateById: (
    id,
    {
      room_id,
      signer,
      from_date,
      to_date,
      rent_cost_per_month,
      deposit,
      type,
      option_service,
    }
  ) => {
    return axiosClient.post(`/contract/update/${id}`, {
      room_id,
      signer,
      from_date,
      to_date,
      rent_cost_per_month,
      deposit,
      type,
      option_service,
    });
  },
  setStatus: (status, id) => {
    return axiosClient.post(`/contract/status`, { status, id });
  },
};
const serviceIndexApi = {
  getAll: () => {
    return axiosClient.get("/service-index/getall");
  },
  getById: (id) => {
    return axiosClient.get(`/service-index/${id}`);
  },
  getByType: (type, roomId) => {
    if (roomId)
      return axiosClient.get(`/service-index/type/${type}?room-id=${roomId}`);
  },
  getByMonth: (month, year, type, room_id) => {
    return axiosClient.post(`/service-index/getbymonth`, {
      month,
      year,
      type,
      room_id,
    });
  },
  add: ({ type, room_id, index, time_record }) => {
    return axiosClient.post("/service-index/add", {
      type,
      room_id,
      index,
      time_record,
    });
  },
  delete: (id) => {
    return axiosClient.delete(`/service-index/${id}`);
  },
  updateById: (id, { room_id, index, time_record }) => {
    return axiosClient.post(`/service-index/update/${id}`, {
      room_id,
      index,
      time_record,
    });
  },
};
const purchaseApi = {
  getAll: () => {
    return axiosClient.get("/purchase/getall");
  },
  getById: (id) => {
    return axiosClient.get(`/purchase/${id}`);
  },
  getByRoomId: (id) => {
    return axiosClient.get(`/purchase/getbyroom/${id}`);
  },
  getByMonth: (month, year, room_id) => {
    return axiosClient.post(`/purchase/getbymonth`, {
      month,
      year,
      room_id,
    });
  },
  add: ({ room_id, amount, time_record, note }) => {
    return axiosClient.post("/purchase/add", {
      room_id,
      amount,
      time_record,
      note,
    });
  },
  delete: (id) => {
    return axiosClient.delete(`/purchase/${id}`);
  },
  updateById: (id, { room_id, amount, time_record, note }) => {
    return axiosClient.post(`/purchase/update/${id}`, {
      room_id,
      amount,
      time_record,
      note,
    });
  },
};
const accountApi = {
  getAll: () => {
    return axiosClient.get("/account/getall");
  },
  updatePassword: (username, password) => {
    return axiosClient.post(`/account/update`, { username, password });
  },
  delete: (id) => {
    return axiosClient.delete(`/account/${id}`);
  },
};
const invoiceApi = {
  getAll: () => {
    return axiosClient.get("/invoice/getall");
  },
  getByTime: ({ month, year }) => {
    return axiosClient.post("/invoice/getbytime", { month, year });
  },
  createInvoices: (invoiceConfig) => {
    return axiosClient.post("/invoice/create", invoiceConfig);
  },
  deleteInvoice: (id) => {
    return axiosClient.delete(`/invoice/${id}`);
  },
};
export {
  authApi,
  roomTypeApi,
  roomApi,
  residentApi,
  serviceApi,
  contractApi,
  serviceIndexApi,
  purchaseApi,
  accountApi,
  invoiceApi,
};
