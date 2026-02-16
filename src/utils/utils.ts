export const getMonthBounds = (monthKey: string) => {
  const [y, m] = monthKey.split('-').map(Number);
  if (!y || !m || m < 1 || m > 12) throw new Error('Invalid monthKey');

  // Use UTC to avoid timezone drift
  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
  const end = new Date(
    Date.UTC(m === 12 ? y + 1 : y, m === 12 ? 0 : m, 1, 0, 0, 0, 0),
  );
  return { start, end };
};
