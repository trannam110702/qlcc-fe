import styled from "styled-components";
const LayoutWrapper = styled.div`
  .main-layout {
    height: 100vh;
    overflow: hidden;
    .header {
      padding: 0.5rem 1rem;
      display: flex;
      justify-content: space-between;
      color: #fff;
      .logo {
        height: 48px;
      }
      .nav {
        display: flex;
        align-items: center;
        .account {
          padding: 0.8rem;
          border-radius: 50%;
          font-size: 16px;
          line-height: 1;
          background-color: gray;
          cursor: pointer;
          position: relative;
          .dropdown {
            display: none;
            position: absolute;
            right: 0;
            top: calc(100% + 12px);
            background-color: gray;
            padding: 1rem;
            cursor: default;
            border-radius: 10px;
            z-index: 10;
            ul {
              li {
                width: 180px;
                padding: 0.5rem 0.8rem;
                border-radius: 10px;
                line-height: 1.4rem;
                cursor: pointer;
              }
              li:hover {
                background-color: #001529;
              }
              .logout {
                display: flex;
                .logout-spin {
                  margin-left: 10px;
                }
              }
            }
          }
          .dropdown::before {
            content: "";
            display: block;
            background-color: transparent;
            position: absolute;
            top: -30px;
            left: 0;
            width: 100%;
            height: 30px;
          }
        }
        .account:hover .dropdown {
          display: block;
        }
      }
    }
    .content {
      height: calc(100vh - 64px);
    }
  }
`;
export default LayoutWrapper;
