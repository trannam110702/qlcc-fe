import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  Input,
  Typography,
} from "antd";

import FeedbackWrapper, { ButtonWrapper } from "./style";
import IconButton from "../../components/IconButton";
import FeedbackStatusLabel from "../../components/FeedbackStatusLabel";
import { AuthContext } from "../../hooks/useAuth";
import { MessageContext } from "../../store/MessageContext";
import { feedbackApi, residentApi, roomApi } from "../../api/qlccApi";
import AntdSpin from "../../components/Spin";
import dayjs from "dayjs";

const FeedbackManager = () => {
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState(null);
  const [rooms, setRooms] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const getData = async () => {
    try {
      let res = await feedbackApi.getAll();
      res.data = await Promise.all(
        res.data.map(async (item) => {
          const resident = (await residentApi.getById(item.resident_id)).data;
          return {
            ...item,
            resident_name: `${resident.last_name} ${resident.first_name}`,
            room: resident.room_id,
          };
        })
      );
      const rooms = await roomApi.getAll();
      setRooms(
        rooms.data.map((item) => {
          return { ...item, key: item.uuid };
        })
      );
      setFeedbacks(
        res.data.map((item) => {
          return { ...item, key: item.uuid };
        })
      );
    } catch (error) {}
  };
  useEffect(() => {
    getData().then(setLoading(false));
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
      title: "Ngày tạo",
      dataIndex: "create_time",
      key: "create_time",
      width: 100,
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Người gửi",
      dataIndex: "resident_name",
      key: "resident_name",
      width: 100,
    },
    {
      title: "Phòng",
      dataIndex: "room",
      key: "room",
      width: 100,
      render: (text) => rooms?.find((item) => item.uuid === text).number,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 100,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      width: 200,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 200,
      filters: [
        { text: "Chưa xử lý", value: "pending" },
        { text: "Đã xử lý", value: "fulfill" },
      ],
      onFilter: (value, record) => record.status.startsWith(value),
      render: (text) => <FeedbackStatusLabel status={text} />,
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      render: (text, record, index) => {
        return (
          <ButtonWrapper>
            <IconButton
              type="delete"
              onclick={() => {
                setCurrentRecord(record);
                setDeleteModal(true);
              }}
            />
            {record.status === "pending" && (
              <IconButton
                type="confirm"
                onclick={async () => {
                  setLoading(true);
                  try {
                    await feedbackApi.updateStatus(record.uuid, "fulfill");
                    await getData();
                  } catch (error) {
                  } finally {
                    setLoading(false);
                  }
                }}
              />
            )}
          </ButtonWrapper>
        );
      },
      width: 50,
    },
  ];
  return (
    <FeedbackWrapper>
      <nav>
        <div className="title">Danh sách phản hồi của cư dân</div>
      </nav>
      {!loading && rooms ? (
        <Table
          bordered
          className="main-table"
          columns={columns}
          pagination={false}
          dataSource={feedbacks}
          loading={!feedbacks}
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
            await feedbackApi.deleteFeedback(currentRecord.key);
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
    </FeedbackWrapper>
  );
};
export default FeedbackManager;
