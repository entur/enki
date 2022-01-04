export const toDate = (date: string | undefined): Date | undefined => {
  if (!date) return;
  const [hours, minutes, seconds] = date.split(':');
  const dateObj = new Date();
  dateObj.setHours(parseInt(hours));
  dateObj.setMinutes(parseInt(minutes));
  dateObj.setSeconds(parseInt(seconds));

  return dateObj;
};
