import styled from "styled-components";
const AccountsManagementWrapper = styled.div`
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
`;
export const ButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export default AccountsManagementWrapper;
