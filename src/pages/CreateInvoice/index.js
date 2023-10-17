import React, { useState, useEffect, useContext, createContext } from "react";
import { Button, Steps, Form, Input, DatePicker, Transfer } from "antd";
import CreateInvoiceWrapper, {
  ContentWrapper,
  InvoiceConfigWrapper,
} from "./style";
import AntdSpin from "../../components/Spin";
import dayjs from "dayjs";
import {
  serviceApi,
  contractApi,
  roomApi,
  invoiceApi,
} from "../../api/qlccApi";

const InvoiceConfigContext = createContext();

const CreateInvoice = () => {
  const [current, setCurrent] = useState(0);
  const [invoiceConfig, setInvoiceConfig] = useState({});
  const steps = [
    {
      title: "Tạo hóa đơn",
      content: <InvoiceConfig />,
    },
    {
      title: "Chọn hợp đồng ",
      content: <Contracts />,
    },
    {
      title: "Hoàn tất",
      content: <Confirm />,
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  return (
    <InvoiceConfigContext.Provider
      value={{
        invoiceConfig,
        setInvoiceConfig,
        current,
        setCurrent,
        stepLength: steps.length,
      }}
    >
      <CreateInvoiceWrapper>
        <Steps
          current={current}
          items={items}
          style={{ padding: "1rem", maxHeight: "64px", overflow: "hidden" }}
        />
        <ContentWrapper>{steps[current].content}</ContentWrapper>
      </CreateInvoiceWrapper>
    </InvoiceConfigContext.Provider>
  );
};
const InvoiceConfig = () => {
  const [form] = Form.useForm();
  const [services, setServices] = useState(null);
  const { invoiceConfig, setInvoiceConfig, setCurrent, current } =
    useContext(InvoiceConfigContext);
  const getService = async () => {
    try {
      const service = await serviceApi.getAll();
      setServices(service.data);
    } catch (error) {}
  };
  useEffect(() => {
    Promise.all([getService()]);
    form.setFieldsValue(invoiceConfig);
  }, []);

  return (
    <InvoiceConfigWrapper>
      {services ? (
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          <Form.Item
            name="time"
            label="Thời gian"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker
              picker="month"
              placeholder="Chọn tháng"
              format="MM-YYYY"
              onChange={(value) => {
                if (value) {
                  form.setFieldValue(
                    "name",
                    `Hóa đơn tháng ${dayjs(value).format("MM - YYYY")}`
                  );
                } else {
                  form.setFieldValue("name", "");
                }
              }}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên tập hóa đơn"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item
            name="service"
            label="Dịch vụ tính phí"
            valuePropName="checked"
          >
            <Checkbox.Group
              options={services.map((item) => {
                return { label: item.name, value: item.uuid };
              })}
              defaultValue={invoiceConfig?.service ? invoiceConfig.service : []}
            />
          </Form.Item> */}
        </Form>
      ) : (
        <AntdSpin />
      )}
      <Button
        style={{ float: "right" }}
        type="primary"
        onClick={async () => {
          try {
            await form.validateFields();
            setInvoiceConfig((prev) => {
              return { ...prev, ...form.getFieldsValue() };
            });
            setCurrent(current + 1);
          } catch (error) {}
        }}
      >
        Tiếp
      </Button>
    </InvoiceConfigWrapper>
  );
};
const Contracts = () => {
  const { invoiceConfig, setInvoiceConfig, setCurrent, current } =
    useContext(InvoiceConfigContext);
  const [contracts, setContracts] = useState(null);
  const [targetContracts, setTargetContracts] = useState(
    invoiceConfig.targetContracts ? invoiceConfig.targetContracts : []
  );
  const [rooms, setRooms] = useState(null);
  const getContract = async () => {
    try {
      const contract = await contractApi.getByStatus("true");
      setContracts(contract.data);
    } catch (error) {}
  };
  const getRoom = async () => {
    try {
      const rooms = await roomApi.getAll();
      setRooms(rooms.data);
    } catch (error) {}
  };
  useEffect(() => {
    Promise.all([getContract(), getRoom()]);
  }, []);
  const getSource = () => {
    const contractsSource = contracts.map((item) => {
      const room = rooms.find((room) => room.uuid === item.room_id);
      return { key: item.uuid, title: `${room.number}` };
    });
    return contractsSource;
  };
  return (
    <InvoiceConfigWrapper>
      {contracts && rooms ? (
        <Transfer
          dataSource={getSource()}
          targetKeys={targetContracts}
          onChange={(keys) => {
            setTargetContracts(keys);
          }}
          showSearch
          style={{ justifyContent: "center" }}
          render={(item) => item.title}
        />
      ) : (
        <AntdSpin />
      )}
      <div style={{ float: "right" }}>
        <Button
          disabled={current === 0}
          style={{
            margin: "0 8px",
          }}
          onClick={() => {
            setCurrent(current - 1);
            setInvoiceConfig((prev) => {
              console.log(prev);
              return { ...prev, targetContracts };
            });
          }}
        >
          Trước
        </Button>
        <Button
          type="primary"
          onClick={async () => {
            try {
              if (!targetContracts) throw new Error("Thiếu hợp đồng");
              setInvoiceConfig((prev) => {
                return { ...prev, targetContracts };
              });
              setCurrent(current + 1);
            } catch (error) {}
          }}
        >
          Tiếp
        </Button>
      </div>
    </InvoiceConfigWrapper>
  );
};
const Confirm = () => {
  const { invoiceConfig, setCurrent, current, stepLength } =
    useContext(InvoiceConfigContext);

  return (
    <>
      <div style={{ float: "right" }}>
        <Button
          disabled={current === 0}
          style={{
            margin: "0 8px",
          }}
          onClick={() => setCurrent(current - 1)}
        >
          Trước
        </Button>
        {current === stepLength - 1 && (
          <Button
            type="primary"
            onClick={async () => {
              const res = await invoiceApi.createInvoices({
                ...invoiceConfig,
                time: invoiceConfig.time.format("MM-YYYY"),
              });
              console.log(res);
            }}
          >
            Hoàn tất
          </Button>
        )}
      </div>
    </>
  );
};
export default CreateInvoice;
