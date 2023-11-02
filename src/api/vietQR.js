import axios from "axios";

const vietQRClient = axios.create({
  baseURL: "https://api.vietqr.io/v2/generate",
  headers: {
    "Content-type": "application/json",
    "x-client-id": "92b50e18-fe1c-481e-a48a-80e5770262fa",
    "x-api-key": "9a3ecbd9-f9c5-4a33-9198-22301e8ec973",
  },
});
const MinhLeAccount = {
  accountNo: 5600100288686,
  acqId: 970422,
  accountName: "LE NGOC MINH",
};
const generateQR = ({ amount, addInfo }) => {
  const config = { format: "text", template: "compact" };
  return vietQRClient.post("/", {
    ...config,
    ...MinhLeAccount,
    amount,
    addInfo,
  });
};
export { generateQR };
