import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, InputNumber, Input } from "antd";
import { formatCurrency } from "../../ultils";
import IconButton from "../../components/IconButton";
import RoomTypeWrapper, { ButtonWrapper } from "./style";

import { roomTypeApi } from "../../api/qlccApi";

const RoomType = () => {
  const [form] = Form.useForm();
  const [formAdd] = Form.useForm();
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [roomTypes, setRoomTypes] = useState(null);
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
      title: "Tên loại phòng",
      dataIndex: "name",
      key: "name",
      width: 200,
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
      title: "Diện tích",
      dataIndex: "area",
      key: "area",
      width: 100,
      sorter: (a, b) => a.area - b.area,
    },
    {
      title: "Giá thuê mặc định (vnd)",
      dataIndex: "default_rent_cost",
      key: "default_rent_cost",
      width: 150,
      defaultSortOrder: "descend",
      render: (text, record) => {
        return formatCurrency(record.default_rent_cost);
      },
      sorter: (a, b) => a.default_rent_cost - b.default_rent_cost,
    },
    {
      title: "Số giường mặc định",
      dataIndex: "default_number_of_bed",
      key: "default_number_of_bed",
      width: 100,
    },
    {
      title: "Số tủ lạnh mặc định",
      dataIndex: "default_number_of_fridge",
      key: "default_number_of_fridge",
      width: 100,
    },
    {
      title: "Số điều hòa mặc định",
      dataIndex: "default_number_of_ac",
      key: "default_number_of_ac",
      width: 100,
    },
    {
      title: "Số bàn làm việc mặc định",
      dataIndex: "default_number_of_desk",
      key: "default_number_of_desk",
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
  const getData = async () => {
    try {
      const res = await roomTypeApi.getAll();
      setRoomTypes(
        res.data.map((item) => {
          return { ...item, key: item.uuid };
        })
      );
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    formAdd.resetFields();
  }, [addModal]);
  return (
    <RoomTypeWrapper>
      <nav>
        <div className="title">Danh sách loại phòng</div>
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
        dataSource={roomTypes}
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
            await roomTypeApi.delete(currentRecord.key);
          } catch (error) {
          } finally {
            getData();
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
            await roomTypeApi.updateById(
              currentRecord.key,
              form.getFieldsValue()
            );
          } catch (error) {
          } finally {
            getData();
          }
        }}
        onCancel={() => {
          setEditModal(false);
          setCurrentRecord(null);
        }}
      >
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} form={form}>
          <Form.Item
            name="name"
            label="Tên loại phòng"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="area"
            label="Diện tích (m2)"
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
              step="0.5"
            />
          </Form.Item>
          <Form.Item
            name="default_rent_cost"
            label="Giá thuê mặc định (vnd)"
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
              formatter={formatCurrency}
            />
          </Form.Item>
          <Form.Item
            name="default_number_of_ac"
            label="Số điều hòa mặc định"
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
            name="default_number_of_bed"
            label="Số giường mặc định"
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
            name="default_number_of_desk"
            label="Số bàn làm việc mặc định"
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
            name="default_number_of_fridge"
            label="Số tủ lạnh mặc định"
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
        title="Thêm mới loại phòng"
        width={800}
        open={addModal}
        onOk={async () => {
          try {
            await formAdd.validateFields();
            setLoading(true);
            setAddModal(false);
            await roomTypeApi.add(formAdd.getFieldsValue());
          } catch (error) {
          } finally {
            getData();
          }
        }}
        onCancel={() => {
          setAddModal(false);
        }}
      >
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} form={formAdd}>
          <Form.Item
            name="name"
            label="Tên loại phòng"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="area"
            label="Diện tích (m2)"
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
              step="0.5"
            />
          </Form.Item>
          <Form.Item
            name="default_rent_cost"
            label="Giá thuê mặc định (vnd)"
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
              formatter={formatCurrency}
            />
          </Form.Item>
          <Form.Item
            name="default_number_of_ac"
            label="Số điều hòa mặc định"
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
            name="default_number_of_bed"
            label="Số giường mặc định"
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
            name="default_number_of_desk"
            label="Số bàn làm việc mặc định"
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
            name="default_number_of_fridge"
            label="Số tủ lạnh mặc định"
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
    </RoomTypeWrapper>
  );
};
export default RoomType;
