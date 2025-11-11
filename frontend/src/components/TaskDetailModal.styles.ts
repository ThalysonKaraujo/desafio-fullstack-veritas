import { styled } from 'styled-components';

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
`;

export const Modal = styled.div`
  width: 520px;
  max-width: 92vw;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 22px 48px rgba(2, 6, 23, 0.2);
  z-index: 2001;
  font-family: inherit;
  color: #111827;

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 20px;
  color: #111827;
  line-height: 1.1;
`;

export const IconButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: background-color 0.14s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

export const Body = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
  max-height: 60vh;
  overflow-x: hidden; /* evita scrollbar horizontal */
  overflow-y: auto;
`;

export const DescriptionView = styled.div`
  white-space: pre-wrap; /* respeita quebras de linha */
  overflow-wrap: anywhere; /* quebra palavras longas sem espaços */
  word-break: break-word; /* fallback */
  font-size: 14px;
  line-height: 1.5;
  max-height: 50vh;
  overflow-y: auto;
  color: #374151;
  padding: 8px 0;
`;

export const TitleInput = styled.input`
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e6e6f0;
  margin-bottom: 8px;
  box-sizing: border-box;
  color: #111827;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.12);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  min-height: 180px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e6e6f0;
  resize: vertical;
  font-size: 14px;
  color: #111827;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.06);
  }
`;

export const Footer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 16px;
  align-items: center;
`;

export const Button = styled.button<{ variant?: 'primary' | 'ghost' }>`
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  ${({ variant }) =>
    variant === 'primary'
      ? `
    background: linear-gradient(90deg,#7c3aed,#a78bfa);
    color: white;
  `
      : `
    background: #f3f4f6;
    color: #111827;
    border: 1px solid #e6e6f0;
  `}

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
