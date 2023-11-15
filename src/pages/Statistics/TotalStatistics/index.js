import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { statisticApi, roomApi, invoiceApi } from "../../../api/qlccApi";

import TotalStatisticsWrapper from "./style";
import { Table, Typography } from "antd";
import AntdSpin from "../../../components/Spin";
import { formatCurrency } from "../../../ultils";

const TotalStatistics = () => {
  const time = useOutletContext();
  const [rooms, setRooms] = useState(null);
  const [data, setData] = useState(null);
  useEffect(() => {
    const getData = async () => {
      setData([]);
      const invoices = await invoiceApi.getByTime(time);
      const rooms = await roomApi.getAll();
      setRooms(
        rooms.data.map((item) => {
          return { ...item, key: item.uuid };
        })
      );
      setData(
        invoices.data.map((item) => {
          return { ...item, key: item.uuid };
        })
      );
    };
    if (time) {
      getData();
    } else {
      setData([]);
    }
  }, [time]);
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
      title: "Phòng",
      dataIndex: "room_id",
      key: "room_id",
      width: 100,
      render: (text, record) => {
        return rooms.find((item) => item.uuid === record?.contract?.room_id).number;
      },
    },
    {
      align: "center",
      title: "Tiền phòng (VND)",
      dataIndex: "rent_cost",
      key: "rent_cost",
      width: 100,
      render: (text, record) => {
        return formatCurrency(text);
      },
    },
  ];
  return (
    <TotalStatisticsWrapper>
      {data && rooms ? (
        <Table
          bordered
          className="main-table"
          columns={columns}
          pagination={false}
          dataSource={data}
          scroll={{
            x: 600,
            y: window.innerHeight - 239,
          }}
          summary={(data) => {
            const total = data.reduce((total, item) => total + item.rent_cost, 0);
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={2} align="center">
                    <span style={{ fontWeight: "bold" }}>Tổng doanh thu tiền phòng</span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="center">
                    <span style={{ fontWeight: "bold" }}>{formatCurrency(total)}</span>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
      ) : (
        <AntdSpin />
      )}
    </TotalStatisticsWrapper>
  );
};

export default TotalStatistics;
