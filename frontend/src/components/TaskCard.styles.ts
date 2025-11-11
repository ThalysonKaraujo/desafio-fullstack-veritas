import { styled } from 'styled-components';

export const Card = styled.div`
  background: #ffffff;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  margin-bottom: 12px;
  cursor: pointer;
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  }
`;

export const Title = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: #111827;
  word-break: break-word;
`;

export const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
`;

export const Description = styled.div`
  font-size: 13px;
  color: #374151;
  line-height: 1.4;
  /* TRUNCATE (cross-browser modern) */
  display: -webkit-box;
  -webkit-line-clamp: 3; /* número de linhas visíveis */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  /* fallback (garante que textos muito longos não ultrapassem) */
  max-height: calc(1.4em * 3);
  word-break: break-word;
`;
