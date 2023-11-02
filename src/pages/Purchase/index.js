import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PurchaseWrapper, { ButtonWrapper } from "./style";
import {
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  Switch,
  Select,
  DatePicker,
  Input,
} from "antd";
import IconButton from "../../components/IconButton";
import dayjs from "dayjs";
import { purchaseApi, roomApi } from "../../api/qlccApi";
import { formatCurrency } from "../../ultils";

const { TextArea } = Input;
const Purchase = () => {
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [rooms, setRooms] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [purchasees, setpurchasees] = useState([]);
  const [loading, setLoading] = useState(true);

  useMemo(async () => {
    const roomsData = await roomApi.getAll();
    setRooms(
      roomsData.data.map((item) => {
        return { ...item, key: item.uuid };
      })
    );
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

      render: (text) => rooms?.find((item) => item.uuid === text)?.number,
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      render: (text) => formatCurrency(text),
    },
    {
      title: "Ngày ghi nhận",
      dataIndex: "time_record",
      key: "time_record",
      width: 100,
      defaultSortOrder: "ascend",
      sorter: (a, b) => {
        if (a.time_record < b.time_record) {
          return -1;
        }
        if (a.time_record > b.time_record) {
          return 1;
        }
        return 0;
      },
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 100,
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
                editForm.setFieldsValue({
                  ...record,
                  time_record: dayjs(record.time_record),
                });
                setEditModal(true);
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
  const fetchData = async () => {
    try {
      if (roomId) {
        setLoading(true);
        const purchase = await purchaseApi.getByRoomId(roomId);
        setpurchasees(
          purchase.data.map((item) => {
            return { ...item, key: item.uuid };
          })
        );
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (roomId) {
      setpurchasees(null);
      fetchData();
    } else {
      setpurchasees([]);
    }
    setLoading(false);
  }, [roomId]);
  return (
    <PurchaseWrapper>
      <nav>
        <div className="title">Danh sách nợ mua hàng</div>
        <div className="right">
          <Select
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
          />
          <Button
            type="primary"
            onClick={() => {
              setAddModal(true);
            }}
          >
            + Thêm mới
          </Button>
        </div>
      </nav>
      <Table
        bordered
        className="main-table"
        columns={columns}
        pagination={false}
        dataSource={purchasees}
        loading={purchasees ? loading : true}
        scroll={{
          x: 720,
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
            await purchaseApi.delete(currentRecord.key);
          } catch (error) {
          } finally {
            await fetchData();
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
        title={`Chỉnh sửa mua hàng`}
        width={800}
        open={editModal}
        onOk={async () => {
          try {
            await addForm.validateFields();
            setLoading(true);
            setEditModal(false);
            await purchaseApi.updateById(
              currentRecord.uuid,
              editForm.getFieldsValue()
            );
          } catch (error) {
          } finally {
            editForm.resetFields();
            await fetchData();
            setLoading(false);
          }
        }}
        onCancel={() => {
          addForm.resetFields();
          setEditModal(false);
        }}
      >
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} form={editForm}>
          <Form.Item
            name="room_id"
            label="Phòng số"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              disabled
              options={rooms?.map((item) => {
                return { label: item.number, value: item.uuid };
              })}
            />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Số tiền (VND)"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
              formatter={formatCurrency}
              style={{
                width: "100%",
              }}
              min="0"
              step="1"
            />
          </Form.Item>
          <Form.Item
            name="time_record"
            label="Thời gian ghi nhận"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker placeholder="Chọn ngày" format="DD-MM-YYYY" />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú" rules={[]}>
            <TextArea></TextArea>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={`Thêm mới mua hàng`}
        width={800}
        open={addModal}
        onOk={async () => {
          try {
            await addForm.validateFields();
            setLoading(true);
            setAddModal(false);
            await purchaseApi.add({
              ...addForm.getFieldsValue(),
              room_id: rooms?.find(
                (item) => item.number === addForm.getFieldValue("room_id")
              )?.uuid,
            });
          } catch (error) {
          } finally {
            addForm.resetFields();
            await fetchData();
            setLoading(false);
          }
        }}
        onCancel={() => {
          addForm.resetFields();
          setAddModal(false);
        }}
      >
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} form={addForm}>
          <Form.Item
            name="room_id"
            label="Phòng số"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              showSearch
              options={rooms?.map((item) => {
                return { label: item.number, value: item.number };
              })}
            />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Số tiền (VND)"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
              formatter={formatCurrency}
              style={{
                width: "100%",
              }}
              min="0"
              step="1"
            />
          </Form.Item>
          <Form.Item
            name="time_record"
            label="Thời gian ghi nhận"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker placeholder="Chọn ngày" format="DD-MM-YYYY" />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú" rules={[]}>
            <TextArea></TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </PurchaseWrapper>
  );
};

export default Purchase;
