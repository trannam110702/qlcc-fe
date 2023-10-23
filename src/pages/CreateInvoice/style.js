import styled from "styled-components";
const CreateInvoiceWrapper = styled.div`
  margin: 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: 10px;
  height: calc(100% - 2rem);
  position: relative;
  .title {
    font-size: 1rem;
    font-weight: 700;
    text-align: center;
    margin-top: 1rem;
  }
`;
export const ContentWrapper = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  height: calc(100% - 64px - 1rem);
  overflow-y: auto;
`;
export const ControlButtons = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  button {
    height: 2rem;
  }
`;
export const ButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
export const InvoiceConfigWrapper = styled.div``;
export default CreateInvoiceWrapper;
