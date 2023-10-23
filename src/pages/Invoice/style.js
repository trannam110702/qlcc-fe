import styled from "styled-components";
const InvoiceWrapper = styled.div`
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
      gap: 0.5rem;
    }
  }
  height: 100%;
  .main-table,
  .ant-spin-nested-loading,
  .ant-spin-container {
    height: 100%;
  }
`;
export const ButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
export const InvoiceDetailWrapper = styled.div`
  padding: 2rem;
  font-size: 1rem;
  .invoice-title {
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
  }
  .sub-title {
    font-size: 1rem;
    font-weight: 700;
  }
  .item {
    .title {
      font-weight: 700;
    }
  }
  .room {
    text-align: center;
    margin-bottom: 1rem;
  }
  .total {
    text-align: end;
    font-size: 1rem;
    font-weight: 700;
    margin: 1rem 0;
    color: red;
  }
`;
export default InvoiceWrapper;
