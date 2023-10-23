import React, { useState, useEffect, useContext, createContext } from "react";
import {
  Button,
  Steps,
  Form,
  Input,
  DatePicker,
  Transfer,
  Table,
  Modal,
} from "antd";
import CreateInvoiceWrapper, { ContentWrapper, ButtonWrapper } from "./style";
import IconButton from "../../components/IconButton";
import AntdSpin from "../../components/Spin";
import dayjs from "dayjs";
import {
  serviceApi,
  contractApi,
  roomApi,
  residentApi,
  serviceIndexApi,
  invoiceApi,
} from "../../api/qlccApi";
import { formatCurrency } from "../../ultils";

const CreateInvoice = () => {
  const [form] = Form.useForm();
  const [contractsModal, setContractsModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [selectedContracts, setSelectedContracts] = useState([]);
  const [contracts, setContracts] = useState(null);
  const [rooms, setRooms] = useState(null);
  const [residents, setResidents] = useState(null);
  const [services, setServices] = useState(null);
  const getContract = async () => {
    try {
      let contracts = (await contractApi.getByStatus("true")).data;
      contracts = contracts.map((item) => {
        return { ...item, key: item.uuid };
      });
      setContracts(contracts);
    } catch (error) {}
  };
  const getRoom = async () => {
    try {
      const rooms = await roomApi.getAll();
      setRooms(rooms.data);
    } catch (error) {}
  };
  const getResident = async () => {
    try {
      const residents = await residentApi.getAll();
      setResidents(residents.data);
    } catch (error) {}
  };
  const getServicePrice = async () => {
    try {
      const services = await serviceApi.getAll();
      setServices(services.data);
    } catch (error) {}
  };
  useEffect(() => {
    Promise.all([
      getContract(),
      getRoom(),
      getResident(),
      getServicePrice(),
    ]).then();
  }, []);
  const columns = [
    {
      align: "center",
      title: "STT",
      dataIndex: "stt",
      key: "name",
      render: (text, record, index) => index + 1,
      width: 50,
    },
    {
      title: "Phòng số",
      dataIndex: "room_id",
      key: "room_id",
      width: 100,
      defaultSortOrder: "ascend",
      sorter: (a, b) => {
        let aNum = rooms?.find((item) => item.uuid === a.room_id).number;
        let bNum = rooms?.find((item) => item.uuid === b.room_id).number;
        if (aNum < bNum) {
          return -1;
        }
        if (aNum > bNum) {
          return 1;
        }
        return 0;
      },
      render: (text) => rooms?.find((item) => item.uuid === text).number,
    },
    {
      title: "Người thuê",
      dataIndex: "signer",
      key: "signer",
      width: 150,
      sorter: (a, b) => {
        if (a.signer < b.signer) {
          return -1;
        }
        if (a.signer > b.signer) {
          return 1;
        }
        return 0;
      },
      render: (text) => {
        const resident = residents?.find((item) => item.uuid === text);
        return `${resident?.last_name} ${resident?.first_name}`;
      },
    },
    {
      title: "Loại hợp đồng",
      dataIndex: "type",
      width: 100,
      render: (text) => (text === "long-term" ? "Công ty" : "Ngoài"),
      filters: [
        { text: "Công ty", value: "long-term" },
        { text: "Ngoài", value: "short-term" },
      ],
      onFilter: (value, record) => record.type.startsWith(value),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "from_date",
      key: "from_date",
      width: 100,
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "to_date",
      key: "to_date",
      width: 100,
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
  ];
  const rowSelection = {
    selectedContracts,
    onChange: (newSelectedContracts) => {
      setSelectedContracts(newSelectedContracts);
      form.setFieldValue("contracts", newSelectedContracts);
    },
  };
  return (
    <CreateInvoiceWrapper>
      <div className="title">Trình tạo hóa đơn</div>
      <ContentWrapper>
        {contracts && rooms && residents ? (
          <Form
            form={form}
            layout="vertical"
            style={{ maxWidth: "800px", margin: "0 auto" }}
          >
            <Form.Item
              name="time"
              label="Thời gian"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <DatePicker
                picker="month"
                placeholder="Chọn tháng"
                format="MM-YYYY"
                onChange={(value) => {
                  if (value) {
                    form.setFieldValue(
                      "name",
                      `Hóa đơn tháng ${dayjs(value).format("MM - YYYY")}`
                    );
                  } else {
                    form.setFieldValue("name", "");
                  }
                }}
              />
            </Form.Item>
            <Form.Item
              name="name"
              label="Tên tập hóa đơn"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="contracts" label="Chọn hợp đồng làm hóa đơn">
              <Button
                type="dashed"
                onClick={() => {
                  setContractsModal(true);
                }}
              >
                Chọn hợp đồng
              </Button>
              <span> ({selectedContracts.length} đã chọn)</span>
            </Form.Item>
            <Button
              type="primary"
              style={{ float: "right" }}
              onClick={() => {
                setConfirmModal(true);
              }}
            >
              Hoàn tất tạo hóa đơn
            </Button>
          </Form>
        ) : (
          <AntdSpin />
        )}
      </ContentWrapper>
      <Modal
        title="Xác nhận"
        open={confirmModal}
        onOk={async () => {
          try {
            form.validateFields();
            setLoading(true);
            setConfirmModal(false);
            invoiceApi.createInvoices(form.getFieldsValue());
          } catch (error) {
          } finally {
            setLoading(false);
          }
        }}
        onCancel={() => {
          setConfirmModal(false);
        }}
      >
        <p>Hành động này sẽ gửi hóa đơn đến các phòng</p>
      </Modal>
      <Modal
        width={1440}
        title="Chọn hợp đồng"
        open={contractsModal}
        onOk={async () => {
          try {
            setLoading(true);
            setContractsModal(false);
          } catch (error) {
          } finally {
            setLoading(false);
          }
        }}
        onCancel={() => {
          setContractsModal(false);
          setLoading(false);
        }}
      >
        <Table
          bordered
          className="main-table"
          columns={columns}
          pagination={false}
          dataSource={contracts}
          scroll={{
            x: 1280,
            y: window.innerHeight - 193,
          }}
          rowSelection={rowSelection}
        />
      </Modal>
    </CreateInvoiceWrapper>
  );
};
export default CreateInvoice;
