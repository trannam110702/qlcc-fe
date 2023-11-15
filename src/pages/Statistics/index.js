import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { DatePicker, Menu } from "antd";
import StatisticsWrapper from "./style";
import dayjs from "dayjs";
const items = [
  {
    label: <Link to="/statistics/combine">Báo cáo tổng hợp</Link>,
    key: "combine",
  },
  {
    label: <Link to="/statistics/room">Doanh thu tiền phòng</Link>,
    key: "room",
  },
  {
    label: <Link to="/statistics/service">Doanh thu dịch vụ</Link>,
    key: "service",
  },
];
const Statistics = () => {
  const [time, setTime] = useState({
    month: Number(dayjs().format("MM")),
    year: Number(dayjs().format("YYYY")),
  });
  const [current, setCurrent] = useState("combine");
  return (
    <StatisticsWrapper>
      <nav>
        <div className="title">Báo cáo & thống kê</div>
        <div className="right">
          <DatePicker
            defaultValue={dayjs()}
            placement="bottomRight"
            picker="month"
            placeholder="Chọn tháng"
            format="MM-YYYY"
            onChange={(value) => {
              if (value) {
                const month = Number(dayjs(value).format("MM"));
                const year = Number(dayjs(value).format("YYYY"));
                setTime({ month, year });
              } else {
                setTime(null);
              }
            }}
          />
        </div>
      </nav>
      <Menu
        onClick={(e) => {
          setCurrent(e.key);
        }}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
      />
      <Outlet context={time} />
    </StatisticsWrapper>
  );
};

export default Statistics;
