/**
 * دریافت تاریخ امروز به‌صورت شیء Date
 * @returns {Date}
 */
export function getToday() {
  return new Date();
}

/**
 * فرمت تاریخ شمسی به‌صورت YYYY/MM/DD
 * @param {Date} date
 * @returns {string}
 */
export function toJalali(date) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', options);
  return formatter.format(date);
}

/**
 * تبدیل تاریخ میلادی به شمسی با استفاده از Intl (بدون کتابخانه خارجی)
 * @param {Date} date
 * @returns {{ year: number, month: number, day: number }}
 */
export function toJalaliParts(date) {
  const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date);

  const get = (type) => Number(parts.find(p => p.type === type)?.value);
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
  };
}

/**
 * بررسی اینکه آیا دو تاریخ شمسی در یک روز هستند
 * @param {Date} date1
 * @param {Date} date2
 * @returns {boolean}
 */
export function isSameJalaliDay(date1, date2) {
  const d1 = toJalaliParts(date1);
  const d2 = toJalaliParts(date2);
  return d1.year === d2.year && d1.month === d2.month && d1.day === d2.day;
}