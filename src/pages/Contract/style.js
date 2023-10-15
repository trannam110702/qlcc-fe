import styled from "styled-components";
const ContractWrapper = styled.div`
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
  }
  height: 100%;
  .main-table,
  .ant-spin-nested-loading,
  .ant-spin-container {
    height: 100%;
  }
  .list-resident {
    display: flex;
    justify-content: center;
  }
  td ~ button[aria-checked="true"] {
    background-color: red;
  }
`;
export const ButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export default ContractWrapper;
