import styled from "styled-components";
const PurchaseWrapper = styled.div`
  padding: 0 1rem;
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
    .right {
      display: flex;
      align-items: center;
      gap: 1rem;
      .select {
        width: 150px;
      }
    }
  }
  height: 100%;
  .main-table,
  .ant-spin-nested-loading,
  .ant-spin-container {
    height: 100%;
  }
  .ant-table-header {
    max-height: 64px;
  }
`;
export const ButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
export default PurchaseWrapper;
