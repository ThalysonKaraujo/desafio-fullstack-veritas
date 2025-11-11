import { styled } from 'styled-components';

export const Wrapper = styled('div')`
  padding: 24px;
  min-height: calc(100vh - 48px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #111827;
`;

export const Container = styled('div')`
  max-width: 1400px;
  margin: 0 auto;
`;

export const Header = styled('header')`
  color: white;
  text-align: center;
  margin-bottom: 24px;
  h1 {
    font-size: 2rem;
    margin-bottom: 6px;
    text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.15);
  }
  p {
    opacity: 0.9;
  }
`;

export const BoardGrid = styled('div')`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

export const Column = styled('div')<{
  variant?: 'todo' | 'in-progress' | 'done';
}>`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-6px);
  }

  .column-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
    padding-bottom: 12px;
    border-bottom: 3px solid
      ${({ variant }) =>
        variant === 'todo'
          ? '#3b82f6'
          : variant === 'in-progress'
            ? '#f59e0b'
            : '#10b981'};
  }

  .column-title {
    font-weight: 700;
    font-size: 1.15rem;
    color: ${({ variant }) =>
      variant === 'todo'
        ? '#3b82f6'
        : variant === 'in-progress'
          ? '#f59e0b'
          : '#10b981'};
  }

  .task-count {
    background: #f3f4f6;
    padding: 6px 12px;
    border-radius: 20px;
    font-weight: 600;
    color: #374151;
  }
`;

export const TasksList = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 120px;
`;

export const Card = styled('article')<{ disabled?: boolean }>`
  background: #ffffff;
  border-radius: 10px;
  padding: 14px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #c7d2fe; /* default */
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
  cursor: grab;

  &:hover {
    transform: translateX(6px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  }

  .title {
    font-weight: 700;
    color: #111827;
    margin-bottom: 6px;
  }
  .desc {
    font-size: 0.92rem;
    color: #6b7280;
    margin-bottom: 10px;
    line-height: 1.3;
  }
  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #9ca3af;
    font-size: 0.85rem;
  }
`;

export const Empty = styled('div')`
  color: #6b7280;
  font-style: italic;
  padding: 8px 4px;
`;
