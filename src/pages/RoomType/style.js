import styled from "styled-components";
const RoomTypeWrapper = styled.div`
  nav {
    height: 64px;
    padding: 0.5rem;
    display: flex;
    justify-content: end;
    align-items: center;
  }
  height: 100%;
  .main-table,
  .ant-spin-nested-loading,
  .ant-spin-container {
    height: 100%;
  }
  .ant-table-header {
    height: 64px;
  }
`;
export const ButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
export default RoomTypeWrapper;