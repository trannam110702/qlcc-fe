import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { statisticApi, roomApi, invoiceApi, serviceApi } from "../../../api/qlccApi";

import CombineStatisticsWrapper from "./style";
import { Table, Typography } from "antd";
import AntdSpin from "../../../components/Spin";
import { formatCurrency } from "../../../ultils";
const CombineStatistics = () => {
  const time = useOutletContext();
  const [data, setData] = useState(null);
  const [rooms, setRooms] = useState(null);
  const [columns, setColumns] = useState(null);
  const [services, setServices] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setData(null);
      const roomsData = await roomApi.getAll();
      const invoices = await statisticApi.getCombineStatistics(time);
      setRooms(
        roomsData.data.map((item) => {
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
  useEffect(() => {
    if (rooms) {
      const getServices = async () => {
        const servicesData = await serviceApi.getAll();
        const columnsTemp = [
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
            dataIndex: "room",
            key: "room",
            width: 100,
            sorter: (a, b) => {
              if (a.room < b.room) {
                return -1;
              }
              if (a.room > b.room) {
                return 1;
              }
              return 0;
            },
            defaultSortOrder: "ascend",
            filterSearch: true,
            filters: rooms.map((item) => {
              return { text: item.number, value: item.number };
            }),
            onFilter: (value, record) => {
              if (record.room) {
                return record.room.toString().startsWith(value);
              } else {
                return false;
              }
            },
          },
          {
            align: "center",
            title: "Tiền phòng",
            dataIndex: "rent_cost",
            key: "rent_cost",
            width: 100,
            render: (text, record) => {
              return formatCurrency(text);
            },
          },
        ];
        setServices(
          servicesData.data.map((item) => {
            return { ...item, key: item.uuid };
          })
        );
        setColumns([
          ...columnsTemp,
          ...servicesData.data.map((item) => {
            return {
              align: "center",
              title: item.name,
              dataIndex: item.uuid,
              key: item.uuid,
              width: 100,
              render: (text, record) => {
                const detail = record.detail.find((service) => service.service_id === item.uuid);
                return formatCurrency(detail.price * detail.used_amount);
              },
            };
          }),
        ]);
      };
      getServices();
    }
  }, [rooms]);
  return (
    <CombineStatisticsWrapper>
      {data && rooms && columns ? (
        <Table
          bordered
          className="main-table"
          columns={columns}
          pagination={false}
          dataSource={data}
          loading={!(data && rooms)}
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
                    <span style={{ fontWeight: "bold" }}>Tổng doanh thu</span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell colSpan={1} align="center">
                    <span style={{ fontWeight: "bold" }}>{formatCurrency(total)}</span>
                  </Table.Summary.Cell>
                  {services.map((service) => {
                    const service_total = data.reduce((total, item) => {
                      const detail = item.detail.find(
                        (service_detail) => service_detail.service_id === service.uuid
                      );
                      const one_invoice_service = detail.price * detail.used_amount;
                      return total + one_invoice_service;
                    }, 0);
                    return (
                      <Table.Summary.Cell colSpan={1} align="center" key={service.uuid}>
                        <span style={{ fontWeight: "bold" }}>{formatCurrency(service_total)}</span>
                      </Table.Summary.Cell>
                    );
                  })}
                </Table.Summary.Row>
              </>
            );
          }}
        />
      ) : (
        <AntdSpin />
      )}
    </CombineStatisticsWrapper>
  );
};

export default CombineStatistics;
