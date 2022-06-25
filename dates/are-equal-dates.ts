const areEqualDates = (dateA: Date, dateB: Date): boolean => (
  dateA.toISOString() === dateB.toISOString()
);

export default areEqualDates;