import React, { useState, useEffect } from "react";
import AccountsManagementWrapper, { ButtonWrapper } from "./style";
import { Table, Button, Modal, Form, Input } from "antd";
import IconButton from "../../components/IconButton";
import { accountApi, residentApi } from "../../api/qlccApi";

const AccountsManagement = () => {
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [account, setAccount] = useState(null);
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
      title: "Loại tài khoản",
      dataIndex: "type",
      key: "type",
      width: 150,
      defaultSortOrder: "ascend",
      sorter: (a, b) => {
        if (a.type < b.type) {
          return -1;
        }
        if (a.type > b.type) {
          return 1;
        }
        return 0;
      },
    },
    {
      title: "Tên tài khoản (username)",
      dataIndex: "username",
      key: "username",
      width: 100,
    },
    {
      title: "Mật khẩu (password)",
      dataIndex: "password",
      key: "password",
      width: 100,
    },
    {
      title: "Cư dân",
      dataIndex: "resident_id",
      key: "resident_id",
      width: 100,
      render: (value, record) => {
        if (record.type === "admin") return "";
        const resident = residents?.find((item) => item.uuid === value);
        return `${resident?.last_name} ${resident?.first_name}`;
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
                editForm.setFieldValue("password", "");
                setEditModal(true);
              }}
            />
            {record.type !== "admin" && (
              <IconButton
                type="delete"
                onclick={() => {
                  setCurrentRecord(record);
                  setDeleteModal(true);
                }}
              />
            )}
          </ButtonWrapper>
        );
      },
      width: 100,
    },
  ];
  const getData = async () => {
    try {
      const accounts = await accountApi.getAll();
      const residents = await residentApi.getAll();
      setResidents(
        residents.data.map((item) => {
          return { ...item, key: item.uuid };
        })
      );
      setAccount(
        accounts.data.map((item) => {
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
    <AccountsManagementWrapper>
      <nav>
        <div className="title">Danh sách tài khoản hệ thống</div>
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
        dataSource={account}
        loading={loading}
        scroll={{
          x: 960,
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
            await accountApi.delete(currentRecord.key);
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
            await accountApi.updatePassword(
              editForm.getFieldValue("username"),
              editForm.getFieldValue("password")
            );
          } catch (error) {
          } finally {
            editForm.setFieldValue("confirm", "");
            await getData();
          }
        }}
        onCancel={() => {
          setEditModal(false);
          editForm.setFieldValue("confirm", "");
          setCurrentRecord(null);
        }}
      >
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} form={editForm}>
          <Form.Item
            name="type"
            label="Loại tài khoản"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="username"
            label="Tài khoản"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu mới"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Xác nhận mật khẩu"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </AccountsManagementWrapper>
  );
};
export default AccountsManagement;
