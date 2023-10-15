import React, { useState, useEffect } from "react";
import InvoiceWrapper, { ButtonWrapper } from "./style";
import { Table, Button, Modal, Form, InputNumber, Input, Tag } from "antd";
import IconButton from "../../components/IconButton";
import { formatCurrency } from "../../ultils";
import { serviceApi } from "../../api/qlccApi";

const Invoice = () => {
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();

  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
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
      title: "Giá (VND)",
      dataIndex: "price",
      key: "price",
      width: 100,
      sorter: (a, b) => {
        if (a.price < b.price) {
          return -1;
        }
        if (a.price > b.price) {
          return 1;
        }
        return 0;
      },
      render: (text, record) => {
        return formatCurrency(record.price);
      },
    },
    {
      title: "Đơn vị tính",
      dataIndex: "unit",
      key: "unit",
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
                editForm.setFieldsValue(record);
                setEditModal(true);
              }}
            />
            {/* <IconButton
              type="delete"
              onclick={() => {
                setCurrentRecord(record);
                setDeleteModal(true);
              }}
            /> */}
          </ButtonWrapper>
        );
      },
      width: 100,
    },
  ];
  const getData = async () => {
    try {
      const res = await serviceApi.getAll();
      setRoom(
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
    addForm.resetFields();
  }, [addModal]);
  return (
    <InvoiceWrapper>
      <nav>
        <div className="title">Hóa đơn</div>
        <Button
          disabled
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
        loading={loading}
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
            await serviceApi.delete(currentRecord.key);
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
            await editForm.validateFields();
            setLoading(true);
            setEditModal(false);
            await serviceApi.updateById(
              currentRecord.key,
              editForm.getFieldsValue()
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
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} form={editForm}>
          <Form.Item
            name="name"
            label="Tên dịch vụ"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá (VND)"
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
            name="unit"
            label="Đơn vị tính"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Thêm mới dịch vụ"
        width={800}
        open={addModal}
        onOk={async () => {
          try {
            await addForm.validateFields();
            setLoading(true);
            setAddModal(false);
            await serviceApi.add(addForm.getFieldsValue());
          } catch (error) {
          } finally {
            getData();
          }
        }}
        onCancel={() => {
          setAddModal(false);
        }}
      >
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} form={addForm}>
          <Form.Item
            name="name"
            label="Tên dịch vụ"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá (VND)"
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
            name="unit"
            label="Đơn vị tính"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </InvoiceWrapper>
  );
};
export default Invoice;
