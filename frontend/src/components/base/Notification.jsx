import styled from "styled-components";

const Notification = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.white};
  padding: 16px 32px;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 2px 12px rgba(157, 113, 75, 0.15);
  font-size: 1.1rem;
  z-index: 1000;
  min-width: 200px;
  text-align: center;
`;

export default Notification;