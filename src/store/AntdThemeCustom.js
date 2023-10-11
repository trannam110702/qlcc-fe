import { ConfigProvider, theme } from "antd";
const color = {
  sider: "#fafffe",
  siderTrigger: "#2f9382",
};
const AntdThemeCustom = ({ children }) => {
  const themeCustom = {
    algorithm: theme.defaultAlgorithm,
    token: {
      colorPrimary: "#00474f",
    },
    components: {
      Layout: {
        headerBg: "#002329",
        siderBg: color.sider,
        triggerBg: color.siderTrigger,
      },
      Menu: {
        itemBg: color.sider,
        itemActiveBg: "#a7e3df",
        itemSelectedBg: "#84e1db",
      },
      Table: {
        headerBg: "#d8ebea",
        headerSortActiveBg: "#d8ebea",
      },
    },
  };
  return <ConfigProvider theme={themeCustom}>{children}</ConfigProvider>;
};
export default AntdThemeCustom;
