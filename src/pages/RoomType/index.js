import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "antd";
import { formatCurrency } from "../../ultils";
import IconButton from "../../components/IconButton";
import RoomTypeWrapper, { ButtonWrapper } from "./style";

import { roomTypeApi } from "../../api/qlccApi";

const RoomType = () => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [roomTypes, setRoomTypes] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleOk = async () => {
    try {
      setLoading(true);
      setDeleteModal(false);
      await roomTypeApi.delete(currentRecord.key);
    } catch (error) {
    } finally {
      getData();
    }
  };
  const handleCancel = () => {
    setDeleteModal(false);
  };
  const columns = [
    {
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
    },
    {
      title: "Diện tích",
      dataIndex: "area",
      key: "area",
      width: 100,
    },
    {
      title: "Giá thuê mặc định (vnd)",
      dataIndex: "default_rent_cost",
      key: "default_rent_cost",
      width: 150,
      render: (text, record) => {
        return formatCurrency(record.default_rent_cost);
      },
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
            <IconButton type="edit" />
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
  return (
    <RoomTypeWrapper>
      <Table
        className="main-table"
        columns={columns}
        pagination={false}
        dataSource={roomTypes}
        loading={loading}
        scroll={{
          x: 500,
          y: window.innerHeight - 129,
        }}
      />
      <Modal
        title="Xác nhận xóa"
        open={deleteModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Bạn có chắc muốn xóa bản ghi này?</p>
      </Modal>
    </RoomTypeWrapper>
  );
};
export default RoomType;
