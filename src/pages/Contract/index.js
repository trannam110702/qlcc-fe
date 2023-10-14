import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import ContractWrapper, { ButtonWrapper } from "./style";
import {
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  Input,
  DatePicker,
  Select,
  Space,
  Divider,
} from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import IconButton from "../../components/IconButton";
import { formatCurrency } from "../../ultils";
import {
  contractApi,
  roomApi,
  roomTypeApi,
  residentApi,
} from "../../api/qlccApi";

const ServicePrice = () => {
  const { RangePicker } = DatePicker;
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();

  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [contracts, setContracts] = useState(null);
  const [rooms, setRooms] = useState(null);
  const [emptyRooms, setEmptyRooms] = useState(null);
  const [roomTypes, setRoomTypes] = useState(null);
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
      title: "Phòng số",
      dataIndex: "room_id",
      key: "room_id",
      width: 100,
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        if (a.room_id < b.room_id) {
          return -1;
        }
        if (a.room_id > b.room_id) {
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
        return `${resident?.first_name} ${resident?.last_name}`;
      },
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
                editForm.setFieldValue("time_range", [
                  dayjs(record.from_date),
                  dayjs(record.to_date),
                ]);
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
      const res = await contractApi.getAll();
      setContracts(
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
  const getResidents = async () => {
    try {
      const res = await residentApi.getAll();
      setResidents(
        res.data.map((item) => {
          return { ...item, key: item.uuid };
        })
      );
    } catch (error) {}
  };
  const getRoomTypes = async () => {
    try {
      const res = await roomTypeApi.getAll();
      setRoomTypes(
        res.data.map((item) => {
          return { ...item, key: item.uuid };
        })
      );
    } catch (error) {}
  };
  const getEmptyRooms = async () => {
    try {
      const res = await roomApi.getRoomsByStatus("empty");
      setEmptyRooms(res.data);
    } catch (error) {}
  };
  useEffect(() => {
    Promise.all([
      getData(),
      getRooms(),
      getResidents(),
      getRoomTypes(),
      getEmptyRooms(),
    ]).then(() => {
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    addForm.resetFields();
  }, [addModal]);

  return (
    <ContractWrapper>
      <nav>
        <div className="title">Danh sách hợp đồng</div>
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
        dataSource={contracts}
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
            await contractApi.delete(currentRecord.key);
          } catch (error) {
          } finally {
            await getData();
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
            await editForm.validateFields();
            setLoading(true);
            let data = editForm.getFieldsValue();
            data = {
              ...data,
              from_date: data.time_range[0].format("YYYY-MM-DD"),
              to_date: data.time_range[1].format("YYYY-MM-DD"),
            };
            delete data.time_range;
            setEditModal(false);
            await contractApi.updateById(currentRecord.uuid, data);
          } catch (error) {
          } finally {
            await getData();
            setLoading(false);
          }
        }}
        onCancel={() => {
          setEditModal(false);
          setCurrentRecord(null);
        }}
      >
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} form={editForm}>
          <Form.Item
            name="room_id"
            label="Phòng"
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
              onChange={(value) => {
                const typeId = rooms.find(
                  (item) => item.uuid === value
                ).type_id;
                editForm.setFieldValue(
                  "rent_cost_per_month",
                  roomTypes.find((item) => item.uuid === typeId)
                    .default_rent_cost
                );
              }}
            />
          </Form.Item>

          <Form.Item
            name="signer"
            label="Người thuê"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              disabled
              options={residents?.map((item) => {
                return {
                  label: `${item.last_name} ${item.first_name} (${item.citizen_id})`,
                  value: item.uuid,
                };
              })}
            />
          </Form.Item>
          <Form.Item
            name="time_range"
            label="Thời gian thuê"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <RangePicker disabled placeholder={["Bắt đầu", "Kết thúc"]} />
          </Form.Item>
          <Form.Item
            name="rent_cost_per_month"
            label="Giá cho thuê (VND)"
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
        </Form>
      </Modal>
      <Modal
        title="Thêm mới hợp đồng"
        width={800}
        open={addModal}
        onOk={async () => {
          try {
            await addForm.validateFields();
            setLoading(true);
            let data = addForm.getFieldsValue();
            data = {
              ...data,
              from_date: data.time_range[0].format("YYYY-MM-DD"),
              to_date: data.time_range[1].format("YYYY-MM-DD"),
            };
            delete data.time_range;
            setAddModal(false);
            await contractApi.add(data);
          } catch (error) {
          } finally {
            await getData();
            setLoading(false);
          }
        }}
        onCancel={() => {
          setAddModal(false);
        }}
      >
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} form={addForm}>
          <Form.Item
            name="room_id"
            label="Phòng (trống)"
            rules={[
              {
                required: true,
              },
            ]}
          >
            {emptyRooms && (
              <Select
                options={rooms
                  ?.filter((item) => {
                    return emptyRooms.includes(item.uuid);
                  })
                  ?.map((item) => {
                    return { label: item.number, value: item.uuid };
                  })}
                onChange={(value) => {
                  const typeId = rooms.find(
                    (item) => item.uuid === value
                  ).type_id;

                  addForm.setFieldValue(
                    "rent_cost_per_month",
                    roomTypes.find((item) => item.uuid === typeId)
                      .default_rent_cost
                  );
                }}
              />
            )}
          </Form.Item>

          <Form.Item
            name="signer"
            label="Người thuê (cư dân chưa có phòng)"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              options={residents
                ?.filter((item) => !item.room_id)
                .map((item) => {
                  return {
                    label: `${item.last_name} ${item.first_name} (${item.citizen_id})`,
                    value: item.uuid,
                  };
                })}
            />
          </Form.Item>
          <Form.Item
            name="time_range"
            label="Thời gian thuê"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <RangePicker placeholder={["Bắt đầu", "Kết thúc"]} />
          </Form.Item>
          <Form.Item
            name="rent_cost_per_month"
            label="Giá cho thuê (VND)"
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
          <Form.Item label="Thêm cư dân">
            <Form.List name="resident_list">
              {(fields, operation) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 16,
                  }}
                >
                  {fields.map((field) => (
                    <div
                      key={field.key}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Form.Item
                        style={{ flex: "1 0 auto" }}
                        name={[field.name, "resident_id"]}
                      >
                        <Select
                          options={residents
                            ?.filter((item) => !item.room_id)
                            .map((item) => {
                              return {
                                label: `${item.last_name} ${item.first_name} (${item.citizen_id})`,
                                value: item.uuid,
                              };
                            })}
                        />
                      </Form.Item>

                      <CloseOutlined
                        style={{ marginBottom: "24px", marginLeft: "12px" }}
                        onClick={() => {
                          operation.remove(field.name);
                        }}
                      />
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => {
                      operation.add();
                    }}
                    block
                  >
                    + Thêm cư dân
                  </Button>
                </div>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      </Modal>
    </ContractWrapper>
  );
};
export default ServicePrice;
