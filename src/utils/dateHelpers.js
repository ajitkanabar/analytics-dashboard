export function enrichDataWithWeekInfo(data) {
  return data.map(row => {
    const date = new Date(row.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const week = getISOWeek(date);
    return { ...row, year, month, week };
  });
}

function getISOWeek(date) {
  const tmp = new Date(date.getTime());
  tmp.setHours(0, 0, 0, 0);
  tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7));
  const week1 = new Date(tmp.getFullYear(), 0, 4);
  return 1 + Math.round(((tmp.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}
export function getWeekOfMonthLabel(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return null;

  const dayOfMonth = date.getDate();
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const startDay = startOfMonth.getDay(); // 0 = Sunday, 1 = Monday...

  const weekOffset = (startDay === 0 ? 6 : startDay - 1); // shift Sunday to end
  const week = Math.ceil((dayOfMonth + weekOffset) / 7);

  return `W${week}`;
}
