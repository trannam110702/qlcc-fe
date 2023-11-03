import React, { useState, useEffect } from "react";
import RoomWrapper, { ButtonWrapper, StatusLabelWrapper } from "./style";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  InputNumber,
  Input,
  DatePicker,
  Checkbox,
  Tag,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import IconButton from "../../components/IconButton";
import AntdSpin from "../../components/Spin";
import { roomApi, residentApi } from "../../api/qlccApi";

const Residents = () => {
  const [form] = Form.useForm();
  const [formAdd] = Form.useForm();

  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [rooms, setRooms] = useState(null);
  const [residents, setResidents] = useState(null);
  const [loading, setLoading] = useState(true);
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
      title: "Tên",
      dataIndex: "first_name",
      key: "first_name",
      width: 100,
      defaultSortOrder: "ascend",
      sorter: (a, b) => {
        if (a.first_name < b.first_name) {
          return -1;
        }
        if (a.first_name > b.first_name) {
          return 1;
        }
        return 0;
      },
    },
    {
      title: "Họ",
      dataIndex: "last_name",
      key: "last_name",
      width: 150,
    },
    {
      title: "Ngày sinh",
      dataIndex: "date_of_birth",
      key: "date_of_birth",
      width: 150,
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "CMND/CCCD",
      dataIndex: "citizen_id",
      key: "citizen_id",
      width: 150,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "phone_number",
      width: 150,
    },
    {
      title: "Phòng",
      dataIndex: "room_id",
      key: "room_id",
      width: 100,
      filterSearch: true,
      filters: rooms?.map((item) => {
        return { text: item.number, value: item.uuid };
      }),
      onFilter: (value, record) => {
        if (record.room_id) {
          return record.room_id.startsWith(value);
        } else {
          return false;
        }
      },
      render: (text) => rooms?.find((item) => item.uuid === text)?.number,
    },
    {
      title: "Chủ phòng",
      align: "center",
      dataIndex: "owner",
      key: "owner",
      width: 100,
      render: (owner) => {
        return owner ? <CheckCircleOutlined /> : "";
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
                form.setFieldsValue({
                  ...record,
                  date_of_birth: dayjs(record.date_of_birth),
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
  const getData = async () => {
    try {
      const res = await residentApi.getAll();
      setResidents(
        res.data.map((item) => {
          return { ...item, key: item.uuid };
        })
      );
    } catch (error) {}
  };
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

  useEffect(() => {
    Promise.all([getData(), getRooms()]).then(() => {
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    formAdd.resetFields();
  }, [addModal]);
  return (
    <RoomWrapper>
      <nav>
        <div className="title">Danh sách cư dân</div>
        <Button
          type="primary"
          onClick={() => {
            setAddModal(true);
          }}
        >
          + Thêm mới
        </Button>
      </nav>

      {rooms ? (
        <Table
          bordered
          className="main-table"
          columns={columns}
          pagination={false}
          dataSource={residents}
          loading={loading}
          scroll={{
            x: 1440,
            y: window.innerHeight - 193,
          }}
        />
      ) : (
        <AntdSpin />
      )}
      <Modal
        title="Xác nhận xóa"
        open={deleteModal}
        onOk={async () => {
          try {
            setLoading(true);
            setDeleteModal(false);
            await residentApi.delete(currentRecord.key);
          } catch (error) {
          } finally {
            await getData();
            setLoading(false);
          }
        }}
        onCancel={() => {
          setDeleteModal(false);
          setCurrentRecord(null);
          setLoading(false);
        }}
      >
        <p>Bạn có chắc muốn xóa bản ghi này?</p>
      </Modal>
      <Modal
        title="Chỉnh sửa"
        width={800}
        open={editModal}
        onOk={async () => {
          try {
            await form.validateFields();
            setLoading(true);
            setEditModal(false);
            await residentApi.updateById(currentRecord.key, {
              ...form.getFieldsValue(),
              date_of_birth: form
                .getFieldValue("date_of_birth")
                .format("YYYY-MM-DD"),
            });
          } catch (error) {
          } finally {
            form.resetFields();
            setCurrentRecord(null);
            await getData();
            setLoading(false);
          }
        }}
        onCancel={() => {
          form.resetFields();
          setEditModal(false);
          setCurrentRecord(null);
          setLoading(false);
        }}
      >
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} form={form}>
          <Form.Item
            name="first_name"
            label="Tên"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Họ"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="date_of_birth"
            label="Ngày sinh"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập ngày sinh",
              },
            ]}
          >
            <DatePicker placeholder="Chọn ngày" format="DD-MM-YYYY" />
          </Form.Item>
          <Form.Item
            name="citizen_id"
            label="CMND/CCCD"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone_number"
            label="Số điện thoại"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="room_id" label="Phòng">
            <Input />
          </Form.Item>
          <Form.Item name="owner" label="Là chủ phòng" valuePropName="checked">
            <Checkbox>Có là chủ phòng</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Thêm cư dân"
        width={800}
        open={addModal}
        onOk={async () => {
          try {
            await formAdd.validateFields();
            setLoading(true);
            setAddModal(false);
            await residentApi.add({
              ...formAdd.getFieldsValue(),
              date_of_birth: formAdd
                .getFieldValue("date_of_birth")
                .format("YYYY-MM-DD"),
            });
          } catch (error) {
          } finally {
            await getData();
            setLoading(false);
          }
        }}
        onCancel={() => {
          setAddModal(false);
          setLoading(false);
        }}
      >
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} form={formAdd}>
          <Form.Item
            name="first_name"
            label="Tên"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Họ"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="date_of_birth"
            label="Ngày sinh"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập ngày sinh",
              },
            ]}
          >
            <DatePicker placeholder="Chọn ngày" format="DD-MM-YYYY" />
          </Form.Item>
          <Form.Item
            name="citizen_id"
            label="CMND/CCCD"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone_number"
            label="Số điện thoại"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="owner" label="Là chủ phòng">
            <Checkbox
              onChange={(e) => {
                formAdd.setFieldValue("owner", e.target.checked);
              }}
            >
              Có là chủ phòng
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </RoomWrapper>
  );
};

export default Residents;
