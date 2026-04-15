import type { Column } from '@/types';

export function normalizeColumns(columns: Column[]): Column[] {
  return [...columns].sort((a, b) => a.order - b.order);
}

export function reindexColumns(columns: Column[]): Column[] {
  return columns.map((col, index) => ({
    ...col,
    order: index,
  }));
}

export function extractOrderUpdates(columns: Column[]) {
  return columns.map((col) => ({
    id: col.id,
    order: col.order,
  }));
}
