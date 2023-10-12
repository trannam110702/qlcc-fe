import styled from "styled-components";
const RoomWrapper = styled.div`
  padding: 0 1rem;
  height: 100%;
  nav {
    height: 64px;
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-size: 1rem;
      font-weight: bold;
    }
  }
  .ant-spin-nested-loading,
  .ant-spin-container {
    height: 100%;
  }
  .main-table {
    height: calc(100% - 64px);
  }
  /* .ant-table-header {
    height: 64px;
  } */
`;
export const ButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export default RoomWrapper;
