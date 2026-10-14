export function getStartOfTodayUTC7(startHour = 0) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const date = now.getUTCDate();
  const startOfDayUTC = new Date(Date.UTC(year, month, date, 0, 0, 0));
  const offsetMilliseconds = -(7 - startHour) * 60 * 60 * 1000;
  return new Date(startOfDayUTC.getTime() + offsetMilliseconds);
}

// Lấy thời điểm bắt đầu hôm qua (UTC+7)
export function getStartOfYesterdayUTC7(startHour = 0) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const date = now.getUTCDate();
  const startOfYesterdayUTC = new Date(
    Date.UTC(year, month, date - 1, 0, 0, 0),
  );
  const offsetMilliseconds = -(7 - startHour) * 60 * 60 * 1000;
  return new Date(startOfYesterdayUTC.getTime() + offsetMilliseconds);
}

// Lấy thời điểm bắt đầu ngày mai (UTC+7)
export function getStartOfTomorrowUTC7(startHour = 0) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const date = now.getUTCDate();
  const startOfTomorrowUTC = new Date(Date.UTC(year, month, date + 1, 0, 0, 0));
  const offsetMilliseconds = -(7 - startHour) * 60 * 60 * 1000;
  return new Date(startOfTomorrowUTC.getTime() + offsetMilliseconds);
}

export function getStartOfDayAfterTomorrowUTC7(startHour = 0) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const date = now.getUTCDate();
  const startOfTomorrowUTC = new Date(Date.UTC(year, month, date + 2, 0, 0, 0));
  const offsetMilliseconds = -(7 - startHour) * 60 * 60 * 1000;
  return new Date(startOfTomorrowUTC.getTime() + offsetMilliseconds);
}

export function getStartOfDayUTC7(datetime: Date, startHour = 0) {
  const year = datetime.getUTCFullYear();
  const month = datetime.getUTCMonth();
  const date = datetime.getUTCDate();
  const startOfDayUTC = new Date(Date.UTC(year, month, date, 0, 0, 0));
  const offsetMilliseconds = -(7 - startHour) * 60 * 60 * 1000;
  return new Date(startOfDayUTC.getTime() + offsetMilliseconds);
}

export function getStartOfMonthUTC7(startHour = 0) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const date = now.getUTCDate();
  const startOfDayUTC = new Date(Date.UTC(year, month, 1, 0, 0, 0));
  const offsetMilliseconds = -(7 - startHour) * 60 * 60 * 1000;
  return new Date(startOfDayUTC.getTime() + offsetMilliseconds);
}

export function isISODatetimeString(s: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  return regex.test(s);
}

export function toVNDatetimeString(date: Date): string {
  return date.toLocaleString('vn-VN', {
    hour12: false,
  });
}
