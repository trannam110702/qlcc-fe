import React, { useEffect, useState } from "react";
import TotalServiceWrapper from "./style";
import { Table, Typography } from "antd";
import AntdSpin from "../../../components/Spin";
import { formatCurrency } from "../../../ultils";
import { statisticApi } from "../../../api/qlccApi";
import { useOutletContext } from "react-router-dom";
const ServiceStatistics = () => {
  const time = useOutletContext();
  const [data, setData] = useState(null);
  useEffect(() => {
    const getData = async () => {
      const data = await statisticApi.getTotalService(time);
      setData(
        data.data.map((item) => {
          return { ...item, key: item.uuid };
        })
      );
      console.log(data.data);
    };
    if (time) {
      setData(null);
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
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
      width: 100,
    },
    {
      align: "center",
      title: "Tổng lượng sử dụng",
      dataIndex: "used_amount",
      key: "used_amount",
      width: 100,
    },
    {
      align: "center",
      title: "Doanh thu",
      dataIndex: "total_service",
      key: "total_service",
      width: 100,
      render: (text) => formatCurrency(text),
    },
  ];
  return (
    <TotalServiceWrapper>
      {data ? (
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
            const total = data.reduce(
              (total, item) => total + item.total_service,
              0
            );
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3} align="center">
                    <span style={{ fontWeight: "bold" }}>
                      Tổng doanh thu dịch vụ
                    </span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="center">
                    <span style={{ fontWeight: "bold" }}>
                      {formatCurrency(total)}
                    </span>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
      ) : (
        <AntdSpin />
      )}
    </TotalServiceWrapper>
  );
};

export default ServiceStatistics;
