import React, { useState, useEffect } from "react";
import BackupWrapper, { ButtonWrapper } from "./style";
import { Table, Button, Modal, Form, Input, DatePicker } from "antd";
import IconButton from "../../components/IconButton";
import { accountApi, residentApi } from "../../api/qlccApi";
import dayjs from "dayjs";
const Backup = () => {
  const [addForm] = Form.useForm();
  const [deleteModal, setDeleteModal] = useState(false);
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
              type="add"
              onclick={() => {
                setCurrentRecord(record);
                addForm.setFieldsValue(record);
                addForm.setFieldValue("password", "");
                setAddModal(true);
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
    <BackupWrapper>
      <nav>
        <div className="title">Danh sách bản ghi backup hệ thống</div>
        <Button
          type="primary"
          onClick={() => {
            setAddModal(true);
          }}
        >
          + Tạo mới
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
        title="Tạo"
        width={800}
        open={addModal}
        onOk={async () => {
          try {
            await addForm.validateFields();
            setLoading(true);
            setAddModal(false);
            await accountApi.updatePassword(
              addForm.getFieldValue("username"),
              addForm.getFieldValue("password")
            );
          } catch (error) {
          } finally {
            addForm.setFieldValue("confirm", "");
            await getData();
          }
        }}
        onCancel={() => {
          setAddModal(false);
          addForm.setFieldValue("confirm", "");
          setCurrentRecord(null);
        }}
      >
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} form={addForm}>
          <Form.Item
            name="name"
            label="Tên bản backup"
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
            label="Ngày tạo"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập ngày",
              },
            ]}
          >
            <DatePicker
              disabled
              placeholder="Chọn ngày"
              format="DD-MM-YYYY"
              defaultValue={dayjs()}
            />
          </Form.Item>
        </Form>
      </Modal>
    </BackupWrapper>
  );
};

export default Backup;
