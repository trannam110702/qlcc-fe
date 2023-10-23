import React, { useState, useEffect, useMemo } from "react";
import InvoiceWrapper, { ButtonWrapper, InvoiceDetailWrapper } from "./style";
import {
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  Input,
  Tag,
  Select,
  DatePicker,
  Typography,
} from "antd";

import IconButton from "../../components/IconButton";
import { formatCurrency } from "../../ultils";
import {
  serviceApi,
  invoiceApi,
  residentApi,
  roomApi,
  contractApi,
} from "../../api/qlccApi";
import AntdSpin from "../../components/Spin";
import InvoiceStatusLabel from "../../components/InvoiceStatusLabel";
import dayjs from "dayjs";
const { Text } = Typography;
const Invoice = () => {
  const [editForm] = Form.useForm();

  const [deleteModal, setDeleteModal] = useState(false);
  const [detailModal, setdetailModal] = useState(false);

  const [currentRecord, setCurrentRecord] = useState(null);
  const [rooms, setRooms] = useState(null);
  const [contracts, setContracts] = useState(null);
  const [services, setServices] = useState(null);
  const [invoices, setInvoices] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [time, setTime] = useState(null);
  const [loading, setLoading] = useState(false);
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
      title: "Tên hóa đơn",
      dataIndex: "name",
      key: "name",
      width: 150,
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      },
    },
    {
      title: "Phòng",
      dataIndex: "room_id",
      key: "room_id",
      width: 100,
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        const aNum = rooms.find((item) => item.uuid === a).number;
        const bNum = rooms.find((item) => item.uuid === b).number;
        if (aNum < bNum) {
          return -1;
        }
        if (aNum > bNum) {
          return 1;
        }
        return 0;
      },
      render: (text, record) => {
        return rooms.find((item) => item.uuid === record.contract.room_id)
          .number;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (text) => <InvoiceStatusLabel status={text} />,
    },
    {
      title: "Tổng hóa đơn (VND)",
      dataIndex: "total",
      key: "total",
      width: 100,
      render: (text, record) => {
        let total = record.rent_cost + record.purchase;
        total = record.detail.reduce(
          (total, item) => total + item.price * item.used_amount,
          total
        );
        return formatCurrency(total);
      },
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      render: (text, record, index) => {
        return (
          <ButtonWrapper>
            <IconButton
              type="edit"
              onclick={() => {
                setCurrentRecord(record);
                editForm.setFieldsValue(record);
                setdetailModal(true);
              }}
            />
            <IconButton
              type="delete"
              onclick={() => {
                setCurrentRecord(record);
                setDeleteModal(true);
              }}
            />
          </ButtonWrapper>
        );
      },
      width: 100,
    },
  ];
  const getRooms = async () => {
    try {
      const res = await roomApi.getAll();
      setRooms(
        res.data.map((item) => {
          return { ...item, key: item.uuid };
        })
      );
    } catch (error) {}
  };
  const getServices = async () => {
    try {
      const res = await serviceApi.getAll();
      setServices(
        res.data.map((item) => {
          return { ...item, key: item.uuid };
        })
      );
    } catch (error) {}
  };
  const getInvoices = async () => {
    try {
      const res = await invoiceApi.getByTime(time);
      console.log(res);
      setInvoices(
        res.data.map((item) => {
          return { ...item, key: item.uuid };
        })
      );
    } catch (error) {}
  };
  const getContracts = async () => {
    try {
      const contract = await contractApi.getByStatus("true");
      setContracts(contract.data);
    } catch (error) {}
  };
  useEffect(() => {
    if (time) {
      setLoading(true);
      Promise.all([
        getInvoices(),
        getRooms(),
        getContracts(),
        getServices(),
      ]).then(() => {
        setLoading(false);
      });
    }
  }, [time]);
  return (
    <InvoiceWrapper>
      <nav>
        <div className="title">Hóa đơn</div>
        <div className="right">
          <DatePicker
            placement="bottomRight"
            picker="month"
            placeholder="Chọn tháng"
            format="MM-YYYY"
            onChange={(value) => {
              if (value) {
                const month = Number(dayjs(value).format("MM"));
                const year = Number(dayjs(value).format("YYYY"));
                setTime({ month, year });
              } else {
                setTime(null);
                setInvoices(null);
              }
            }}
          />
          {/* <Select
            loading={!rooms}
            className="select"
            showSearch
            allowClear
            filterSort={(a, b) => {
              if (a.label < b.label) {
                return -1;
              }
              if (a.label > b.label) {
                return 1;
              }
              return 0;
            }}
            placeholder="Chọn phòng"
            options={rooms?.map((item) => {
              return { label: `Phòng ${item.number}`, value: item.number };
            })}
            onChange={(value) => {
              setRoomId(rooms?.find((item) => item.number === value)?.uuid);
            }}
          /> */}
        </div>
      </nav>
      <Table
        bordered
        className="main-table"
        columns={columns}
        pagination={false}
        dataSource={invoices}
        loading={loading}
        scroll={{
          x: 1440,
          y: window.innerHeight - 193,
        }}
      />
      <Modal
        title="Xác nhận xóa"
        open={deleteModal}
        onOk={async () => {
          try {
            setLoading(true);
            setDeleteModal(false);
            await invoiceApi.deleteInvoice(currentRecord.key);
          } catch (error) {
          } finally {
            setLoading(false);
          }
        }}
        onCancel={() => {
          setDeleteModal(false);
          setCurrentRecord(null);
        }}
      >
        <p>Bạn có chắc muốn xóa bản ghi này?</p>
      </Modal>
      <Modal
        width={1000}
        open={detailModal}
        onOk={async () => {
          try {
            await editForm.validateFields();
            setLoading(true);
            setdetailModal(false);
            await serviceApi.updateById(
              currentRecord.key,
              editForm.getFieldsValue()
            );
          } catch (error) {
          } finally {
          }
        }}
        onCancel={() => {
          setdetailModal(false);
          setCurrentRecord(null);
        }}
      >
        {currentRecord ? (
          <InvoiceDetail invoice={currentRecord} />
        ) : (
          <AntdSpin></AntdSpin>
        )}
      </Modal>
    </InvoiceWrapper>
  );
};
const InvoiceDetail = ({ invoice }) => {
  console.log(invoice);
  const [room, setRoom] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const totalInvoice = useMemo(() => {
    let total = invoice.rent_cost + invoice.purchase;
    total = invoice.detail.reduce(
      (total, item) => total + item.price * item.used_amount,
      total
    );
    return formatCurrency(total);
  }, [invoice]);
  useEffect(() => {
    const getData = async () => {
      try {
        const roomRes = await roomApi.getById(invoice.contract.room_id);
        const receiverRes = await residentApi.getById(invoice.contract.signer);
        setRoom(roomRes.data);
        setReceiver(receiverRes.data);
      } catch (error) {}
    };
    getData();
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
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
      width: 150,
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      },
    },
    {
      align: "center",
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (text) => formatCurrency(text),
    },
    {
      align: "center",
      title: "Lượng sử dụng",
      dataIndex: "used_amount",
      key: "used_amount",
      width: 100,
    },
    {
      align: "center",
      title: "Tổng (VND)",
      dataIndex: "total",
      key: "total",
      width: 100,
      render: (text, record) =>
        formatCurrency(record.price * record.used_amount),
    },
  ];
  return (
    <InvoiceDetailWrapper>
      {room && receiver ? (
        <>
          <div className="invoice-title">{invoice.name}</div>
          <div className="room">
            Phòng: <span>{room.number}</span>
          </div>
          <div className="item">
            <span className="title"> Người nhận: </span>
            <span>
              {receiver.first_name} {receiver.last_name}
            </span>
          </div>
          <div className="item">
            <span className="title"> Tiền phòng: </span>
            {formatCurrency(invoice.rent_cost)} VND
          </div>
          <div className="item">
            <span className="title">Tiền mua hàng: </span>
            {formatCurrency(invoice.purchase)} VND
          </div>
          <div className="sub-title">Dịch vụ sử dụng: </div>
          <Table
            style={{ marginTop: "1rem" }}
            bordered
            columns={columns}
            pagination={false}
            dataSource={invoice?.detail}
            scroll={{
              x: 800,
              y: window.innerHeight - 193,
            }}
            summary={(data) => {
              console.log(data);
              const total = data.reduce(
                (total, item) => total + item.price * item.used_amount,
                0
              );
              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4}>
                      Tổng dịch vụ
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4} align="center">
                      <Text>{formatCurrency(total)}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          />
          <div className="total">Tổng hóa đơn: {totalInvoice} VND</div>
        </>
      ) : (
        <AntdSpin />
      )}
    </InvoiceDetailWrapper>
  );
};
export default Invoice;
