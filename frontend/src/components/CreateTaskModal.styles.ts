import { styled } from 'styled-components';

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  backdrop-filter: blur(4px);
`;

export const Modal = styled.div`
  width: 420px;
  max-width: 90vw;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  padding: 28px;
  z-index: 1201;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  @media (max-width: 480px) {
    padding: 18px;
  }
`;

export const Title = styled.h3`
  margin: 0 0 18px 0;
  font-size: 20px;
  font-weight: 700;
  color: #222222;
  text-align: center;
`;

export const Field = styled.div`
  margin-bottom: 16px;

  label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #444444;
  }

  /* Garantir que padding não quebre o layout */
  input,
  textarea,
  select {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box; /* <--- fundamental */
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px 12px; /* reduzido */
    font-size: 14px;
    background: #fafafa;
    color: #1f2937;
    outline-offset: 2px;
    transition:
      border-color 0.22s ease,
      box-shadow 0.22s ease;
    font-family: inherit;
    resize: vertical;
  }

  input:focus,
  textarea:focus,
  select:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 8px rgba(124, 58, 237, 0.18);
  }

  textarea {
    min-height: 90px;
  }

  @media (max-width: 480px) {
    input,
    textarea,
    select {
      padding: 10px;
      font-size: 13px;
    }
    textarea {
      min-height: 80px;
    }
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
`;

export const Button = styled.button<{ variant?: 'primary' | 'ghost' }>`
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  font-size: 14px;
  min-width: 100px;
  transition:
    background-color 0.25s ease,
    color 0.25s ease,
    box-shadow 0.25s ease;

  ${({ variant }) =>
    variant === 'primary'
      ? `
    background: linear-gradient(90deg, #7c3aed, #a78bfa);
    color: #fff;
    box-shadow: 0 6px 12px rgba(124, 58, 237, 0.25);
    &:hover:not(:disabled) {
      background: linear-gradient(90deg, #9333ea, #c4b5fd);
      box-shadow: 0 8px 16px rgba(147, 51, 234, 0.35);
    }
  `
      : `
    background: transparent;
    color: #6b7280;
    border: 1px solid #e6e6f0;
    &:hover:not(:disabled) {
      background: #f8fafc;
      color: #374151;
      border-color: #cbd5e1;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export const ErrorText = styled.div`
  color: #dc2626;
  font-size: 13px;
  margin-top: 8px;
  font-weight: 600;
  text-align: center;
`;
