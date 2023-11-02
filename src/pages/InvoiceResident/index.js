import React, { useState, useEffect, useMemo, useContext } from "react";
import InvoiceWrapper, {
  ButtonWrapper,
  InvoiceDetailWrapper,
  PaymentWrapper,
} from "./style";
import { Table, Button, Modal, Form, Typography, Row, Col } from "antd";
import { AuthContext } from "../../hooks/useAuth";
import { MessageContext } from "../../store/MessageContext";
import IconButton from "../../components/IconButton";
import { formatCurrency } from "../../ultils";
import { invoiceApi, contractApi } from "../../api/residentApi";
import { roomApi, residentApi } from "../../api/qlccApi";
import { generateQR } from "../../api/vietQR";
import AntdSpin from "../../components/Spin";
import InvoiceStatusLabel from "../../components/InvoiceStatusLabel";
import dayjs from "dayjs";
const { Text, Title } = Typography;
const InvoiceResident = () => {
  const { userData } = useContext(AuthContext);
  const [editForm] = Form.useForm();

  const [deleteModal, setDeleteModal] = useState(false);
  const [detailModal, setdetailModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);

  const [currentRecord, setCurrentRecord] = useState(null);
  const [invoices, setInvoices] = useState(null);
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      align: "center",
      title: "STT",
      dataIndex: "stt",
      key: "name",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên hóa đơn",
      dataIndex: "name",
      key: "name",

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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",

      render: (text) => <InvoiceStatusLabel status={text} />,
    },
    {
      title: "Tổng hóa đơn (VND)",
      dataIndex: "total",
      key: "total",

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

      render: (text, record, index) => {
        return (
          <ButtonWrapper>
            <IconButton
              type="view"
              onclick={() => {
                setCurrentRecord(record);
                editForm.setFieldsValue(record);
                setdetailModal(true);
              }}
            >
              Xem
            </IconButton>
            <IconButton
              type="transfer-money"
              onclick={() => {
                setCurrentRecord(record);
                setPaymentModal(true);
              }}
            >
              Thanh toán
            </IconButton>
          </ButtonWrapper>
        );
      },
    },
  ];

  const getInvoices = async () => {
    try {
      setLoading(true);
      const contracts = await contractApi.getBySigner(userData.resident_id);
      const res = await invoiceApi.getByContract(contracts.data.uuid);
      setInvoices(
        res.data.map((item) => {
          return { ...item, key: item.uuid };
        })
      );
    } catch (error) {}
  };
  useEffect(() => {
    setLoading(true);
    getInvoices().then(() => {
      setLoading(false);
    });
  }, []);
  return (
    <InvoiceWrapper>
      <nav>
        <div className="title">Hóa đơn</div>
        <div className="right"></div>
      </nav>
      <Table
        bordered
        className="main-table"
        columns={columns}
        pagination={false}
        dataSource={invoices}
        loading={loading}
        scroll={{
          x: 600,
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
            await getInvoices();
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
        footer={[
          <Button
            type="primary"
            onClick={() => {
              setdetailModal(false);
              setPaymentModal(true);
            }}
          >
            Thanh toán
          </Button>,
        ]}
        onOk={async () => {}}
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
      <Modal
        width={1200}
        open={paymentModal}
        footer={null}
        onOk={async () => {}}
        onCancel={() => {
          setPaymentModal(false);
          setCurrentRecord(null);
        }}
      >
        <Payment invoice={currentRecord} />
      </Modal>
    </InvoiceWrapper>
  );
};
const InvoiceDetail = ({ invoice }) => {
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
  return (
    <InvoiceDetailWrapper>
      {room && receiver ? (
        <>
          <div className="invoice-title">{invoice.name}</div>
          <div className="room">
            Phòng: <span>{room.number}</span>
          </div>
          <div className="item">
            <span className="title"> Từ ngày: </span>
            <span>{dayjs(invoice.from_date).format("DD-MM-YYYY")}</span>
          </div>
          <div className="item">
            <span className="title"> Đến ngày: </span>
            <span>{dayjs(invoice.to_date).format("DD-MM-YYYY")}</span>
          </div>
          <div className="item">
            <span className="title"> Người nhận: </span>
            <span>
              {receiver.first_name} {receiver.last_name}
            </span>
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
          <div className="cal-total">
            <div className="total">
              <span className="title"> Tiền phòng: </span>
              {formatCurrency(invoice.rent_cost)} VND
            </div>
            <div className="total">
              <span className="title">Nợ mua hàng: </span>
              {formatCurrency(invoice.purchase)} VND
            </div>
            <div className="total">Tổng hóa đơn: {totalInvoice} VND</div>
          </div>
          <div className="date">
            Ngày {dayjs(invoice.creat_time).format("DD")} tháng{" "}
            {dayjs(invoice.creat_time).format("MM")} năm{" "}
            {dayjs(invoice.creat_time).format("YYYY")}
          </div>
          <div className="signatrue">Ngọc Minh luxury building</div>
        </>
      ) : (
        <AntdSpin />
      )}
    </InvoiceDetailWrapper>
  );
};
const Payment = ({ invoice }) => {
  const { notifiApi } = useContext(MessageContext);
  const [imgSrc, setImgSrc] = useState(null);
  const [room, setRoom] = useState(null);
  const amount = useMemo(() => {
    let amount = invoice.rent_cost + invoice.purchase;
    amount = invoice.detail.reduce(
      (total, item) => total + item.price * item.used_amount,
      amount
    );
    return amount;
  }, []);
  useEffect(() => {
    const getRoom = async () => {
      try {
        const roomRes = await roomApi.getById(invoice.contract.room_id);
        setRoom(roomRes.data);
      } catch (error) {}
    };
    getRoom();
  }, []);
  useEffect(() => {
    if (room) {
      generateQR({
        amount,
        addInfo: `Thanh toan hoa don thang ${invoice.month} nam ${invoice.year} phong ${room.number}`,
      }).then((res) => {
        if (res.data.code === "00") setImgSrc(res.data.data.qrDataURL);
      });
    }
  }, [room]);
  return (
    <PaymentWrapper>
      {invoice && imgSrc ? (
        <div className="main">
          <img src={imgSrc}></img>
          <div className="info">
            <div className="main-info">
              <Title level={3} style={{ textAlign: "center" }}>
                Thông tin chuyển khoản
              </Title>
              <Row className="row">
                <Col span={10} className="title">
                  Số tài khoản:{" "}
                </Col>
                <Col span={14}>5600100288686</Col>
              </Row>
              <Row className="row">
                <Col span={10} className="title">
                  Ngân hàng thụ hưởng:{" "}
                </Col>
                <Col span={14}>MB Bank</Col>
              </Row>
              <Row className="row">
                <Col span={10} className="title">
                  Tên tài khoản thụ hưởng:{" "}
                </Col>
                <Col span={14}>LE NGOC MINH</Col>
              </Row>
              <Row className="row">
                <Col span={10} className="title">
                  Số tiền:{" "}
                </Col>
                <Col span={14}>{formatCurrency(amount)} VND</Col>
              </Row>
              <Row className="row">
                <Col span={10} className="title">
                  Nội dung chuyển khoản:{" "}
                </Col>
                <Col
                  span={14}
                >{`Thanh toan hoa don thang ${invoice.month} nam ${invoice.year} phong ${room.number}`}</Col>
              </Row>
              <Row
                span={24}
                style={{ justifyContent: "center", marginTop: "2rem" }}
              >
                {invoice.status === "new" && (
                  <Button
                    type="primary"
                    onClick={async () => {
                      try {
                        await invoiceApi.updateStatus({
                          status: "pending",
                          id: invoice.uuid,
                        });
                        notifiApi.success({
                          message: `Xác nhận thành công!`,
                          description: "Vui lòng chờ ban quản trị phê duyệt!",
                          placement: "bottomRight",
                        });
                      } catch (error) {}
                    }}
                    style={{ width: "100%" }}
                  >
                    Xác nhận đã thanh toán
                  </Button>
                )}
              </Row>
            </div>
          </div>
        </div>
      ) : (
        <AntdSpin />
      )}
    </PaymentWrapper>
  );
};
export default InvoiceResident;
