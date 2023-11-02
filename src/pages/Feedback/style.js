import styled from "styled-components";
const FeedbackWrapper = styled.div`
  margin: 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: 10px;
  height: calc(100% - 2rem);
  position: relative;
  .title {
    margin-top: 2rem;
    text-align: center;
  }
`;
export const ButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
export default FeedbackWrapper;
