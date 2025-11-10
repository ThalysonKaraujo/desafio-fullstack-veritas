import { styled, keyframes, css } from 'styled-components';

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(127, 91, 255, 0.28); }
  70% { box-shadow: 0 0 0 16px rgba(127, 91, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(127, 91, 255, 0); }
`;

export const Fab = styled.button<{ hidden?: boolean }>`
  position: fixed;
  top: 24px;
  right: 28px;
  width: 72px;
  height: 72px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(90deg, #6b5bff, #9b7dff);
  color: #fff;
  font-size: 34px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 36px rgba(99, 102, 241, 0.28);
  cursor: pointer;
  z-index: 1400;
  transition:
    transform 320ms cubic-bezier(0.2, 0.9, 0.2, 1),
    opacity 240ms ease,
    box-shadow 240ms ease;
  transform-origin: center;
  ${({ hidden }) =>
    hidden
      ? css`
          transform: translateY(-28px) scale(0.7);
          opacity: 0;
          pointer-events: none;
        `
      : css`
          &:hover {
            transform: translateY(-3px) scale(1.02);
          }
        `}

  &::after {
    content: '';
    position: absolute;
    border-radius: 14px;
    width: 100%;
    height: 100%;
    animation: ${pulse} 2s infinite;
    z-index: -1;
    left: 0;
    top: 0;
  }

  @media (max-width: 640px) {
    top: auto;
    bottom: 18px;
    right: 18px;
    width: 64px;
    height: 64px;
    font-size: 28px;
    border-radius: 999px;
  }
`;

export const Label = styled.div<{ hidden?: boolean }>`
  position: fixed;
  top: 34px;
  right: 110px;
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  font-size: 14px;
  padding: 10px 14px;
  border-radius: 999px;
  backdrop-filter: blur(6px);
  z-index: 1300;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  transition:
    transform 320ms cubic-bezier(0.2, 0.9, 0.2, 1),
    opacity 240ms ease;
  ${({ hidden }) =>
    hidden
      ? css`
          transform: translateY(-10px);
          opacity: 0;
          pointer-events: none;
        `
      : ``}

  @media (max-width: 880px) {
    display: none;
  }
`;
