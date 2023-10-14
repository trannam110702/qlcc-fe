import React, { useState, useEffect } from "react";
import RoomWrapper, { ButtonWrapper } from "./style";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  InputNumber,
  Input,
  Tag,
} from "antd";
import IconButton from "../../components/IconButton";

import { roomApi, roomTypeApi } from "../../api/qlccApi";

const Rooms = () => {
  const [form] = Form.useForm();
  const [formAdd] = Form.useForm();

  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [roomTypes, setRoomTypes] = useState(null);
  const [room, setRoom] = useState(null);
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
      title: "Phòng số",
      dataIndex: "number",
      key: "number",
      width: 200,
      defaultSortOrder: "ascend",
      sorter: (a, b) => {
        if (a.number < b.number) {
          return -1;
        }
        if (a.number > b.number) {
          return 1;
        }
        return 0;
      },
      filters: [
        {
          text: "Tầng 1",
          value: "1",
        },
        {
          text: "Tầng 2",
          value: "2",
        },
        {
          text: "Tầng 3",
          value: "3",
        },
        {
          text: "Tầng 4",
          value: "4",
        },
        {
          text: "Tầng 5",
          value: "5",
        },
        {
          text: "Tầng 6",
          value: "6",
        },
      ],
      onFilter: (value, record) => record.number.toString().startsWith(value),
    },
    {
      title: "Loại phòng",
      dataIndex: "type_name",
      key: "type_name",
      width: 100,
      sorter: (a, b) => {
        if (a.type_id < b.type_id) {
          return -1;
        }
        if (a.type_id > b.type_id) {
          return 1;
        }
        return 0;
      },
      filters: roomTypes?.map((item) => {
        return { text: item.name, value: item.uuid };
      }),
      onFilter: (value, record) => record.type_id.startsWith(value),
      render: (text, record) => {
        return (
          <>{roomTypes?.find((item) => item.uuid === record.type_id)?.name}</>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      filters: [
        { text: "Trống", value: "empty" },
        { text: "Có khách", value: "occupied" },
      ],
      onFilter: (value, record) => record.status.startsWith(value),
      sorter: (a, b) => {
        if (a.status < b.status) {
          return -1;
        }
        if (a.status > b.status) {
          return 1;
        }
        return 0;
      },
      render: (text, record) => <StatusLabel status={record.status} />,
    },
    {
      title: "Số giường",
      dataIndex: "number_of_bed",
      key: "number_of_bed",
      width: 100,
    },
    {
      title: "Số tủ lạnh",
      dataIndex: "number_of_fridge",
      key: "number_of_fridge",
      width: 100,
    },
    {
      title: "Số điều hòa",
      dataIndex: "number_of_ac",
      key: "number_of_ac",
      width: 100,
    },
    {
      title: "Số bàn làm việc",
      dataIndex: "number_of_desk",
      key: "number_of_desk",
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
                form.setFieldsValue(record);
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
      const rooms = await roomApi.getAll();
      const roomTypes = await roomTypeApi.getAll();
      const roomsWithStatus = await Promise.all(
        rooms.data.map(async (item) => {
          const status = await roomApi.getRoomStatus(item.uuid);
          return {
            status,
            ...item,
          };
        })
      );
      setRoom(
        roomsWithStatus.map((item) => {
          return { ...item, key: item.uuid, status: item.status?.data };
        })
      );
      setRoomTypes(roomTypes.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchData();
    setLoading(false);
  }, []);
  useEffect(() => {
    formAdd.resetFields();
  }, [addModal]);
  return (
    <RoomWrapper>
      <nav>
        <div className="title">Danh sách phòng</div>
        <Button
          type="primary"
          onClick={() => {
            setAddModal(true);
          }}
        >
          + Thêm mới
        </Button>
      </nav>

      <Table
        bordered
        className="main-table"
        columns={columns}
        pagination={false}
        dataSource={room}
        loading={room ? loading : true}
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
            await roomApi.delete(currentRecord.key);
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
        title="Chỉnh sửa"
        width={800}
        open={editModal}
        onOk={async () => {
          try {
            await form.validateFields();
            setLoading(true);
            setEditModal(false);
            console.log(form.getFieldsValue());
            await roomApi.updateById(currentRecord.key, form.getFieldsValue());
          } catch (error) {
          } finally {
            fetchData();
            setLoading(false);
          }
        }}
        onCancel={() => {
          setEditModal(false);
          setCurrentRecord(null);
        }}
      >
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} form={form}>
          <Form.Item
            name="number"
            label="Số phòng"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type_id"
            label="Loại phòng"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              options={roomTypes?.map((item) => {
                return { label: item.name, value: item.uuid };
              })}
            />
          </Form.Item>

          <Form.Item
            name="number_of_bed"
            label="Số giường"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              min="0"
              step="1"
            />
          </Form.Item>
          <Form.Item
            name="number_of_fridge"
            label="Số tủ lạnh"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              min="0"
              step="1"
            />
          </Form.Item>
          <Form.Item
            name="number_of_ac"
            label="Số điều hòa"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              min="0"
              step="1"
            />
          </Form.Item>
          <Form.Item
            name="number_of_desk"
            label="Số bàn làm việc"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              min="0"
              step="1"
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Thêm mới phòng"
        width={800}
        open={addModal}
        onOk={async () => {
          try {
            await formAdd.validateFields();
            setLoading(true);
            setAddModal(false);
            await roomApi.add(formAdd.getFieldsValue());
          } catch (error) {
          } finally {
            fetchData();
            setLoading(false);
          }
        }}
        onCancel={() => {
          setAddModal(false);
        }}
      >
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} form={formAdd}>
          <Form.Item
            name="number"
            label="Số phòng"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type_id"
            label="Loại phòng"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              options={roomTypes?.map((item) => {
                return { label: item.name, value: item.uuid };
              })}
              onChange={(value) => {
                const type = roomTypes.find((item) => item.uuid === value);
                console.log(type);
                const obj = {
                  number_of_bed: type.default_number_of_bed,
                  number_of_fridge: type.default_number_of_fridge,
                  number_of_ac: type.default_number_of_ac,
                  number_of_desk: type.default_number_of_desk,
                };
                formAdd.setFieldsValue(obj);
              }}
            />
          </Form.Item>

          <Form.Item
            name="number_of_bed"
            label="Số giường"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              min="0"
              step="1"
            />
          </Form.Item>
          <Form.Item
            name="number_of_fridge"
            label="Số tủ lạnh"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              min="0"
              step="1"
            />
          </Form.Item>
          <Form.Item
            name="number_of_ac"
            label="Số điều hòa"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              min="0"
              step="1"
            />
          </Form.Item>
          <Form.Item
            name="number_of_desk"
            label="Số bàn làm việc"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              min="0"
              step="1"
            />
          </Form.Item>
        </Form>
      </Modal>
    </RoomWrapper>
  );
};
const StatusLabel = ({ status }) => {
  let text, color;
  switch (status) {
    case "empty":
      text = "Trống";
      color = "green";
      break;
    case "occupied":
      text = "Có khách";
      color = "blue";
      break;
    default:
      text = "";
  }
  return <Tag color={color}>{text}</Tag>;
};
export default Rooms;
