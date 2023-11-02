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
  .ant-table-header {
    max-height: 64px;
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
    color: red;
  }
  .date {
    text-align: end;
    font-weight: 700;
  }
  .signatrue {
    text-align: end;
  }
  .cal-total {
    margin: 1rem;
  }
  .pay-btn {
    margin-left: 1rem;
  }
`;
export const PaymentWrapper = styled.div`
  padding-top: 1rem;
  .main {
    display: flex;
    img {
      width: 50%;
      height: auto;
    }
    .info {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      .title {
        font-weight: 700;
      }
      .row div {
        font-size: 1rem;
        align-self: center;
      }
    }
  }
  @media only screen and (max-width: 900px) {
    .main {
      flex-direction: column;
      img,
      .info {
        width: 100%;
      }
    }
  }
`;
export default InvoiceWrapper;
