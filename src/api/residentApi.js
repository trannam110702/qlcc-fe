import axiosClient from "./axiosClient";

const contractApi = {
  getBySigner: (id) => {
    return axiosClient.get(`/contract/signer/${id}`);
  },
};
const invoiceApi = {
  getByContract: (id) => {
    return axiosClient.get(`/invoice/getbycontractid/${id}`);
  },
  updateStatus: ({ status, id }) => {
    return axiosClient.post(`/invoice/updatestatus/`, { status, id });
  },
};
const feedbackApi = {
  addFeedback: ({ title, content, resident_id, create_time }) => {
    return axiosClient.post(`/feedback/add/`, {
      title,
      content,
      resident_id,
      create_time,
    });
  },
};
export { contractApi, invoiceApi, feedbackApi };
