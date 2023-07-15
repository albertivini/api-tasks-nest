export const STATUS = {
  PENDING: 'PENDING',
  DOING: 'DOING',
  DONE: 'DONE',
} as const;

export const STATUS_ARRAY = [...Object.values(STATUS)];
